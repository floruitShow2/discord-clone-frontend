declare namespace Global {
    interface Settings {
        theme: 'dark' | 'light'
        lang: 'zh-CN' | 'en-US'
    }

    interface State {
        settings?: Settings
        userInfo: User.UserEntity
    }
}