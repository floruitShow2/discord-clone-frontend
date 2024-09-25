import { useCallback, useRef } from 'react'

type AnyFunction = (...args: any[]) => any

interface DebouncedFunction<T extends AnyFunction> {
  (...args: Parameters<T>): void
  cancel: () => void
}

interface UseDebounceOptions {
  wait?: number
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

export function useDebounceFn<T extends AnyFunction>(
  fn: T,
  options: UseDebounceOptions = {}
): DebouncedFunction<T> {
  const { wait = 300, leading = false, trailing = true, maxWait } = options

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const fnRef = useRef<T>(fn)
  const lastCallTime = useRef<number | null>(null)
  const lastInvokeTime = useRef<number>(0)
  const lastArgs = useRef<Parameters<T> | null>(null)

  // 更新最新的函数引用
  fnRef.current = fn

  const invokeFunc = useCallback((time: number) => {
    const args = lastArgs.current
    lastArgs.current = null
    lastInvokeTime.current = time
    fnRef.current(...(args as Parameters<T>))
  }, [])

  const startTimer = useCallback((pendingFunc: () => void, wait: number) => {
    timeoutRef.current = setTimeout(pendingFunc, wait)
  }, [])

  const cancelTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const leadingEdge = useCallback(
    (time: number) => {
      lastInvokeTime.current = time
      if (leading) {
        invokeFunc(time)
      }
      startTimer(trailingEdge, wait)
    },
    [leading, wait, invokeFunc, startTimer]
  )

  const trailingEdge = useCallback(() => {
    timeoutRef.current = null
    if (trailing && lastArgs.current !== null) {
      invokeFunc(Date.now())
    }
    cancelMaxWaitTimer()
  }, [trailing, invokeFunc])

  const startMaxWaitTimer = useCallback(() => {
    cancelMaxWaitTimer()
    maxWaitTimeoutRef.current = setTimeout(timerExpired, maxWait)
  }, [maxWait])

  const cancelMaxWaitTimer = useCallback(() => {
    if (maxWaitTimeoutRef.current !== null) {
      clearTimeout(maxWaitTimeoutRef.current)
      maxWaitTimeoutRef.current = null
    }
  }, [])

  const timerExpired = useCallback(() => {
    const time = Date.now()
    if (lastArgs.current !== null) {
      invokeFunc(time)
    }
    cancelTimer()
  }, [invokeFunc, cancelTimer])

  const debounced = useCallback<any>(
    (...args: Parameters<T>) => {
      const time = Date.now()
      lastArgs.current = args
      lastCallTime.current = time

      const remaining = wait - (time - (lastInvokeTime.current || 0))

      if (remaining <= 0 || remaining > wait) {
        if (timeoutRef.current !== null) {
          cancelTimer()
        }
        leadingEdge(time)
      } else if (timeoutRef.current === null) {
        startTimer(trailingEdge, remaining)
      }

      if (maxWait !== undefined && !maxWaitTimeoutRef.current) {
        startMaxWaitTimer()
      }
    },
    [wait, maxWait, leadingEdge, startTimer, trailingEdge, cancelTimer, startMaxWaitTimer]
  )

  debounced.cancel = useCallback(() => {
    lastArgs.current = null
    lastCallTime.current = null
    cancelTimer()
    cancelMaxWaitTimer()
  }, [cancelTimer, cancelMaxWaitTimer])

  return debounced
}
