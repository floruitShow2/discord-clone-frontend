import { HTMLAttributes } from 'react'

export interface RoomContextProps {
  room: Room.RoomEntity | null
  msgs: Message.Entity[]
  handleClear?: (roomId: string) => void
  handleRecall?: (msg: Message.Entity) => void
}

export interface RoomProviderProps extends RoomContextProps {
  children: React.ReactNode
}

export interface RoomWrapperProps extends HTMLAttributes<HTMLElement> {
  room: Room.RoomEntity | null
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
