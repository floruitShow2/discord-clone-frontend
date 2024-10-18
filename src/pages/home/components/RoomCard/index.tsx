import UserAvatar from '@/components/userAvatar'
import { translateToTimeAgo } from '@/utils/time'
import type { BaseProps } from './index.interface'
import { RenderTextMsg } from '../MessageList/components/MessageEntity'
import { cs } from '@/utils/property'

function RoomCard(props: BaseProps) {
  const { className, info, onClick } = props

  const createUnreadCount = () => {
    const count = info.unreadMessageCount
    if (count === 0) {
      return <></>
    } else {
      return (
        <span className="w-[14px] h-[14px] rounded-full bg-red-400 text-xs text-white flex items-center justify-center">
          {count > 99 ? '99+' : count || 1}
        </span>
      )
    }
  }

  return (
    <div
      className={`${className} w-full px-5 py-1 flex items-center justify-start cursor-pointer hover:bg-module`}
      onClick={onClick}
    >
      <UserAvatar className="mr-3" username={info.roomName} avatar={info.roomCover} />
      <div className="w-36">
        <div className="flex items-center justify-between">
          <h4 className="max-w-[80px] overflow-hidden text-ellipsis text-md whitespace-nowrap text-heavy-l">
            {info.roomName}
          </h4>
          <span className="text-xs text-light-l whitespace-nowrap">
            {translateToTimeAgo(info.createTime)}
          </span>
        </div>
        <div
          className={cs('w-full', 'flex items-center justify-between', 'text-xs whitespace-nowrap')}
        >
          <div
            className="overflow-hidden"
            style={{ width: info.unreadMessageCount > 0 ? 'calc(100% - 30px)' : '100%' }}
          >
            <RenderTextMsg msg={info.lastMessage}></RenderTextMsg>
          </div>
          {createUnreadCount()}
        </div>
      </div>
    </div>
  )
}

export default RoomCard
