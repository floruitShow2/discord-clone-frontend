import axios, { AxiosResponse } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { useStorage, UseStorageEntity } from '@/utils/storage'
import { handleAxiosError, handleBackendError, handleResponseError } from './error'
import { handleServiceResult } from './handler'
import { Message } from '@arco-design/web-react'
import { REQUEST_ERROR_DURATION } from './config'
import { StorageIdEnum } from '@/constants/storage'

class CustomAxiosInstance {
  instance: AxiosInstance

  backendConfig: Service.BackendResultConfig

  storage: UseStorageEntity

  cozeUrls: string[] = ['/v3/chat']

  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: Service.BackendResultConfig = {
      codeKey: 'Code',
      dataKey: 'ReturnData',
      msgKey: 'Message',
      successCode: 1,
      failCode: -1
    }
  ) {
    this.storage = useStorage()
    this.instance = axios.create(axiosConfig)
    this.backendConfig = backendConfig
    this.setInterceptor()
  }

  /**
   * @description 设置请求拦截器及响应拦截器
   */
  setInterceptor() {
    this.instance.interceptors.request.use(
      async (config) => {
        if (!this.cozeUrls.includes(config.url || '')) {
          const tokenKey = this.storage.genKey(StorageIdEnum.USER_TOKEN)
          const userToken = this.storage.get<string>(tokenKey)
          if (userToken) {
            config.headers.user_token = userToken
            config.headers.Authorization = `Bearer ${userToken}`
          }
        } else {
          config.headers.Authorization = `Bearer pat_WdSvHl87B0VA9NsDSB2xP75tPVpbgUa1RJRL7AjqySYBz5yJhA2HCzERLWDySewx`
        }

        return config
      },
      (error: AxiosError) => {
        const newError = handleAxiosError(error)
        return handleServiceResult(newError, null)
      }
    )

    this.instance.interceptors.response.use(
      (async (response) => {
        const { status } = response
        if (status < 300 || status === 304) {
          const backend = response.data
          const { codeKey, dataKey, msgKey, successCode, failCode } = this.backendConfig
          if (!backend[codeKey]) return handleServiceResult(null, backend)

          if (backend[codeKey] === successCode) return handleServiceResult(null, backend[dataKey])

          if (backend[codeKey] === failCode) {
            Message.error({
              content: backend[msgKey],
              duration: REQUEST_ERROR_DURATION
            })
          }

          const error = handleBackendError(backend, this.backendConfig)
          return handleServiceResult(error, null)
        }
        const error = handleResponseError(response)
        return handleServiceResult(error, null)
      }) as (response: AxiosResponse<any, any>) => Promise<any>,
      (error: AxiosError) => {
        const newError = handleAxiosError(error)
        return handleServiceResult(newError, null)
      }
    )
  }
}

export default CustomAxiosInstance
