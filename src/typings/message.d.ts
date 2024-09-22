declare namespace Message {
  import { MessageTypeEnum } from '@/constants'

  interface Mention extends Pick<User.UserEntity, 'userId' | 'username' | 'avatar'> {
    offset: number
  }

  interface Emoji {
    url: string
    offset: number
  }

  interface Entity {
    /**
     * @description 消息的唯一标识符
     */
    messageId: string
    /**
     * @description 消息归属的房间号
     */
    roomId: string
    /**
     * @description 回复的消息id
     */
    replyId?: string
    /**
     * @description 回复的消息实体
     */
    replyMessage?: Entity
    /**
     * @description 发布消息的用户
     */
    profile: User.UserEntity
    /**
     * @description 消息提及的用户
     */
    mentions: Mention[]
    /**
     * @description 消息用到的表情
     */
    emojis: Emoji[]
    /**
     * @description 消息内容
     */
    content: string
    url: string
    type: MessageTypeEnum
    /**
     * @description 发布时间
     */
    createTime: string
  }

  /**
   * @description 接口请求参数格式
   */
  interface FetchMessageListInput extends Pagination.Input {
    roomId: string
  }

  interface CreateMessageInput extends Omit<Entity, 'messageId' | 'createTime' | 'profile'> {
    profileId: string
  }

  interface UpdateMessageInput extends Pick<Entity, 'messageId' | 'content' | 'type'> {}

  interface RecallMessageInput extends Pick<Entity, 'messageId'> {}
}
