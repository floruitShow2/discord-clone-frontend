import { useDebounceFn } from 'ahooks'
import { useEffect, useRef, useState } from 'react'

export enum ZoomEventsEnum {
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut'
}

export interface UseZoomOptions {
  wait?: number
}

export default function useZoom(options?: UseZoomOptions) {
  const { wait = 160 } = options || {}
  const isCtrl = useRef<boolean>(false)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const zoomLevelRef = useRef<number>(1)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Control' || e.ctrlKey) {
      isCtrl.current = true
    }
  }
  const handleKeyUp = (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.key === 'Control' || e.ctrlKey) {
      isCtrl.current = false
    }
  }
  const { run: handleZoomChange } = useDebounceFn(
    (type: ZoomEventsEnum, delta = 0.1) => {
      if (type === ZoomEventsEnum.ZOOM_IN) {
        zoomLevelRef.current += delta
      } else {
        zoomLevelRef.current -= delta
      }
      setZoomLevel(zoomLevelRef.current)
    },
    { wait }
  )
  const handleWheel = (e: WheelEvent) => {
    if (!isCtrl.current) return
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomChange(ZoomEventsEnum.ZOOM_IN, 0.05)
    } else {
      handleZoomChange(ZoomEventsEnum.ZOOM_OUT, 0.05)
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return {
    zoomLevel,
    handleZoomChange
  }
}
