import { HTMLAttributes } from 'react'

export interface RoomBodyProps extends HTMLAttributes<HTMLElement> {
  showDetails?: boolean
  roomPage: number
  onPageChange: (curPage: number) => void
  onIsNearBottomChange: (val: boolean) => void
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
