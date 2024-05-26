import { useEffect, useRef } from 'react'
import { useDebounceFn } from 'ahooks'
import MessageList from '../MessageList'
import RoomDetails from '../RoomDetails'
import type { BaseProps } from './index.interface'
import './index.less'

const RoomBody = (props: BaseProps) => {
  const {
    className,
    info,
    messages,
    showDetails = true,
    currentPage,
    onPageChange,
    onConfigChange,
    onAllowScrollChange
  } = props

  const msgWrapperRef = useRef<HTMLUListElement>(null)

  const { run } = useDebounceFn(onPageChange, { wait: 50 })

  const getWrapperRect = () => {
    if (!msgWrapperRef.current) return {}
    const { scrollHeight, clientHeight, scrollTop } = msgWrapperRef.current
    const maxScrollTop = scrollHeight - clientHeight
    const isNearBottomNow = scrollTop >= maxScrollTop - clientHeight

    console.log({ scrollHeight, clientHeight, maxScrollTop, scrollTop, isNearBottomNow })

    return { scrollHeight, clientHeight, maxScrollTop, scrollTop, isNearBottomNow }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!msgWrapperRef.current) return
      const { scrollTop = 0, isNearBottomNow = true } = getWrapperRect()
      onAllowScrollChange(isNearBottomNow)
      if (scrollTop < 100 || scrollTop === 0) run()
    }

    const container = msgWrapperRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [msgWrapperRef])

  useEffect(() => {
    if (!msgWrapperRef.current) return

    msgWrapperRef.current.scrollIntoView({ behavior: 'smooth' })
    const { isNearBottomNow, maxScrollTop = 0 } = getWrapperRect()

    if (isNearBottomNow || currentPage === 1) {
      msgWrapperRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
    }
  }, [messages])

  return (
    <>
      <div className={`${className} flex items-start justify-between`}>
        <main ref={msgWrapperRef} className="flex-1 h-full bg-module overflow-auto">
          <MessageList msgs={messages} />
        </main>
        {showDetails && <RoomDetails info={info} onConfigChange={onConfigChange} />}
      </div>
    </>
  )
}

export default RoomBody
