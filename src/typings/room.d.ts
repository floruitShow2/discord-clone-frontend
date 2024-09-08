declare namespace Room {
  import { ChatRoomTypeEnum } from '@/enum/chat-room.enum'
  interface RoomEntity {
    roomId: string
    // 群聊信息，单聊为对方用户信息，群聊则为完整房间信息
    // 群聊名称
    roomName: string
    // 群聊编号
    roomNo: string
    // 群聊封面
    roomCover: string
    // 群聊描述信息
    roomDescription: string
    // 群聊类型
    roomType: ChatRoomTypeEnum
    // 是否开启免打扰模式
    noDisturbing: boolean
    // 是否置顶
    isPinned: boolean
    // 房间创建时间
    createTime: string
    // 成员 id 列表
    members: User.UserEntity[]
  }

  interface RoomContextMethod {
    (msg: Message.Entity): void
  }

  type CreateRoomInput = Partial<RoomEntity>
}
