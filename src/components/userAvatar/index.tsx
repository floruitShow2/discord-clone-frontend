import { Avatar } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import styles from './index.module.less'
import type { UserAvatarProps } from './index.interface'
import { isString } from '@/utils/is'

function UserAvatar(props: UserAvatarProps) {
  const {
    className,
    avatarClassName,
    username,
    description,
    avatar,
    triggerIcon,
    state,
    showDetails = false,
    showState = true
  } = props
  const userStateColorMap: Record<number, string> = {
    0: 'red',
    1: 'teal'
  }

  return (
    <div className={`${className} flex items-center justify-start`}>
      <div
        className={cs(
          styles['user-avatar'],
          state ? styles['user-avatar--' + userStateColorMap[state]] : '',
          {
            [styles['user-avatar--no-state']]: !showState || state === undefined
          }
        )}
      >
        <Avatar
          className={cs('bg-module rounded-md cursor-pointer transition-colors', avatarClassName)}
          shape="square"
          size={40}
          triggerIcon={triggerIcon}
          triggerIconStyle={{
            color: '#3B82F6'
          }}
        >
          {isString(avatar) ? <img src={avatar} alt="" /> : avatar}
        </Avatar>
      </div>
      {showDetails && (
        <div className="ml-2 gap-y-0.5 flex flex-col items-start justify-center">
          <span className="text-md text-primary-l">{username}</span>
          <span className="text-xs text-light-l">{description}</span>
        </div>
      )}
    </div>
  )
}

export default UserAvatar
