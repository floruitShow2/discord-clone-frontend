import { request } from '@/utils/service'

enum URLs {
  FetchMessageList = '/api/chat/message/getMessagesList',
  CreateFileMessage = '/api/chat/message/createFileMessage'
}

export const FetchMessageList = (params: Message.FetchMessageListInput) => {
  return request.get<Message.Entity[]>(URLs.FetchMessageList, { params })
}

export const CreateFilesMessage = (formData: FormData) => {
  return request.post(URLs.CreateFileMessage, formData)
}
