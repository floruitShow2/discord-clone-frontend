declare namespace Global {
  interface Settings {
    theme: 'dark' | 'light'
    lang: 'zh-CN' | 'en-US'
  }

  interface Modal {
    activeModal: 'CreateServerModal' | null
  }

  interface Coze {
    // 会话ID - 和 roomId 保持一致
    conversationId: string
    // 用户提出的问题
    question: string
    // coze 返回的消息
    answer: string
    // 是否正在读取消息
    isReading: boolean
  }

  interface State {
    settings?: Settings
    modal?: Modal
    userInfo: User.UserEntity
  }
}
