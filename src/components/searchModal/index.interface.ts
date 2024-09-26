import type { HTMLAttributes } from 'react'

export enum AvailableTargetEnum {
  USER = 'users',
  ROOM = 'rooms'
}

export interface SearchModalProps extends HTMLAttributes<HTMLElement> {
  children?: JSX.Element
}
