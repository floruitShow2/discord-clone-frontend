import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import CustomAxiosInstance from './instance'

type RequestMethod = 'get' | 'post' | 'put' | 'delete'

interface RequestParam {
  url: string
  method?: RequestMethod
  data?: any
  axiosConfig?: AxiosRequestConfig
}

async function getRequestResponse(params: {
  instance: AxiosInstance
  method: RequestMethod
  url: string
  data?: any
  config?: AxiosRequestConfig
}) {
  const { instance, method, url, data, config } = params

  let res: any
  if (method === 'get' || method === 'delete') {
    res = await instance[method](url, config)
  } else {
    res = await instance[method](url, data, config)
  }
  return res
}

export const useRequest = (
  axiosConfig: AxiosRequestConfig,
  backendConfig?: Service.BackendResultConfig
) => {
  const customInstance = new CustomAxiosInstance(axiosConfig, backendConfig)

  /**
   * 异步promise请求
   * @param param - 请求参数
   * - url: 请求地址
   * - method: 请求方法(默认get)
   * - data: 请求的body的data
   * - axiosConfig: axios配置
   */
  async function asyncRequest<T>(param: RequestParam): Promise<Service.RequestResult<T>> {
    const { url } = param
    const method = param.method || 'get'
    const { instance } = customInstance
    const res = (await getRequestResponse({
      instance,
      method,
      url,
      data: param.data,
      config: param.axiosConfig
    })) as Service.RequestResult<T>

    return res
  }

  /**
   * get请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function get<T>(url: string, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'get', axiosConfig: config })
  }

  /**
   * post请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'post', data, axiosConfig: config })
  }
  /**
   * put请求
   * @param url - 请求地址
   * @param data - 请求的body的data
   * @param config - axios配置
   */
  function put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'put', data, axiosConfig: config })
  }

  /**
   * delete请求
   * @param url - 请求地址
   * @param config - axios配置
   */
  function handleDelete<T>(url: string, config?: AxiosRequestConfig) {
    return asyncRequest<T>({ url, method: 'delete', axiosConfig: config })
  }

  return {
    get,
    post,
    put,
    delete: handleDelete
  }
}
