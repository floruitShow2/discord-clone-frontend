import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  showDetails?: boolean
  currentPage: number
  onPageChange: (curPage: number) => void
  onIsNearBottomChange: (val: boolean) => void
  onConfigChange: <K extends keyof Room.RoomEntity>(code: K, newVal: Room.RoomEntity[K]) => void
}
