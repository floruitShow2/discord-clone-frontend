import { request } from '@/utils/service'

enum URLs {
  FetchMessageList = '/api/chat/message/getMessagesList',
  FetchMessageById = '/api/chat/message/getMessageById',
  FetchReplyChain = '/api/chat/message/getReplyChain',
  FetchLocatedPage = '/api/chat/message/getLocatedPage',
  CreateFileMessage = '/api/chat/message/createFileMessage',
  RecallMessage = '/api/chat/message/recall',
  ClearRecords = '/api/chat/message/clear'
}

export const FetchMessageList = (params: Message.FetchMessageListInput) => {
  return request.get<Message.Entity[]>(URLs.FetchMessageList, { params })
}

export const FetchMessageById = (messageId: string) => {
  return request.get<Message.Entity>(URLs.FetchMessageById, { params: { messageId } })
}

export const FetchReplyChain = (messageId: string) => {
  return request.get<Message.Entity[]>(URLs.FetchReplyChain, { params: { messageId } })
}

export interface FetchLocatedPageInput {
  roomId: string
  messageId: string
  pageSize: number
}
export const FetchLocatedPage = (params: FetchLocatedPageInput) => {
  return request.get<number>(URLs.FetchLocatedPage, { params })
}

export const CreateFilesMessage = (formData: FormData) => {
  return request.post(URLs.CreateFileMessage, formData)
}

export const RecallMessage = (data: Message.RecallMessageInput) => {
  return request.post<string>(URLs.RecallMessage, data)
}

export const ClearRecords = (roomId: string) => {
  return request.post(URLs.ClearRecords, { roomId })
}
