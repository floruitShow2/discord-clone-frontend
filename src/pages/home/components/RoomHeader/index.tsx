import * as React from 'react';
import { Button } from '@arco-design/web-react';
import { IconMoreVertical, IconSearch } from '@arco-design/web-react/icon';
import UserAvatar from '@/components/userAvatar'
import type { BaseProps } from './index.interface'

function RoomHeader(props: BaseProps) {
    const { info } = props

    return <div className='w-full h-16 p-3 flex items-center justify-between border-b border-primary-b'>
        <UserAvatar info={info} showName />

        <div className='flex items-center justify-end'>
            <Button
                className="!text-primary-l"
                type='text'
                icon={<IconSearch />}
            />
            <Button
                className="!text-primary-l"
                type='text'
                icon={<IconMoreVertical />}
            />
        </div>
    </div>
}

export default RoomHeader;