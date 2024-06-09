import { useEffect, useRef, useState } from 'react'
import Plyr from 'plyr'
import useLoadCSS from '@/hooks/sources/useLoadCSS'
import { FetchVideoFrame } from '@/api/file'
import { cs } from '@/utils/property'
import { translateSecondsToTimeCount } from '@/utils/time'
import type { RendererProps } from '@/components/filePreviewer/index.interface'
import styles from './index.module.less'
import './index.less'
import { useDebounceFn } from '@/hooks/useDebounce'

export default function VideoRenderer(props: RendererProps) {
  const { url } = props

  useLoadCSS('https://cdn.plyr.io/3.6.8/plyr.css')

  const rendererId = 'video-renderer'
  // 外部容器引用
  const wrapperRef = useRef<HTMLDivElement>(null)
  const wrapperOffset = useRef<number>(0)
  
  const [player, setPlayer] = useState<Plyr>()

  // 进度条，截图弹窗
  const [showShoot, setShowShoot] = useState<boolean>(false)
  const [frameShoot, setFrameShoot] = useState<string>('')
  const [position, setPosition] = useState<Record<string, number>>({ x: 0, y: 0, width: 0 })
  const progressBarRect = useRef<DOMRect>()

  const [currentTime, setCurrentTime] = useState<number>(0)

  const updateFrameShoot = useDebounceFn(async (seconds: number) => {
    try {
      const { data } = await FetchVideoFrame({ url, seconds })
      if (!data) {
        setShowShoot(false)
      } else {
        setFrameShoot('data:image/*;base64 ' + data)
      }
    } catch (err) {
      console.log(err)
      setShowShoot(false)
    }
  }, { wait: 100 })
  const updateCurrentTime = async (rect: DOMRect, event: MouseEvent) => {
      const { width, left } = rect
      const { pageX } = event
      const curTimestamp = Math.floor((player?.duration || 0) * (pageX - left) / width)
      updateFrameShoot(curTimestamp)
      setCurrentTime(curTimestamp)
  }
  const initProgressEvents = () => {
    if (!player || !wrapperRef.current) return
    const progressBar = (player.elements as unknown as { progress: HTMLDivElement }).progress
    if (!progressBar) return
    const progressRect = progressBar.getBoundingClientRect()
    setPosition((prevVal) => ({ ...prevVal, y: progressRect.top - progressRect.height * 2 }))

    progressBar.addEventListener('mouseenter', (event) => {
      const progressBar = (player.elements as unknown as { progress: HTMLDivElement }).progress
      if (!progressBar) return
      progressBarRect.current = progressBar.getBoundingClientRect()

      updateCurrentTime(progressBarRect.current, event)

      setShowShoot(true)
      setPosition((prevVal) => ({...prevVal, ...{ x: event.clientX - wrapperOffset.current }}))
    })
    progressBar.addEventListener('mousemove', (event: MouseEvent) => {
      if (!progressBarRect.current) return
      updateCurrentTime(progressBarRect.current, event)
      setPosition((prevVal) => ({...prevVal, ...{ x: event.clientX - wrapperOffset.current }}))
    })
    progressBar.addEventListener('mouseleave', () => {
      setShowShoot(false)
    })
  }
  const renderVideo = async () => {
    const player = new Plyr(`#${rendererId}`, {
      captions: {
        active: true,
        language: 'auto',
        update: true
      },
      i18n: {
        captions: '字幕',
        disabled: '关闭',
        speed: '播放速度',
        normal: '1×'
      }
    })
    setPlayer(player)
    
    if (wrapperRef.current) wrapperOffset.current = wrapperRef.current.getBoundingClientRect().left
  }

  useEffect(() => {
    initProgressEvents()
  }, [player])

  useEffect(() => {
    renderVideo()
  }, [])

  return (
    <div ref={wrapperRef} className={cs('video-renderer', 'relative w-full h-full flex flex-col items-center justify-center')}>
      <video id={rendererId} className='w-full' controls crossOrigin=''>
          <source src={url} type="video/mp4" sizes="1080" />

          {/* <track kind="captions" label="English" srcLang="en" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt" default /> */}
          {/* <track kind="captions" label="Français" srcLang="fr" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.fr.vtt"></track> */}
          <a href={url} download>Download</a>
      </video>

      {showShoot && <div className='absolute transition-transform' style={{ top: position.y + 'px', left: position.x + 'px', pointerEvents: 'none' }}>
        <div className={styles['video-renderer-frame']}>
          <img className='h-full' src={frameShoot} alt="" />
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 py-1 px-2 text-xs text-primary bg-[#23282f99] flex items-center justify-center'>
            {translateSecondsToTimeCount(currentTime)}
          </div>
        </div>
      </div>}
    </div>
  )
}
