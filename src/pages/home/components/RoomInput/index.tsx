import * as React from 'react';
import { Button, Mentions } from '@arco-design/web-react'
import { IconFaceSmileFill, IconFolderAdd, IconVideoCamera } from '@arco-design/web-react/icon';

function RoomInput() {

    const iconBtnCls = 'cursor-pointer hover:text-blue-500'

    return <div className='w-full h-28 px-3 py-2 flex flex-col items-start justify-between border-t border-primary-b'>
        <div className='w-full py-2 flex gap-x-2 items-center justify-start text-xl text-light-l'>
            <IconFaceSmileFill className={iconBtnCls} />
            <IconFolderAdd className={iconBtnCls} />
            <IconVideoCamera className={iconBtnCls} />
        </div>
        <Mentions
            placeholder='You can use @ Plato to mention Platon'
            options={['Jack', 'Steven', 'Platon', 'Mary']}
            alignTextarea={false}
            rows={2}
            />
    </div>
}

export default RoomInput;