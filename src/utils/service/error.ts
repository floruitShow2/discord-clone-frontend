import type { AxiosError, AxiosResponse } from 'axios'
import { NetworkErrorEnum, ErrorStatusEnum } from './config'
import { execStrategyActions } from '@/utils/mode/strategy'
import { showErrorMsg } from './message'

type ErrorStatusCode = keyof typeof ErrorStatusEnum

export function handleAxiosError(axiosError: AxiosError) {
  const defaultError: Service.RequestError = {
    ErrorType: 'axios',
    Code: NetworkErrorEnum.DEFAULT_ERROR_CODE,
    Message: NetworkErrorEnum.DEFAULT_ERROR_MESSAGE
  }

  const actions: Common.StrategyAction[] = [
    [
      // 网路问题
      !window.navigator.onLine || axiosError.message === 'Network Error',
      () => {
        Object.assign(defaultError, {
          Code: NetworkErrorEnum.DEFAULT_ERROR_CODE,
          Message: NetworkErrorEnum.DEFAULT_ERROR_MESSAGE
        })
      }
    ],
    [
      // 超时异常
      axiosError.code === NetworkErrorEnum.REQUEST_TIMEOUT_CODE &&
        axiosError.message.includes('timeout'),
      () => {
        Object.assign(defaultError, {
          Code: NetworkErrorEnum.REQUEST_TIMEOUT_CODE,
          Message: NetworkErrorEnum.REQUEST_TIMEOUT_MESSAGE
        })
      }
    ],
    [
      // 连接不成功的请求
      Boolean(axiosError.response),
      () => {
        const errorCode: ErrorStatusCode =
          (axiosError.response?.status as ErrorStatusCode) || NetworkErrorEnum.DEFAULT_ERROR_CODE
        const errorMessage = ErrorStatusEnum[errorCode]
        Object.assign(defaultError, {
          Code: errorCode,
          Message: errorMessage
        })
      }
    ]
  ]

  execStrategyActions(actions)

  showErrorMsg(defaultError)

  return defaultError
}

/**
 * 处理请求成功后的错误
 * @param response - 请求的响应
 */
export function handleResponseError(response: AxiosResponse) {
  const error: Service.RequestError = {
    ErrorType: 'axios',
    Code: NetworkErrorEnum.DEFAULT_ERROR_CODE,
    Message: NetworkErrorEnum.DEFAULT_ERROR_MESSAGE
  }

  if (!window.navigator.onLine) {
    // 网路错误
    Object.assign(error, {
      Code: NetworkErrorEnum.NETWORK_ERROR_CODE,
      Message: NetworkErrorEnum.NETWORK_ERROR_MESSAGE
    })
  } else {
    // 请求成功的状态码非200的错误
    const errorCode = response.status as ErrorStatusCode
    const msg = ErrorStatusEnum[errorCode || NetworkErrorEnum.DEFAULT_ERROR_CODE]
    Object.assign(error, {
      ErrorType: 'http',
      Code: errorCode,
      Message: msg
    })
  }

  showErrorMsg(error)

  return error
}

/**
 * @description 处理后端返回的错误, Code 不为 1 或-1 等特殊情况, 处理为标注的 error 格式
 * @param backendResult - 后端接口的响应数据
 */
export function handleBackendError(
  backendResult: Record<string, any>,
  config: Service.BackendResultConfig
) {
  const { codeKey, msgKey } = config
  const error: Service.RequestError = {
    ErrorType: 'backend',
    Code: backendResult[codeKey],
    Message: backendResult[msgKey]
  }

  showErrorMsg(error)

  return error
}
