import { HTMLAttributes } from 'react'

export interface UserAvatarProps extends HTMLAttributes<HTMLElement> {
  username?: string
  description?: string
  avatar: string
  state?: User.UserEntity['state']
  showDetails?: boolean
  showState?: boolean
}
