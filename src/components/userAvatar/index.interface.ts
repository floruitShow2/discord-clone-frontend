import { HTMLAttributes } from 'react'

export interface UserAvatarProps extends HTMLAttributes<HTMLElement> {
  username?: string
  avatarClassName?: string
  description?: string
  avatar: string | JSX.Element
  state?: User.UserEntity['state']
  showDetails?: boolean
  showState?: boolean
}
