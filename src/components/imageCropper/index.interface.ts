import { UserAvatarProps } from '../userAvatar/index.interface'

export interface ImageCropperProps extends Omit<UserAvatarProps, 'onChange'> {
  className?: string
  url: string
  allowEdit?: boolean
  onChange?: (url: string) => void
}
