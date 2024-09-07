import { useContext } from 'react'
import { Button } from '@arco-design/web-react'
import { IconMoreVertical, IconSearch } from '@arco-design/web-react/icon'
import UserAvatar from '@/components/userAvatar'
import { RoomContext } from '../RoomWrapper'

function RoomHeader() {
  const { room } = useContext(RoomContext)

  return (
    <div className="w-full h-16 p-3 flex items-center justify-between border-b border-primary-b">
      {room && <UserAvatar username={room.roomName} avatar={room.roomCover} showDetails />}

      <div className="flex items-center justify-end">
        <Button className="!text-primary-l" type="text" icon={<IconSearch />} />
        <Button className="!text-primary-l" type="text" icon={<IconMoreVertical />} />
      </div>
    </div>
  )
}

export default RoomHeader
