import { useRequest } from './request'
import { getServiceEnvConfig } from './config'

console.log(import.meta.env)
const { url } = getServiceEnvConfig(import.meta.env)

export const request = useRequest({ baseURL: url })

export const mockRequest = useRequest({ baseURL: '/mock' })
