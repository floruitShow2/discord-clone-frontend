import { Avatar } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import styles from './index.module.less'
import type { BaseProps } from './index.interface'

function UserAvatar(props: BaseProps) {

    const {
        className,
        info,
        showName = false,
        showState = true
    } = props
    const userStateColorMap: Record<BaseProps['info']['state'], string> = {
        0: 'red',
        1: 'teal'
    }

    return <div className={`${ className } flex items-center justify-start`}>
        <div
            className={
                cs(
                    styles['user-avatar'],
                    styles['user-avatar--' + userStateColorMap[info.state]],
                    {
                        [styles['user-avatar--no-state']]: !showState
                    }
                )
            }
        >
            <Avatar className="bg-module rounded-md cursor-pointer transition-colors hover:bg-module-2" shape="square">
                <img src={info.avatar} alt="" />
            </Avatar>
        </div>
        { showName && <span className='ml-3 text-md text-primary-l'>{info.username}</span> }
    </div>
}

export default UserAvatar