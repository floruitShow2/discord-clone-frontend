declare namespace User {
  interface UserEntity {
    id: number
    name: string
    imageUrl: string
    email?: string
    /**
     * @description 0-离线    1-在线
     */
    state: 0 | 1
  }
}
