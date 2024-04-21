import { HTMLAttributes } from "react"

interface BaseMessage {
    id: string
    /**
     * @description 发布消息的用户
     */
    user: User.UserEntity
    /**
     * @description 消息提及的用户
     */
    metions: User.UserEntity[]
    /**
     * @description 发布时间
     */
    publishTime: string
}

export interface TextMessage extends BaseMessage {
    text: string
}

export interface ImageMessage extends BaseMessage {
    url: string
}

export type MessageEntity = { type: 'text', content: TextMessage } | { type: 'image', content: ImageMessage } 

export interface BaseProps extends HTMLAttributes<HTMLUListElement> {
    msgs: MessageEntity[]
}