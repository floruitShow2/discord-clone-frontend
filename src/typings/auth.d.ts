declare namespace User {

  interface UserEntity {
    avatar: string
    email: string
    introduction: string
    job: string
    location: string
    organization: string
    phone: string
    registrationDate: string
    socialAccounts: string[]
    userId: string
    username: string
    /**
     * @description 0-离线    1-在线
     */
    state: 0 | 1
  }

  interface LoginInput {
    username: string
    password: string
  }

}
