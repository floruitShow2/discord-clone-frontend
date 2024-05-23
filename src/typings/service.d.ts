declare namespace Service {
  interface BackendResultConfig {
    // 接口返回数据格式的字段名
    codeKey: string
    dataKey: string
    msgKey: string
    // 成功 或 失败状态
    successCode: number
    failCode: number
  }

  /**
   * 请求的错误类型：
   * - axios: axios错误：网络错误, 请求超时, 默认的兜底错误
   * - http: 请求成功，响应的http状态码非200的错误
   * - backend: 请求成功，响应的http状态码为200，由后端定义的业务错误
   */
  type RequestErrorType = 'axios' | 'http' | 'backend'

  interface RequestError {
    /** 请求服务的错误类型 */
    ErrorType: RequestErrorType
    /** 错误码 */
    Code: string | number
    /** 错误信息 */
    Message: string
  }

  /** 自定义的请求成功结果 */
  interface SuccessResult<T = any> {
    /** 请求错误 */
    error: null
    /** 请求数据 */
    data: T
  }

  /** 自定义的请求失败结果 */
  interface FailedResult {
    /** 请求错误 */
    error: RequestError
    /** 请求数据 */
    data: null
  }

  type RequestResult<T = any> = SuccessResult<T> | FailedResult
}
