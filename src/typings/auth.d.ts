declare namespace User {
    interface UserEntity {
        userId: string
        username: string
        avatar: string
        email: string
        /**
         * @description 0-离线    1-在线
         */
        state: 0 | 1
    }
}