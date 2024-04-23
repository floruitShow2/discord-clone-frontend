import * as React from 'react'
import UserAvatar from '@/components/userAvatar'
import type { BaseProps } from './index.interface'

function RoomCard(props: BaseProps) {
  const { className, info, onClick } = props

  return (
    <div
      className={`${className} w-full px-5 py-1 flex items-center justify-start cursor-pointer hover:bg-module`}
      onClick={onClick}
    >
      <UserAvatar
        className='mr-3'
        username={info.roomName}
        avatar={info.roomCover}
        state={0}
      />
      <div className='w-36'>
        <div className='flex items-center justify-between'>
          <h4 className='text-md text-heavy-l'>{info.roomName}</h4>
          <span className='text-xs text-light-l'>{info.messages.at(-1)?.content.publishTime}</span>
        </div>
        <div className='text-xs text-light-l text-nowrap overflow-hidden text-ellipsis'>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero sapiente sequi obcaecati,
          debitis adipisci corporis doloremque voluptatem at, est a sit molestias, nisi dolores unde
          eum delectus impedit quaerat velit?
        </div>
      </div>
    </div>
  )
}

export default RoomCard
