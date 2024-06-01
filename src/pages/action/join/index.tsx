import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '@arco-design/web-react'
import { JoinRoomByInviteCode, GetDetailsByInviteCode } from '@/api/chat-room'

function ActionJoin() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const inviteCode = queryParams.get('inviteCode') || ''

  const [room, setRoom] = useState<Room.RoomEntity>()
  const [user, setUser] = useState<User.UserEntity>()

  const init = async () => {
    const { data } = await GetDetailsByInviteCode(inviteCode)
    if (!data) return
    const { room, user } = data
    setRoom(room)
    setUser(user)
  }

  const handleJoinGroup = async () => {
    if (!inviteCode) {
      location.pathname = '/'
      return
    }
    try {
      await JoinRoomByInviteCode(inviteCode)
    } catch (err) {
      console.log(err)
    } finally {
      window.location.pathname = '/'
    }
  }

  useEffect(() => {
    init()
  }, [])

  if (user && room) {
    console.log(user)
    return (
      <div className="w-[100vw] h-[100vh] flex gap-y-5 flex-col items-center justify-center">
        <img src={room.roomCover} alt="" />
        <p className="text-sm text-primary-l">
          收到来自
          <span className="text-blue-500">{user.username}</span>
          的加群邀请，是否确认加入
          <span className="text-blue-500">{room.roomName}</span>?
        </p>
        <Button type="primary" onClick={handleJoinGroup}>
          确认加入
        </Button>
      </div>
    )
  } else {
    return <></>
  }
}

export default ActionJoin
