import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  showDetails?: boolean
  currentPage: number
  onPageChange: () => void
  onIsNearBoyyomChange: (val: boolean) => void
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
