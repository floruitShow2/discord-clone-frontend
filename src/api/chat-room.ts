import { request } from '@/utils/service'

enum URLs {
  FetchRoomList = '/api/chat/room/getRooms',
  FetchRoomMembers = '/api/chat/room/getMembers',
  FetchInviteCode = '/api/chat/room/getInviteCode',
  JoinRoomByInviteCode = '/api/chat/room/inviteMember'
}

export const FetchRoomList = () => {
  return request.get<Room.RoomEntity[]>(URLs.FetchRoomList)
}

export const FetchRoomMembers = (roomId: string) => {
  return request.get<User.UserEntity[]>(URLs.FetchRoomMembers, { params: { roomId } })
}

export const FetchInviteCode = (roomId: string) => {
  return request.get<string>(URLs.FetchInviteCode, { params: { roomId } })
}

export const JoinRoomByInviteCode = (inviteCode: string) => {
  return request.post<string>(URLs.JoinRoomByInviteCode, { inviteCode })
}