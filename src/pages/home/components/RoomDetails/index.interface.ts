import { HTMLAttributes } from 'react'

export interface RoomDetailsProps extends HTMLAttributes<HTMLElement> {
  onConfigChange?: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
