import type { HTMLAttributes } from 'react'

export interface ReplyChainProps extends HTMLAttributes<HTMLDivElement> {
  messageId: string
  onClose: () => void
  onLocate?: Room.RoomContextMethod
}
