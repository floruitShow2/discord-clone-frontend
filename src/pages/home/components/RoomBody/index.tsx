import { useContext, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useDebounceFn } from 'ahooks'
import { Watermark } from '@arco-design/web-react'
import { RootState } from '@/store'
import MessageList from '../MessageList'
import RoomDetails from '../RoomDetails'
import { RoomContext } from '../RoomWrapper'
import type { RoomBodyProps } from './index.interface'
import './index.less'

const RoomBody = (props: RoomBodyProps) => {
  const {
    className,
    showDetails = true,
    roomPage,
    onPageChange,
    onConfigChange,
    onIsNearBottomChange
  } = props

  const { msgs, handleRecall, handleReply, handleReplyChain } = useContext(RoomContext)

  const { userInfo } = useSelector((state: RootState) => state.user)

  const msgWrapperRef = useRef<HTMLUListElement>(null)

  const page = useRef(roomPage)
  useEffect(() => {
    console.log(roomPage)
    page.current = roomPage
  }, [roomPage])

  const { run } = useDebounceFn(onPageChange, { wait: 50 })

  const getWrapperRect = () => {
    if (!msgWrapperRef.current) return {}
    const { scrollHeight, clientHeight, scrollTop } = msgWrapperRef.current
    const maxScrollTop = scrollHeight - clientHeight
    const isNearBottomNow = scrollTop >= maxScrollTop - clientHeight * 0.6

    // console.log({ scrollHeight, clientHeight, maxScrollTop, scrollTop, isNearBottomNow })

    return { scrollHeight, clientHeight, maxScrollTop, scrollTop, isNearBottomNow }
  }

  // 监听消息列表的滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (!msgWrapperRef.current) return
      const {
        scrollTop = 0,
        isNearBottomNow = true,
        clientHeight = 800,
        scrollHeight = 800
      } = getWrapperRect()
      onIsNearBottomChange(isNearBottomNow)
      const curPage = page.current
      if (scrollTop < clientHeight * 0.6) {
        run(curPage + 1)
      } else if (scrollTop >= scrollHeight - clientHeight) {
        run(curPage - 1 <= 0 ? 1 : curPage - 1)
      }
    }

    const container = msgWrapperRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [msgWrapperRef])

  // 如果在第一页接收到新消息，滚动到底部
  useEffect(() => {
    if (!msgWrapperRef.current) return

    msgWrapperRef.current.scrollIntoView({ behavior: 'smooth' })
    const { isNearBottomNow, maxScrollTop = 0 } = getWrapperRect()

    if (isNearBottomNow || page.current === 1) {
      msgWrapperRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
    }
  }, [msgs])

  return (
    <>
      <div className={`${className} relative flex items-start justify-between`}>
        <main ref={msgWrapperRef} className="flex-1 h-full bg-module overflow-auto">
          <Watermark
            className="w-full min-height-full"
            content={userInfo ? [userInfo.username, userInfo.phone.slice(-4)] : []}
            fontStyle={{
              fontSize: '14px',
              color: 'rgba(0, 0, 0, 0.1)'
            }}
            zIndex={1}
          >
            <MessageList
              msgs={msgs}
              onRecall={handleRecall}
              onReply={handleReply}
              onClickReplyMsg={handleReplyChain}
            />
          </Watermark>
        </main>
        {showDetails && <RoomDetails onConfigChange={onConfigChange} />}
      </div>
    </>
  )
}

export default RoomBody
