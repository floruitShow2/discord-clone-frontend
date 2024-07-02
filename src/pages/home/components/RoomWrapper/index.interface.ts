import { HTMLAttributes } from 'react'

interface RoomContextMethod {
  (msg: Message.Entity): void
}
export interface RoomContextProps {
  room: Room.RoomEntity | null
  msgs: Message.Entity[]
  replyId: string
  // 清空聊天记录
  handleClear?: (roomId: string) => void
  // 回复消息
  handleReply?: RoomContextMethod
  // 取消回复消息
  handleReplyCancel?: () => void
  // 撤回消息
  handleRecall?: RoomContextMethod
}

export interface RoomProviderProps extends RoomContextProps {
  children: React.ReactNode
}

export interface RoomWrapperProps extends HTMLAttributes<HTMLElement> {
  room: Room.RoomEntity | null
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
