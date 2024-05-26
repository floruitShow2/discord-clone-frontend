import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  info: Room.RoomEntity
  messages: Message.Entity[]
  showDetails?: boolean
  onPageChange: () => void
  onAllowScrollChange: (val: boolean) => void
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
