import { HTMLAttributes } from 'react'

export interface MessageListProps extends HTMLAttributes<HTMLUListElement> {
  msgs: Message.Entity[]
  locatedId?: string
  disabled?: boolean
  inReplyChain?: boolean
  onClickReplyMsg?: Room.RoomContextMethod
}
