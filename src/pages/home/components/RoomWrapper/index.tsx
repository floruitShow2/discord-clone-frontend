import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { FetchMessageList } from '@/api/chat-message'
import { MessageType, SocketEmitEvents, SocketOnEvents } from '@/constants'
import RoomHeader from '../RoomHeader'
import RoomBody from '../RoomBody'
import RoomInput from '../RoomInput'
import { RoomWrapperProps } from './index.interface'
import styles from './index.module.less'

function RoomWrapper(props: RoomWrapperProps) {
  const { room, onConfigChange } = props

  const [messages, setMessages] = useState<Message.Entity[]>([])
  const initMessage = async () => {
    console.log(room)
    if (!room) return
    try {
      const { data } = await FetchMessageList({ roomId: room.roomId, page: 1, pageSize: 10 })
      if (!data) return
      setMessages(data)
    } catch (err) {
      console.log(err)
    }
  }

  const [socket, setSocket] = useState<Socket>()
  const initSocket = () => {
    // connect the first room by default
    console.log('connected', socket)
    const socketInstance = io('http://localhost:3001', { query: { roomId: '6649fb83035a382e127368db' } })
    setSocket(socketInstance)
    if (!socket) return
    socket.on(SocketOnEvents.SOCKET_CONNECT, () => {
      socket.on(SocketOnEvents.MSG_CREATE, (msg) => {
        console.log('on', msg)
        handleMessageReceive(msg)
      })
    })
  }

  const handleMessageEmit = (createMessageInput: Message.CreateMessageInput) => {
    if (!socket) return
    socket.emit(SocketEmitEvents.CREATE_MESSAGE, createMessageInput)
  }
  const handleMessageReceive = (message: Message.Entity) => {
    console.log('handleMessageReceive been called', message)
    setMessages((prevVal) => [...prevVal, message])
  }

  useEffect(() => {
    initMessage()
    initSocket()
  }, [room])

  if (room) {
    return (
      <>
        <RoomHeader info={room} />
        <RoomBody className={styles['room-body']} info={room} messages={messages} onConfigChange={onConfigChange} />
        <RoomInput onMessageEmit={handleMessageEmit} />
      </>
    )
  } else {
    return <>请先选择联系人</>
  }
}

export default RoomWrapper
