declare namespace ServiceEnv {
    type ServiceEnvType = 'development' | 'production'

    interface ServiceEnvConfig {
        url: string
    }
}