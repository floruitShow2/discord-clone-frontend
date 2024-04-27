import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  info: ApiRoom.RoomEntity
  showDetails?: boolean
  onConfigChange: <K extends keyof ApiRoom.RoomEntity>(
    code: K,
    newVal: ApiRoom.RoomEntity[K]
  ) => void
}
