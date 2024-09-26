import { request } from '@/utils/service'

enum URLs {
  CreateRoom = '/api/chat/room/createRoom',
  FetchRoomList = '/api/chat/room/getRooms',
  SearchRooms = '/api/chat/room/searchRooms',
  FetchRoomMembers = '/api/chat/room/getMembers',
  FetchInviteCode = '/api/chat/room/getInviteCode',
  JoinRoomByInviteCode = '/api/chat/room/inviteMember',
  JoinRoomByUserIds = '/api/chat/room/inviteMemberByUserId',
  GetDetailsByInviteCode = '/api/chat/room/getDetailsByInviteCode'
}

export const CreateRoom = (data: Room.CreateRoomInput) => {
  return request.post<Room.RoomEntity>(URLs.CreateRoom, data)
}

/**
 * @description 查询当前用户加入的房间列表
 * @returns
 */
export const FetchRoomList = () => {
  return request.get<Room.RoomEntity[]>(URLs.FetchRoomList)
}
/**
 * @description 根据关键字搜索房间
 * @param keyword
 * @returns
 */
export const FetchRoomByQuery = (query: string) => {
  return request.post<Room.RoomEntity[]>(URLs.SearchRooms, { query })
}
/**
 * @description 查询房间的成员
 * @param roomId
 * @returns
 */
export const FetchRoomMembers = (roomId: string) => {
  return request.get<User.UserEntity[]>(URLs.FetchRoomMembers, { params: { roomId } })
}
/**
 * @description 基于房间ID生成群聊二维码
 * @param roomId
 * @returns
 */
export const FetchInviteCode = (roomId: string) => {
  return request.get<string>(URLs.FetchInviteCode, { params: { roomId } })
}
/**
 * @description 通过群聊二维码加入群聊
 * @param inviteCode
 * @returns
 */
export const JoinRoomByInviteCode = (inviteCode: string) => {
  return request.post<string>(URLs.JoinRoomByInviteCode, { inviteCode })
}
/**
 * @description 根据群聊二维码获取房间和邀请人的信息
 * @param inviteCode
 * @returns
 */
export const GetDetailsByInviteCode = (inviteCode: string) => {
  return request.get<{ room: Room.RoomEntity; user: User.UserEntity }>(
    URLs.GetDetailsByInviteCode,
    { params: { inviteCode } }
  )
}

export const JoinRoomByUserIds = (data: { roomId: string; userIds: string[] }) => {
  return request.post<string>(URLs.JoinRoomByUserIds, data)
}
