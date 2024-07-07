import { HTMLAttributes } from 'react'

export interface MessageListProps extends HTMLAttributes<HTMLUListElement> {
  msgs: Message.Entity[]
  locatedId?: string
  disabled?: boolean
  inReplyChain?: boolean
  onLocate?: Room.RoomContextMethod
  onClearLocatedId?: () => void
  onRecall?: Room.RoomContextMethod
  onReply?: Room.RoomContextMethod
  onClickReplyMsg?: Room.RoomContextMethod
}
