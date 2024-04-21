import * as React from 'react';
import { Image } from '@arco-design/web-react'
import UserAvatar from '@/components/userAvatar';
import type { BaseProps, ImageMessage, MessageEntity, TextMessage } from './index.interface'
import { cs } from '@/utils/property';

function MessageList(props: BaseProps) {

    const {
        className,
        msgs
    } = props

    const isSelf = (msg: MessageEntity) => {
        return msg.content.user.userId === 'user-1'
    }

    const genTextMsg = (msg: TextMessage) => {
        return <li key={msg.id} className='text-sm break-all text-primary-l'>{msg.text}</li>
    }

    const genImageMsg = (msg: ImageMessage) => {
        return <li key={msg.id}>
            <Image
                width={200}
                src={msg.url}
                alt='lamp'
            />
        </li>
    }

    const renderMsg = (msg: MessageEntity) => {
        switch (msg.type) {
            case 'text':
                return genTextMsg(msg.content)
            case 'image':
                return genImageMsg(msg.content)
        }
    }

    return <ul className={cs(className, 'w-full p-2 flex flex-col items-center justify-start')}>
        {
            msgs.map(msg => {
                const { id, user, publishTime } = msg.content
                return <li
                    key={id}
                    className={
                        cs(
                            'w-full py-4 mb-3 flex items-start',
                            isSelf(msg) ? 'flex-row-reverse' : ''
                        )
                    }
                >
                    <UserAvatar
                        className={
                            cs(
                                isSelf(msg) ? 'ml-2' : 'mr-2'
                            )
                        }
                        info={user}
                    />
                    <div className='max-w-[70%]'>
                        <div
                            className={
                                cs(
                                    'mb-1 flex gap-x-3 items-center justify-start',
                                    isSelf(msg) ? 'flex-row-reverse' : ''
                                )
                            }
                        >
                            <h4 className='text-base text-primary-l'>{user.username}</h4>
                            <span className='text-xs text-light-l'>{publishTime}</span>
                        </div>
                        <div className='w-fit p-3 rounded-md bg-primary'>{renderMsg(msg)}</div>
                    </div>
                </li>
            })
        }
    </ul>
}

export type { MessageEntity }
export default MessageList