import { forwardRef } from 'react'
import type { ForwardedRef } from 'react'
import { Avatar } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import { isString } from '@/utils/is'
import type { UserAvatarProps } from './index.interface'
import styles from './index.module.less'
import './index.less'

const UserAvatar = forwardRef((props: UserAvatarProps, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    avatarClassName,
    username,
    description,
    avatar,
    triggerIcon,
    state,
    size = 40,
    shape = 'square',
    showDetails = false,
    showState = true,
    onClick
  } = props
  const userStateColorMap: Record<number, string> = {
    0: 'red',
    1: 'teal'
  }

  return (
    <div
      ref={ref}
      className={cs(className, `flex items-center justify-start`, { 'user-avatar--circle': shape === 'circle' })}
      onClick={onClick}
    >
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
          className={cs(
            'bg-module transition-colors',
            'pointer-events-auto cursor-pointer',
            avatarClassName,
            shape === 'square' ? 'rounded-md' : 'rounded-full'
          )}
          shape="square"
          size={size}
          triggerIcon={triggerIcon}
          triggerIconStyle={{
            color: '#3B82F6'
          }}
        >
          {isString(avatar) ? <img src={avatar} /> : avatar}
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
})

export default UserAvatar
