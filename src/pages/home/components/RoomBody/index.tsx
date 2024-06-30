import { useContext, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useDebounceFn } from 'ahooks'
import { Watermark } from '@arco-design/web-react'
import { RootState } from '@/store'
import MessageList from '../MessageList'
import RoomDetails from '../RoomDetails'
import type { BaseProps } from './index.interface'
import './index.less'
import { RoomContext } from '../RoomWrapper'

const RoomBody = (props: BaseProps) => {
  const {
    className,
    showDetails = true,
    currentPage,
    onPageChange,
    onConfigChange,
    onIsNearBoyyomChange
  } = props

  const { msgs } = useContext(RoomContext)

  const { userInfo } = useSelector((state: RootState) => state.user)

  const msgWrapperRef = useRef<HTMLUListElement>(null)

  const { run } = useDebounceFn(onPageChange, { wait: 50 })

  const getWrapperRect = () => {
    if (!msgWrapperRef.current) return {}
    const { scrollHeight, clientHeight, scrollTop } = msgWrapperRef.current
    const maxScrollTop = scrollHeight - clientHeight
    const isNearBottomNow = scrollTop >= maxScrollTop - clientHeight

    // console.log({ scrollHeight, clientHeight, maxScrollTop, scrollTop, isNearBottomNow })

    return { scrollHeight, clientHeight, maxScrollTop, scrollTop, isNearBottomNow }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!msgWrapperRef.current) return
      const { scrollTop = 0, isNearBottomNow = true } = getWrapperRect()
      onIsNearBoyyomChange(isNearBottomNow)
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
  }, [msgs])

  return (
    <>
      <div className={`${className} flex items-start justify-between`}>
        <main ref={msgWrapperRef} className="flex-1 h-full bg-module overflow-auto">
          <Watermark
            className='w-full h-full overflow-auto'
            content={userInfo ? [userInfo.username, userInfo.phone.slice(-4)] : []}
            fontStyle={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.1)'
            }}
            zIndex={1}
          >
            <MessageList />
          </Watermark>
        </main>
        {showDetails && <RoomDetails onConfigChange={onConfigChange} />}
      </div>
    </>
  )
}

export default RoomBody
