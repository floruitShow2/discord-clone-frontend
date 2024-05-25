import axios, { AxiosResponse } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import useStorage, { UseStorageEntity } from '@/utils/storage/local'
import { handleAxiosError, handleBackendError, handleResponseError } from './error'
import { handleServiceResult } from './handler'
import { Message } from '@arco-design/web-react'
import { REQUEST_ERROR_DURATION } from './config'

class CustomAxiosInstance {
  instance: AxiosInstance

  backendConfig: Service.BackendResultConfig

  storage: UseStorageEntity

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
        const tokenKey = this.storage.genKey('token')
        const userToken = this.storage.get<string>(tokenKey)
        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`
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
