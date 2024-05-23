import { Message } from '@arco-design/web-react'
import { REQUEST_ERROR_DURATION } from './config'

/** 错误消息栈，防止同一错误同时出现 */
const errorMessageStack = new Map<string | number, string>()

const addErrorMsg = (error: Service.RequestError) => {
  errorMessageStack.set(error.Code, error.Message)
}

const removeErrorMsg = (error: Service.RequestError) => {
  errorMessageStack.delete(error.Code)
}

const isErrorMsgExist = (error: Service.RequestError) => {
  return errorMessageStack.has(error.Code)
}

export const showErrorMsg = (error: Service.RequestError) => {
  if (!error.Message || isErrorMsgExist(error)) return

  addErrorMsg(error)

  window.console.warn(error.Code, error.Message)
  Message.error({
    content: error.Message,
    duration: REQUEST_ERROR_DURATION
  })

  setTimeout(() => {
    removeErrorMsg(error)
  }, REQUEST_ERROR_DURATION)
}
