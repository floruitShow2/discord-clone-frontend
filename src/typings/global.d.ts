declare namespace Global {
  interface Settings {
    theme: 'dark' | 'light'
    lang: 'zh-CN' | 'en-US'
  }

  interface Modal {
    activeModal: 'CreateServerModal' | null
  }

  interface State {
    settings?: Settings
    modal?: Modal
    userInfo: User.UserEntity
  }
}
