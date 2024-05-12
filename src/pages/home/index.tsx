import { useEffect, useState } from 'react'
import { produce } from 'immer'
import { Input, Dropdown, Button, Menu } from '@arco-design/web-react'
import { IconDelete, IconEdit, IconPlus, IconSearch, IconSettings, IconShareAlt } from '@arco-design/web-react/icon'
// import { io } from 'socket.io-client'
import { cs } from '@/utils/property'
import RoomCard from './components/RoomCard'
import RoomHeader from './components/RoomHeader'
import RoomBody from './components/RoomBody'
import RoomInput from './components/RoomInput'
import type { Operation } from './index.interface'
import styles from './index.module.less'

function HomePage() {
  const [serachQuery, setSearchQuery] = useState('')

  const [activeRoom, setActiveRoom] = useState<ApiRoom.RoomEntity | null>(null)

  const rooms: ApiRoom.RoomEntity[] = new Array(1).fill(0).map(
    (item, index) =>
      ({
        roomId: Math.random().toFixed(10),
        roomName: '测试房间',
        roomCover: 'http://127.0.0.1:3000/static/files/meleon/avatar/kanban method-rafiki.png',
        isPinned: true,
        noDisturbing: false,
        createTime: '2024年4月21日',
        messages: [
          {
            type: 'text',
            content: {
              id: '1',
              user: {
                userId: 'user-1',
                avatar: 'http://127.0.0.1:3000/static/files/meleon/avatar/kanban method-rafiki.png',
                username: 'Meleon',
                state: 0
              },
              metions: [],
              publishTime: '2024年4月23日',
              text: '测试测试'
            }
          }
        ]
      }) as ApiRoom.RoomEntity
  )
  const genRooms = () => {
    return rooms.map((room) => (
      <RoomCard
        className={cs('mb-2', room.roomId === activeRoom?.roomId && 'bg-module')}
        key={room.roomId}
        info={room}
        onClick={() => setActiveRoom(room)}
      />
    ))
  }

  const changeRoomConfig = <K extends keyof ApiRoom.RoomEntity>(
    code: K,
    newVal: ApiRoom.RoomEntity[K]
  ) => {
    const newState = produce(activeRoom, (draftState) => {
      if (draftState) draftState[code] = newVal
    })
    setActiveRoom(newState)
  }

  const operationConfigs: Operation[] = [
    {
      label: 'Invite People',
      key: '1',
      icon: <IconShareAlt className='text-primary-l' />,
      handler() {
        console.log('invite people')
      }
    },
    
    {
      label: 'Create Channel',
      key: '2',
      icon: <IconPlus className='text-primary-l' />,
      handler() {
        console.log('Create Channel')
      }
    },
    {
      label: 'Update Server',
      key: '3',
      icon: <IconEdit className='text-primary-l' />,
      handler() {
        console.log('Update Server')
      }
    },
    {
      label: 'Delete Server',
      key: '4',
      icon: <IconDelete className='text-primary-l' />,
      handler() {
        console.log('Delete Server')
      }
    }
  ]

  useEffect(() => {
    // connect the first room by default
    if (rooms.length) setActiveRoom(rooms[0])

    // const socket = io('http://localhost:3001')
    // socket.on('connect', () => {
    //   console.log(socket.id)
    //   socket.emit('events', { data: '测试' })
    //   socket.on('onEvents', (msg) => {
    //     console.log(msg)
    //   })
    // })
  }, [])

  return (
    <div className={cs(styles.home, 'w-full flex items-start justify-between bg-primary')}>
      <aside className="w-60 h-full pt-5 border-r border-primary-b overflow-auto">
        <div className='w-full px-5 flex items-center justify-between'>
          <h4 className="text-base font-bold text-primary-l">Chats</h4>
          <Dropdown
            droplist={
              <Menu>
                {
                  operationConfigs.map(operation => (
                    <Menu.Item key={operation.key} onClick={() => operation.handler()}>
                      <div className='w-40 h-full flex items-center justify-between'>
                        <span className='text-sm text-primary-l'>{operation.label}</span>
                        {operation.icon}
                      </div>
                    </Menu.Item>
                  ))
                }
              </Menu>
            }
          >
            <Button size='small' type='text' icon={<IconSettings className='text-primary-l' />}></Button>
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
        <ul className="w-full">{genRooms()}</ul>
      </aside>
      <main className={`${styles['home-main']} h-full`}>
        {activeRoom ? (
          <>
            <RoomHeader info={activeRoom} />
            <RoomBody
              className={styles['room-body']}
              info={activeRoom}
              onConfigChange={changeRoomConfig}
            />
            <RoomInput />
          </>
        ) : (
          <>请先选择联系人</>
        )}
      </main>
    </div>
  )
}

export default HomePage
