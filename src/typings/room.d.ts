declare namespace Room {
  interface RoomEntity {
    roomId: string
    /**
     * @description 群聊信息，单聊为对方用户信息，群聊则为完整房间信息
     */
    roomName: string
    roomCover: string

    /**
     * @description 免打扰模式
     */
    noDisturbing: boolean
    /**
     * 是否置顶
     */
    isPinned: boolean

    /**
     * @description 房间创建时间
     */
    createTime: string
  }

  interface RoomContextMethod {
    (msg: Message.Entity): void
  }
}
