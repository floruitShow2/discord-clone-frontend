import { HTMLAttributes } from 'react'

export interface MessageListProps extends HTMLAttributes<HTMLUListElement> {
  msgs: Message.Entity[]
  disabled?: boolean
  onRecall?: (msg: Message.Entity) => void
  onReply?: (msg: Message.Entity) => void
  onClickReplyMsg?: (msg: Message.Entity) => void
}

export interface NormalMessageProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  onPreview: (msg: Message.Entity) => void
  onRecall?: (msg: Message.Entity) => void
  onReply?: (msg: Message.Entity) => void
}

export interface DropdownListProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  userInfo: User.UserEntity | null
  onRecall?: (msg: Message.Entity) => void
  onReply?: (msg: Message.Entity) => void
}
