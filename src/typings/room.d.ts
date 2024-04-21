declare namespace ApiRoom {
    interface RoomEntity {
        /**
         * @description 群聊房间名
         */
        name: string

        userInfo: Pick<User.UserEntity, 'avatar' | 'state' | 'username' | 'userId'>

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

        // 拿消息列表最后一条就行，这个后面换下
        lastMessage: string
        lastUpdateTime: string
    }
}