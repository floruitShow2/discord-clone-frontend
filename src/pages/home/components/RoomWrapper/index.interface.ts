import { HTMLAttributes } from 'react'

export interface RoomWrapperProps extends HTMLAttributes<HTMLElement> {
  room: ApiRoom.RoomEntity | null
  onConfigChange: <K extends keyof ApiRoom.RoomEntity>(
    code: K,
    newVal: ApiRoom.RoomEntity[K]
  ) => void
}
