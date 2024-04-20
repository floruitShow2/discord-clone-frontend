declare namespace ApiRoom {
    interface RoomEntity {
        userInfo: Pick<User.UserEntity, 'avatar' | 'state' | 'username' | 'userId'>
        lastMessage: string
        lastUpdateTime: string
    }
}