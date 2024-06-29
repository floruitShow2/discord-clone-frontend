import { HTMLAttributes } from 'react'
export interface BaseProps extends HTMLAttributes<HTMLUListElement> {}

export interface NormalMessageProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  onPreview: (msg: Message.Entity) => void
  onRecall?: (msg: Message.Entity) => void
}

export interface DropdownListProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  userInfo: User.UserEntity | null
  handleRecall?: (msg: Message.Entity) => void
}
