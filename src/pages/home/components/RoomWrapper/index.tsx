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
  RecallMessage
} from '@/api/chat-message'
import { SocketEmitEvents, SocketOnEvents } from '@/constants'
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
  handleCreate: undefined,
  handleClear: undefined,
  handleLocated: undefined,
  handleReply: undefined,
  handleReplyChain: undefined,
  handleReplyCancel: undefined,
  handleRecall: undefined
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
  // 已经加载过的消息列表，避免重复加载
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())

  const loadMessageByPage = async (currentPage: number) => {
    if (!room || loadedPages.has(currentPage)) return
    try {
      const { pageSize } = pageOptions
      const { data } = await FetchMessageList({ roomId: room.roomId, page: currentPage, pageSize })
      if (!data || !data?.length) return
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
    socketInstance.on(SocketOnEvents.SOCKET_CONNECT, () => {
      socketInstance.on(SocketOnEvents.MSG_CREATE, (msg) => {
        handleMessageReceive(msg)
      })
      socketInstance.on(SocketOnEvents.MSG_RECALL, (messageId: string, msgs: Message.Entity[]) => {
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
  const onLocateMessage = async (messageId: string) => {
    if (!room) return
    const { data } = await FetchLocatedPage({
      roomId: room.roomId,
      messageId,
      pageSize: pageOptions.pageSize
    })
    if (!data || data < 1) return
    console.log(data)
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
      const newMessages = [...prev, ...recallMessages]
      console.log('a', messageId, prev, recallMessages, newMessages)
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

  const handlePageChange = async (curPage: number) => {
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
    setPageOptions({ page: 1, pageSize: 15 })
    initSocket()
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
        handleCreate={onMessageCreate}
        handleClear={onRecordsClear}
        handleLocated={onLocateMessage}
        handleRecall={onMessageRecall}
        handleReply={onMessageReply}
        handleReplyCancel={onReplyCancel}
        handleReplyChain={onSearchReplyChain}
      >
        <RoomHeader info={room} />
        <RoomBody
          className={styles['room-body']}
          roomPage={pageOptions.page}
          onPageChange={handlePageChange}
          onConfigChange={onConfigChange}
          onIsNearBottomChange={handleAllowScrollChange}
        />
        <RoomInput />
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
