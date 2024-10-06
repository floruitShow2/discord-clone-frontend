import { Tag } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import UserAvatar from '@/components/userAvatar'
import styles from '../index.module.less'
const renderRoomList = (rooms: Room.RoomEntity[]) => {
  return rooms.map((info) => (
    <li
      key={info.roomId}
      className={cs(
        'w-full',
        'flex items-center justify-between',
        'rounded-md cursor-pointer',
        'hover:bg-[#f8f9fa]'
      )}
    >
      {/* left */}
      <div className={cs('max-w-[60%]', 'flex items-center justify-start')}>
        <UserAvatar
          className="mr-2"
          username={info.roomName}
          avatar={info.roomCover || ''}
          showState={false}
        />
        <div className="flex flex-col items-start justify-center">
          <span className="mr-1 text-sm">{info.roomName}</span>
          <span className={cs(styles['service-modal-find-item--intro'], 'text-xs text-light-l')}>
            {info.roomDescription}
          </span>
        </div>
      </div>
      {/* right */}
      <div className={cs('gap-x-1 flex items-center justify-end')}>
        <Tag color="gray">{info.members.length} Members</Tag>
        {/* <Button
          type="text"
          icon={<IconMoreVertical className="text-primary-l hover:text-blue-500" />}
          style={{ background: 'none' }}
        ></Button> */}
      </div>
    </li>
  ))
}

export default renderRoomList
