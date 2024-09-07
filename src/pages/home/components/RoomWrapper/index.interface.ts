import { HTMLAttributes } from 'react'
export interface RoomContextProps {
  room: Room.RoomEntity | null
  msgs: Message.Entity[]
  replyId: string
  locatedId: string
  // 发送消息
  createMessage?: (createMessageInput: Message.CreateMessageInput) => Promise<Message.Entity | null>
  // 清空聊天记录
  clearRecords?: (roomId: string) => void
  // 定位消息
  locateMessage?: Room.RoomContextMethod
  // 清空定位消息，取消它的样式
  clearLocatedId?: () => void
  // 回复消息
  replyMessage?: Room.RoomContextMethod
  // 查询回复消息链路
  openReplyChain?: Room.RoomContextMethod
  // 取消回复消息
  cancelReply?: () => void
  // 撤回消息
  recallMessage?: Room.RoomContextMethod
}

export interface RoomProviderProps extends RoomContextProps {
  children: React.ReactNode
}

export interface RoomWrapperProps extends HTMLAttributes<HTMLElement> {
  room: Room.RoomEntity | null
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
