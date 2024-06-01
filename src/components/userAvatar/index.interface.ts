import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  username?: string
  avatar: string
  state?: User.UserEntity['state']
  showName?: boolean
  showState?: boolean
}
