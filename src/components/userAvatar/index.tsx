import { Avatar } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import styles from './index.module.less'
import type { UserAvatarProps } from './index.interface'

function UserAvatar(props: UserAvatarProps) {
  const {
    className,
    username,
    description,
    avatar,
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
          className="bg-primary rounded-md cursor-pointer transition-colors"
          shape="square"
          size={40}
        >
          <img src={avatar} alt="" />
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
