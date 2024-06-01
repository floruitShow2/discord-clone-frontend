import { HTMLAttributes } from 'react'

export interface RoomInputProps extends HTMLAttributes<HTMLElement> {
  info: Room.RoomEntity
  onMessageEmit: (createMessageInput: Message.CreateMessageInput) => void
}
