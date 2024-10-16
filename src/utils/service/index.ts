import { createRequest } from './request'
import { getServiceEnvConfig } from './config'

const { url } = getServiceEnvConfig(import.meta.env)

export const request = createRequest({ baseURL: url })

export const mockRequest = createRequest({ baseURL: '/mock' })
