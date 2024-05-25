import { HTMLAttributes } from 'react'

export interface RoomWrapperProps extends HTMLAttributes<HTMLElement> {
  room: Room.RoomEntity | null
  onConfigChange: <K extends keyof Room.RoomEntity>(
    code: K,
    newVal: Room.RoomEntity[K]
  ) => void
}
