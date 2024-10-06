import { HTMLAttributes } from 'react'

export interface UserAvatarProps extends HTMLAttributes<HTMLElement> {
  username?: string
  avatarClassName?: string
  description?: string
  avatar?: string | JSX.Element
  triggerIcon?: JSX.Element
  size?: number
  shape?: 'circle' | 'square'
  state?: User.UserEntity['state']
  showDetails?: boolean
  showState?: boolean
}
