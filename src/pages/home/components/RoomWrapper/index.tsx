import { createContext, useEffect, useRef, useState } from 'react'
import { Message } from '@arco-design/web-react'
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FetchMessageList, RecallMessage } from '@/api/chat-message'
import { SocketEmitEvents, SocketOnEvents } from '@/constants'
import { transalteMessagesByTime } from '@/utils/time'
import RoomHeader from '../RoomHeader'
import RoomBody from '../RoomBody'
import RoomInput from '../RoomInput'
import { RoomContextProps, RoomProviderProps, RoomWrapperProps } from './index.interface'
import styles from './index.module.less'

export const RoomContext = createContext<RoomContextProps>({
  msgs: [],
  handleRecall: undefined
})

const RoomProvider = (props: RoomProviderProps) => {
  const { msgs, children, handleRecall } = props
  return <RoomContext.Provider value={{ msgs, handleRecall }}>
    {children}
  </RoomContext.Provider>
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

  const initMessage = async () => {
    if (!room) return
    try {
      const { data } = await FetchMessageList({ roomId: room.roomId, ...pageOptions })
      if (!data || !data?.length) return
      const totalMessages = pageOptions.page === 1 ? [...data] : [...data, ...messages]
      // 设置原始消息数据
      setMessages(totalMessages)
      // 原始数据经过处理后再设置，页面展示这些
    } catch (err) {
      console.log(err)
    }
  }

  const [socket, setSocket] = useState<Socket>()
  const initSocket = () => {
    // connect the first room by default
    const socketInstance = io('http://localhost:3001', {
      query: { roomId: room?.roomId }
    })
    setSocket(socketInstance)
    console.log('start connect')
    socketInstance.on(SocketOnEvents.SOCKET_CONNECT, () => {
      console.log('connected')
      socketInstance.on(SocketOnEvents.MSG_CREATE, (msg) => {
        handleMessageReceive(msg)
      })
    })
  }

  // 发送消息
  const handleMessageEmit = (createMessageInput: Message.CreateMessageInput) => {
    if (!socket) return
    socket.emit(SocketEmitEvents.CREATE_MESSAGE, createMessageInput)
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
  // 撤回消息
  const handleMessageRecall = async (msg: Message.Entity) => {
    const findIdx = messages.findIndex(item => item.messageId === msg.messageId)
    const newMessages = [...messages]
    newMessages.splice(findIdx, 1)
    setMessages(newMessages)

    await RecallMessage({ messageId: msg.messageId })
  }

  const handlePageChange = async () => {
    setPageOptions((prevVal) => ({ ...pageOptions, page: prevVal.page + 1 }))
  }

  const isNearBottom = useRef<Boolean>(true)
  const handleAllowScrollChange = (nearBottom: boolean) => {
    isNearBottom.current = nearBottom
  }

  useEffect(() => {
    currentUser.current = userInfo
  }, [userInfo])

  useEffect(() => {
    initMessage()
  }, [pageOptions])

  useEffect(() => {
    setPageOptions({ page: 1, pageSize: 15 })
    initSocket()
  }, [room])

  useEffect(() => {
    setFormatMessages(transalteMessagesByTime(messages))
  }, [messages])

  if (room) {
    return (
      <RoomProvider msgs={formatMessages} handleRecall={handleMessageRecall}>
        <RoomHeader info={room} />
        <RoomBody
          className={styles['room-body']}
          info={room}
          currentPage={pageOptions.page}
          onIsNearBoyyomChange={handleAllowScrollChange}
          onPageChange={handlePageChange}
          onConfigChange={onConfigChange}
        />
        <RoomInput info={room} onMessageEmit={handleMessageEmit} />
      </RoomProvider>
    )
  } else {
    return <>请先选择联系人</>
  }
}

export default RoomWrapper
