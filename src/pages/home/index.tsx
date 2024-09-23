import { useEffect, useState } from 'react'
import { produce } from 'immer'
import { Input, Dropdown, Button, Menu, Modal } from '@arco-design/web-react'
import { IconPlus, IconSearch, IconSettings } from '@arco-design/web-react/icon'
import { FetchRoomList } from '@/api/chat-room'
import { cs } from '@/utils/property'
import RoomCard from './components/RoomCard'
import RoomWrapper from './components/RoomWrapper'
import CreateChannel from './components/CreateChannel'
import styles from './index.module.less'

function HomePage() {
  const [serachQuery, setSearchQuery] = useState('')

  const [activeRoom, setActiveRoom] = useState<Room.RoomEntity | null>(null)

  const [rooms, setRooms] = useState<Room.RoomEntity[]>([])
  const initRooms = async () => {
    try {
      const { data } = await FetchRoomList()
      if (!data || !data?.length) return
      setRooms(data)
      setActiveRoom(data[0])
    } catch (err) {
      console.log(err)
    }
  }
  const renderRooms = () => {
    return rooms.map((room) => (
      <RoomCard
        className={cs('mb-2', room.roomId === activeRoom?.roomId && 'bg-module')}
        key={room.roomId}
        info={room}
        onClick={() => setActiveRoom(room)}
      />
    ))
  }

  const changeRoomConfig = <K extends keyof Room.RoomEntity>(
    code: K,
    newVal: Room.RoomEntity[K]
  ) => {
    const newState = produce(activeRoom, (draftState) => {
      if (draftState) draftState[code] = newVal
    })
    setActiveRoom(newState)
  }

  const operationConfigs: DropdownItem.Entity[] = [
    {
      label: 'Create Room',
      key: '1',
      icon: <IconPlus className="text-primary-l" />,
      handler() {
        const info = Modal.info({
          className: cs('w-[800px]', 'rounded-xl', styles['simple-modal']),
          icon: null,
          closable: true,
          footer: () => <></>,
          content: (
            <CreateChannel
              onSave={async () => {
                await initRooms()
                info.close()
              }}
            />
          )
        })
      }
    }
  ]

  useEffect(() => {
    initRooms()
  }, [])

  return (
    <div className={cs(styles.home, 'w-full flex items-start justify-between bg-primary')}>
      <aside className="w-60 h-full pt-5 border-r border-primary-b overflow-auto">
        <div className="w-full px-5 flex items-center justify-between">
          <h4 className="text-base font-bold text-primary-l">Chats</h4>
          <Dropdown
            droplist={
              <Menu>
                {operationConfigs.map((operation) => (
                  <Menu.Item key={operation.key} onClick={() => operation.handler()}>
                    <div className="w-40 h-full flex items-center justify-between">
                      <span className="text-sm text-primary-l">{operation.label}</span>
                      {operation.icon}
                    </div>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button
              size="small"
              type="text"
              icon={<IconSettings className="text-primary-l" />}
            ></Button>
          </Dropdown>
        </div>
        <span className="px-5 text-xs text-light-l">26 Messages, 3 Unread</span>
        <Input
          className="my-4 px-5"
          value={serachQuery}
          prefix={<IconSearch />}
          placeholder="Search contacts"
          onChange={setSearchQuery}
        />
        <ul className="w-full">{renderRooms()}</ul>
      </aside>
      <main className={`${styles['home-main']} relative h-full`}>
        <RoomWrapper room={activeRoom} onConfigChange={changeRoomConfig}></RoomWrapper>
      </main>
    </div>
  )
}

export default HomePage
