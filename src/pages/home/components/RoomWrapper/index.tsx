import { createContext, useEffect, useRef, useState } from 'react'
import { Message } from '@arco-design/web-react'
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
  ClearRecords,
  CreateNormalMessage,
  FetchLocatedPage,
  FetchMessageList,
  RecallMessage,
  UpdateMessage
} from '@/api/chat-message'
import { SocketOnEvents } from '@/constants'
import { transalteMessagesByTime } from '@/utils/time'
import RoomHeader from '../RoomHeader'
import RoomBody from '../RoomBody'
import RoomInput from '../RoomInput'
import RoomDrawer, { renderRoomDrawer, RoomDrawerContentEnum } from '../RoomDrawer'
import { RoomContextProps, RoomProviderProps, RoomWrapperProps } from './index.interface'
import styles from './index.module.less'
import { RoomDrawerContentProps } from '../RoomDrawer/index.interface'

export const RoomContext = createContext<RoomContextProps>({
  room: null,
  msgs: [],
  replyId: '',
  locatedId: '',
  createMessage: undefined,
  clearRecords: undefined,
  locateMessage: undefined,
  clearLocatedId: undefined,
  replyMessage: undefined,
  openReplyChain: undefined,
  cancelReply: undefined,
  recallMessage: undefined
})

const RoomProvider = (props: RoomProviderProps) => {
  const { children, ...rest } = props
  return <RoomContext.Provider value={{ ...rest }}>{children}</RoomContext.Provider>
}

function RoomWrapper(props: RoomWrapperProps) {
  const { room, onConfigChange } = props

  const { userInfo } = useSelector((state: RootState) => state.user)
  const currentUser = useRef<User.UserEntity | null>()

  // 消息列表
  const [messages, setMessages] = useState<Message.Entity[]>([])
  const [formatMessages, setFormatMessages] = useState<Message.Entity[]>([])
  // 分页参数
  const [pageOptions, setPageOptions] = useState<Pagination.Input>({ page: 1, pageSize: 15 })
  const pageRange = useRef<number[]>([1, 1])
  // 已经加载过的消息列表，避免重复加载
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())

  const loadMessageByPage = async (currentPage: number) => {
    if (!room || loadedPages.has(currentPage)) return
    try {
      const { pageSize } = pageOptions
      const { data } = await FetchMessageList({ roomId: room.roomId, page: currentPage, pageSize })
      if (!data || !data?.length) {
        pageRange.current = [pageRange.current[0], currentPage - 1]
        return
      }
      // 设置原始消息数据，
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages]
        data.forEach((msg, index) => {
          const messageIndex = (currentPage - 1) * pageSize + index
          updatedMessages[messageIndex] = msg
        })
        return updatedMessages
      })
      setLoadedPages((prevPages) => new Set(prevPages).add(currentPage))
    } catch (err) {
      console.log(err)
    }
  }

  const socket = useRef<Socket>()
  const initSocket = () => {
    // connect the first room by default
    // const socketInstance = io('http://192.168.124.12:3001', {
    if (!socket.current) {
      const socketInstance = io('http://localhost:3001', {
        query: { roomId: room?.roomId }
      })
      socket.current = socketInstance
    }

    socket.current.on(SocketOnEvents.SOCKET_CONNECT, () => {
      if (!socket.current) return
      socket.current.on(SocketOnEvents.MSG_CREATE, (msg) => {
        handleMessageReceive(msg)
      })
      socket.current.on(SocketOnEvents.MSG_RECALL, (messageId: string, msgs: Message.Entity[]) => {
        handleMessageRecall(messageId, msgs)
      })
    })
  }

  const [roomDrawerVisible, setRoomDrawerVisible] = useState(false)
  const [roomDrawerProps, setRoomDrawerProps] = useState<Omit<RoomDrawerContentProps, 'onClose'>>({
    type: RoomDrawerContentEnum.REPLY_CHAIN,
    messageId: ''
  })

  // 发送消息
  const onMessageCreate = async (createMessageInput: Message.CreateMessageInput) => {
    const { data } = await CreateNormalMessage(createMessageInput)
    return data
  }
  // 更新消息
  const onMessageUpdate = async (updateMessageInput: Message.UpdateMessageInput) => {
    try {
      const { data } = await UpdateMessage(updateMessageInput)
      if (!data) console.warn('消息更新失败')

      const { messageId, content, type } = updateMessageInput
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.messageId === messageId ? { ...message, content, type } : message
        )
      )
    } catch (err) {
      console.log(err)
    }
  }
  // 接收消息
  const handleMessageReceive = (msgs: Message.Entity[]) => {
    const totalMessages = [...messages, ...msgs]
    setMessages((prev) => [...prev, ...msgs])
    const hasNewMsg = totalMessages.some(
      (msg) => msg.profile.userId !== currentUser.current?.userId
    )
    if (!isNearBottom.current && hasNewMsg) {
      Message.info({
        content: 'you got new message',
        duration: 2000
      })
    }
  }
  // 定位消息
  const [locatedId, setLocatedId] = useState('')
  useEffect(() => {
    if (!locatedId) return
    setTimeout(() => {
      const item = document.querySelector(`[data-id="${locatedId}"]`)
      if (item) {
        item.scrollIntoView()
      }
      // 延时时间长点，避免 滚动到底事件 与 定位事件 冲突
    }, 300)
  }, [locatedId])
  const onClearLocatedId = () => {
    setLocatedId('')
  }
  const onLocateMessage = async (msg: Message.Entity) => {
    const item = document.querySelector(`[data-id="${locatedId}"]`)
    if (item) {
      setLocatedId(msg.messageId)
      return
    }
    const { roomId, messageId } = msg
    const { data: locatedPage } = await FetchLocatedPage({
      roomId,
      messageId,
      pageSize: pageOptions.pageSize
    })
    if (!locatedPage || locatedPage < 1) return
    const { pageSize } = pageOptions
    const prevPage = locatedPage - 1
    const nextPage = locatedPage + 1
    const { data: prevMessages } = !!prevPage
      ? await FetchMessageList({ roomId: roomId, page: prevPage, pageSize })
      : { data: [] }
    const { data: curMessages } = await FetchMessageList({
      roomId: roomId,
      page: locatedPage,
      pageSize
    })
    const { data: nextMessages } = await FetchMessageList({
      roomId: roomId,
      page: nextPage,
      pageSize
    })

    const totalMessages = [...(prevMessages || []), ...(curMessages || []), ...(nextMessages || [])]
    if (!totalMessages.length) return
    setRoomDrawerVisible(false)
    setMessages(totalMessages)
    setLoadedPages(new Set(prevPage ? [prevPage, locatedPage, nextPage] : [locatedPage, nextPage]))
    pageRange.current = [!!prevPage ? prevPage : 1, nextPage]
    onPageChange(locatedPage)
    setLocatedId(messageId)
  }
  // 回复消息
  const [curReplyId, setCurReplyId] = useState<string>('')
  const onMessageReply = (msg: Message.Entity) => {
    setCurReplyId(msg.messageId)
  }
  const onReplyCancel = () => {
    setCurReplyId('')
  }
  const onSearchReplyChain = (message: Message.Entity) => {
    setRoomDrawerVisible(true)
    setRoomDrawerProps({
      type: RoomDrawerContentEnum.REPLY_CHAIN,
      messageId: message.messageId,
      roomId: message.roomId
    })
  }
  // 撤回消息
  const onMessageRecall = async (msg: Message.Entity) => {
    await RecallMessage({ messageId: msg.messageId })
  }
  const handleMessageRecall = (messageId: string, recallMessages: Message.Entity[]) => {
    setMessages((prev) => {
      const findIdx = prev.findIndex((item) => item.messageId === messageId)
      if (findIdx !== -1) prev.splice(findIdx, 1)
      return [...prev, ...recallMessages]
    })
  }
  // 清空聊天记录
  const onRecordsClear = async (roomId: string) => {
    try {
      await ClearRecords(roomId)
      setMessages([])
    } catch (err) {
      console.log(err)
    }
  }

  const onPageChange = async (curPage: number) => {
    const [prev, next] = pageRange.current
    pageRange.current = [curPage < prev ? curPage : prev, curPage > next ? curPage : next]
    setPageOptions((prevVal) => ({ ...prevVal, page: curPage }))
  }

  const isNearBottom = useRef<Boolean>(true)
  const handleAllowScrollChange = (nearBottom: boolean) => {
    isNearBottom.current = nearBottom
  }

  useEffect(() => {
    currentUser.current = userInfo
  }, [userInfo])

  useEffect(() => {
    loadMessageByPage(pageOptions.page)
  }, [pageOptions])

  useEffect(() => {
    // 房间号发生变化，清空已加载数据
    setMessages([])
    setLoadedPages(new Set())
    setPageOptions((prev) => ({ ...prev, page: 1, pageSize: 15 }))
    if (room) initSocket()
  }, [room])

  useEffect(() => {
    setFormatMessages(transalteMessagesByTime(messages))
  }, [messages])

  if (room) {
    return (
      <RoomProvider
        room={room}
        msgs={formatMessages}
        replyId={curReplyId}
        locatedId={locatedId}
        replyMessage={onMessageReply}
        recallMessage={onMessageRecall}
        createMessage={onMessageCreate}
        updateMessage={onMessageUpdate}
        locateMessage={onLocateMessage}
        clearRecords={onRecordsClear}
        clearLocatedId={onClearLocatedId}
        cancelReply={onReplyCancel}
        openReplyChain={onSearchReplyChain}
      >
        <RoomHeader />
        <RoomBody
          className={styles['room-body']}
          roomPage={pageOptions.page}
          roomPageRange={pageRange.current}
          onPageChange={onPageChange}
          onConfigChange={onConfigChange}
          onIsNearBottomChange={handleAllowScrollChange}
        />
        <RoomInput className="h-40" />
        <RoomDrawer visible={roomDrawerVisible} onClose={() => setRoomDrawerVisible(false)}>
          {renderRoomDrawer({
            ...roomDrawerProps,
            roomId: room.roomId,
            onClose() {
              setRoomDrawerVisible(false)
            }
          })}
        </RoomDrawer>
      </RoomProvider>
    )
  } else {
    return <>请先选择联系人</>
  }
}

export default RoomWrapper
