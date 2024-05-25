declare namespace Message {
    import { MessageType } from "@/constants"

    interface Entity {
        /**
         * @description 消息的唯一标识符
         */
        messageId: string
        /**
         * @description 发布消息的用户
         */
        profile: User.UserEntity
        /**
         * @description 消息提及的用户
         */
        metions: User.UserEntity[]
        /**
         * @description 消息内容
         */
        content: string
        url: string
        type: MessageType
        /**
         * @description 发布时间
         */
        createTime: string
    }

    // interface TextMessage extends BaseMessage {
    //     content: string
    // }

    // interface ImageMessage extends BaseMessage {
    //     url: string
    // }

    // type MessageEntity =
    //     | { type: MessageType.TEXT; content: TextMessage }
    //     | { type: MessageType.IMAGE; content: ImageMessage }

    /**
     * @description 接口请求参数格式
     */
    interface FetchMessageListInput extends Pagination.Input {
        roomId: string
    }
}