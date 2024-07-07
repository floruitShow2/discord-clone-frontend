import { HTMLAttributes } from 'react'

export interface NormalMessageProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  locatedId?: string
  // 是否禁用
  disabled?: boolean
  // 是否支持消息定位
  inReplyChain?: boolean
  // 预览文件
  onPreview?: Room.RoomContextMethod
  // 定位消息
  onLocate?: Room.RoomContextMethod
  onClearLocatedId?: () => void
  // 撤回消息
  onRecall?: Room.RoomContextMethod
  // 回复消息
  onReply?: Room.RoomContextMethod
  // 点击回复的目标消息
  onClickReplyMsg?: Room.RoomContextMethod
}

export interface DropdownListProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  disabled: boolean
  inReplyChain: boolean
  userInfo: User.UserEntity | null
  onRecall?: Room.RoomContextMethod
  onReply?: Room.RoomContextMethod
  onLocate?: Room.RoomContextMethod
}
