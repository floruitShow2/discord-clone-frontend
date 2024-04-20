import { useState } from 'react'
import { Input } from '@arco-design/web-react'
import { IconSearch } from '@arco-design/web-react/icon'
import RoomCard from './components/RoomCard'
import RoomHeader from './components/RoomHeader'
import RoomBody from './components/RoomBody'
import RoomInput from './components/RoomInput'
import styles from './index.module.less'

function HomePage() {
  const [serachQuery, setSearchQuery] = useState('')

  const [activeRoom, setActiveRoom] = useState<ApiRoom.RoomEntity | null>(null)
  
  const rooms: ApiRoom.RoomEntity[] = new Array(8).fill(0).map((item, index) => ({
    userInfo: {
      userId: index + '',
      avatar: 'http://127.0.0.1:3000/static/files/meleon/avatar/kanban method-rafiki.png',
      username: 'Test ' + (index + 1),
      state: ([0, 1] as Array<0 | 1>)[Math.round(Math.random())]
    },
    lastMessage: '测试测试',
    lastUpdateTime: '12:15'
  }))


  const genRooms = () => {
    return rooms.map((room) => (
      <RoomCard
        className='mb-2'
        key={room.userInfo.userId}
        info={room}
        onClick={() => setActiveRoom(room)}
      />
    ))
  }

  return (
    <div className="w-full h-full flex items-start justify-between bg-primary">
      <aside className="w-60 h-full pt-5 border-r border-primary-b overflow-auto">
        <h4 className="px-5 text-base font-bold text-primary-l">Chats</h4>
        <span className="px-5 text-xs text-light-l">26 Messages, 3 Unread</span>
        <Input
          className="my-4 px-5"
          value={serachQuery}
          prefix={<IconSearch />}
          placeholder="Search contacts"
          onChange={setSearchQuery}
        />
        <ul className="w-full">{genRooms()}</ul>
      </aside>
      <main className={`${styles['home-main']} h-full`}>
        {
          activeRoom
            ? (
              <>
                <RoomHeader info={activeRoom.userInfo} />
                <RoomBody className={styles['room-body']} info={activeRoom.userInfo} />
                <RoomInput />
              </>
            )
            : <>请先选择联系人</>
        }
      </main>
    </div>
  )
}

export default HomePage
