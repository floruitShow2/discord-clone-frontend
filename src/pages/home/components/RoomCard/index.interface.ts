import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  info: ApiRoom.RoomEntity
}
