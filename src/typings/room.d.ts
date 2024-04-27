declare namespace ApiRoom {
  type PartialUser = Pick<User.UserEntity, 'avatar' | 'state' | 'username' | 'userId'>
  /**
   * 关于回复消息，需要考虑下，回复和接收用的结构有点不同
   */
  interface BaseMessage {
    /**
     * @description 消息的唯一标识符
     */
    id: string
    /**
     * @description 发布消息的用户
     */
    user: PartialUser
    /**
     * @description 消息提及的用户
     */
    metions: PartialUser[]
    /**
     * @description 发布时间
     */
    publishTime: string
  }

  interface TextMessage extends BaseMessage {
    text: string
  }

  interface ImageMessage extends BaseMessage {
    url: string
  }

  type MessageEntity =
    | { type: 'text'; content: TextMessage }
    | { type: 'image'; content: ImageMessage }

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

    messages: MessageEntity[]
  }
}
