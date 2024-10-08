export const REQUEST_TIMEOUT = 6 * 1000
export const REQUEST_ERROR_DURATION = 2 * 1000

export enum NetworkErrorEnum {
  DEFAULT_ERROR_CODE = 'DEFAULT',
  DEFAULT_ERROR_MESSAGE = '请求错误~',

  REQUEST_TIMEOUT_CODE = 'ECONNABORTED',
  REQUEST_TIMEOUT_MESSAGE = '请求超时!',

  NETWORK_ERROR_CODE = 'NETWORK_ERROR',
  NETWORK_ERROR_MESSAGE = '网络不可用~'
}

export const ErrorStatusEnum = {
  400: '400: 请求出现语法错误~',
  401: '401: 用户未授权~',
  403: '403: 服务器拒绝访问~',
  404: '404: 请求的资源不存在~',
  405: '405: 请求方法未允许~',
  408: '408: 网络请求超时~',
  500: '500: 服务器内部错误~',
  501: '501: 服务器未实现请求功能~',
  502: '502: 错误网关~',
  503: '503: 服务不可用~',
  504: '504: 网关超时~',
  505: '505: http版本不支持该请求~',
  [NetworkErrorEnum.DEFAULT_ERROR_CODE]: NetworkErrorEnum.DEFAULT_ERROR_MESSAGE
}

/** 不同请求服务的环境配置 */
const serviceEnv: Record<ServiceEnv.ServiceEnvType, ServiceEnv.ServiceEnvConfig> = {
  development: {
    url: 'http://localhost:3000'
    // url: 'http://192.168.100.100:3000'
    // url: 'http://192.168.124.88:3000'
  },
  production: {
    url: 'http://47.99.102.151:3000'
  }
}

/**
 * @params env 环境变量
 */
export const getServiceEnvConfig = (env: ImportMetaEnv): ServiceEnv.ServiceEnvConfig => {
  const { MODE = 'development' } = env
  const config = serviceEnv[MODE]

  return { ...config }
}
