import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { JoinRoomByInviteCode } from '@/api/chat-room'

function ActionJoin() {
  const location = useLocation()

  const handleJoinGroup = async () => {
    const queryParams = new URLSearchParams(location.search)
    const inviteCode = queryParams.get('inviteCode')
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
    handleJoinGroup()
  }, [])
 return <></>
}

export default ActionJoin