import { useCallback, useEffect, useRef, useState } from 'react'
import { Message } from '@arco-design/web-react'
import { io, Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FetchMessageList } from '@/api/chat-message'
import { SocketEmitEvents, SocketOnEvents } from '@/constants'
import RoomHeader from '../RoomHeader'
import RoomBody from '../RoomBody'
import RoomInput from '../RoomInput'
import { RoomWrapperProps } from './index.interface'
import styles from './index.module.less'
import { transalteMessagesByTime } from '@/utils/time'

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
      setFormatMessages(transalteMessagesByTime(totalMessages))
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
    if (!socket) return
    socket.on(SocketOnEvents.SOCKET_CONNECT, () => {
      socket.on(SocketOnEvents.MSG_CREATE, (msg) => {
        handleMessageReceive(msg)
      })
    })
  }

  const handleMessageEmit = (createMessageInput: Message.CreateMessageInput) => {
    if (!socket) return
    socket.emit(SocketEmitEvents.CREATE_MESSAGE, createMessageInput)
  }
  const handleMessageReceive = (message: Message.Entity) => {
    setMessages((prevVal) => [...prevVal, message])

    if (isNearBottom.current && message.profile.userId !== currentUser.current?.userId) {
      Message.info({
        content: 'you got new message',
        duration: 2000
      })
    }
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

  if (room) {
    return (
      <>
        <RoomHeader info={room} />
        <RoomBody
          className={styles['room-body']}
          info={room}
          messages={formatMessages}
          currentPage={pageOptions.page}
          onAllowScrollChange={handleAllowScrollChange}
          onPageChange={handlePageChange}
          onConfigChange={onConfigChange}
        />
        <RoomInput onMessageEmit={handleMessageEmit} />
      </>
    )
  } else {
    return <>请先选择联系人</>
  }
}

export default RoomWrapper
