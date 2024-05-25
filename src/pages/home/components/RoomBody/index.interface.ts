import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  info: Room.RoomEntity
  showDetails?: boolean
  onConfigChange: <K extends keyof Room.RoomEntity>(
    code: K,
    newVal: Room.RoomEntity[K]
  ) => void
}
