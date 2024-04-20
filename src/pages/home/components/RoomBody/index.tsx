import * as React from 'react'
import UserAvatar from '@/components/userAvatar'
import MemeberList from '../MembersList'
import type { BaseProps } from './index.interface'
import { Button } from '@arco-design/web-react'
import { IconPen, IconQrcode } from '@arco-design/web-react/icon'

function RoomBody(props: BaseProps) {

    const {
        className,
        info,
        showDetails = true
    } = props

    const members: User.UserEntity[] = new Array(21)
        .fill(0)
        .map(() => ({
            avatar: 'https://avatars.githubusercontent.com/u/82753320?v=4',
            email: '',
            state: 0,
            userId: Math.random() + '',
            username: 'Test'
        })
    )

    return <>
        <div className={`${className} flex items-start justify-between`}>
            <main className='flex-1 h-full bg-module'>chat body</main>
            { showDetails && (
                <aside className='w-80 h-full p-4 border-l border-primary-b'>

                    <div className='w-full mb-4 flex items-center justify-between'>
                        <div className='flex items-center justify-start'>
                            <UserAvatar className='mr-2' info={info} showState={false} />
                            <div className='flex flex-col items-start justify-center'>
                                <div className='flex items-center justify-start text-primary-l'>
                                    <span className='mr-1 text-sm'>
                                        {info.username}
                                    </span>
                                    <IconPen className='cursor-pointer hover:text-blue-500' />
                                </div>
                                <span className='text-xs text-light-l'>Lorem ipsum dolor sit amet</span>
                            </div>
                        </div>
                        <Button
                            icon={<IconQrcode />}
                        />
                    </div>

                    <MemeberList className='mb-4' members={members} />

                    <div>
                        <h4>群聊信息</h4>
                        <ul>
                            <li>
                                <span>创建时间</span>
                                <span>2024年4月20日</span>
                            </li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>

                    <div>
                        <h4>个性化设置</h4>
                        <ul>
                            <li>
                                <span>我在本群的昵称</span>
                            </li>
                            <li>
                                <span>置顶会话</span>
                            </li>
                            <li>
                                <span>消息免打扰</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul>
                            <li>清空聊天记录</li>
                            <li>退出群聊</li>
                        </ul>
                    </div>
                </aside>
            ) }
        </div>
    </>
}

export default RoomBody;