import { HTMLAttributes } from 'react'
export interface RoomContextProps {
  room: Room.RoomEntity | null
  msgs: Message.Entity[]
  replyId: string
  locatedId: string
  // 发送消息
  handleCreate?: (createMessageInput: Message.CreateMessageInput) => Promise<Message.Entity | null>
  // 清空聊天记录
  handleClear?: (roomId: string) => void
  handleLocated?: Room.RoomContextMethod
  handleClearLocatedId?: () => void
  // 回复消息
  handleReply?: Room.RoomContextMethod
  // 查询回复消息链路
  handleReplyChain?: Room.RoomContextMethod
  // 取消回复消息
  handleReplyCancel?: () => void
  // 撤回消息
  handleRecall?: Room.RoomContextMethod
}

export interface RoomProviderProps extends RoomContextProps {
  children: React.ReactNode
}

export interface RoomWrapperProps extends HTMLAttributes<HTMLElement> {
  room: Room.RoomEntity | null
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
