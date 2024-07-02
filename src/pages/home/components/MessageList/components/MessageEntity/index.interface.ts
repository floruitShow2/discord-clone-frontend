import { HTMLAttributes } from 'react'

export interface NormalMessageProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  disabled?: boolean
  onPreview?: (msg: Message.Entity) => void
  onRecall?: (msg: Message.Entity) => void
  // 回复消息
  onReply?: (msg: Message.Entity) => void
  // 点击回复的目标消息
  onClickReplyMsg?: (msg: Message.Entity) => void
}

export interface DropdownListProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  userInfo: User.UserEntity | null
  onRecall?: (msg: Message.Entity) => void
  onReply?: (msg: Message.Entity) => void
}
