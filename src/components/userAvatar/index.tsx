import { Avatar } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import styles from './index.module.less'
import type { BaseProps } from './index.interface'

function UserAvatar(props: BaseProps) {

    const {
        className,
        username,
        avatar,
        state,
        showName = false,
        showState = true
    } = props
    const userStateColorMap: Record<number, string> = {
        0: 'red',
        1: 'teal'
    }

    return <div className={`${ className } flex items-center justify-start`}>
        <div
            className={
                cs(
                    styles['user-avatar'],
                    state ? styles['user-avatar--' + userStateColorMap[state]] : '',
                    {
                        [styles['user-avatar--no-state']]: !showState
                    }
                )
            }
        >
            <Avatar
                className="bg-module rounded-md cursor-pointer transition-colors hover:bg-module-2"
                shape="square"
                size={40}
            >
                <img src={avatar} alt="" />
            </Avatar>
        </div>
        { showName && <span className='ml-3 text-md text-primary-l'>{username}</span> }
    </div>
}

export default UserAvatar