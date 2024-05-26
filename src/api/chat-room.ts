import { request } from '@/utils/service'

enum URLs {
    FetchRoomList = '/api/chat/room/getRooms'
}

export const FetchRoomList = () => {
  return request.get<Room.RoomEntity[]>(URLs.FetchRoomList)
}
