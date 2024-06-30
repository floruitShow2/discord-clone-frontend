import { request } from '@/utils/service'

enum URLs {
  FetchMessageList = '/api/chat/message/getMessagesList',
  CreateFileMessage = '/api/chat/message/createFileMessage',
  Recall = '/api/chat/message/recall',
  Clear = '/api/chat/message/clear'
}

export const FetchMessageList = (params: Message.FetchMessageListInput) => {
  return request.get<Message.Entity[]>(URLs.FetchMessageList, { params })
}

export const CreateFilesMessage = (formData: FormData) => {
  return request.post(URLs.CreateFileMessage, formData)
}

export const RecallMessage = (data: Message.RecallMessageInput) => {
  return request.post<string>(URLs.Recall, data)
}

export const ClearRecords = (roomId: string) => {
  return request.post(URLs.Clear, { roomId })
}
