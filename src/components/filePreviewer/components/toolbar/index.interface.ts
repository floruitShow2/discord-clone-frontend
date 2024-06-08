import { HTMLAttributes } from 'react'

export enum PageEventsEnum {
  PREV = 'prev',
  NEXT = 'next'
}
export enum ZoomEventsEnum {
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut'
}

export interface FileToolBarProps extends HTMLAttributes<HTMLDivElement> {
  currentPage: number
  totalPages: number
  onPrev?: () => void
  onNext?: () => void
  maxZoom?: number
  minZoom?: number
  currentZoom?: number
  onZoomIn?: () => void
  onZoomOut?: () => void
}
