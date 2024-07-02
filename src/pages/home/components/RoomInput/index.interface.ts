import { HTMLAttributes } from 'react'

export interface RoomInputProps extends HTMLAttributes<HTMLElement> {
  onMessageEmit: (createMessageInput: Message.CreateMessageInput) => void
}
