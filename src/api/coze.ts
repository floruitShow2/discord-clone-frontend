import { request } from '@/utils/service'

export const createChat = (msg: string) => {
  const data = {
    bot_id: '7414888868773806118',
    user_id: '65b8b9326752f26ab0eb0f32',
    stream: true,
    additional_messages: [
      {
        role: 'user',
        content: msg,
        content_type: 'text'
      }
    ]
  }
  return request.post('/v3/chat', data, { baseURL: 'https://api.coze.cn' })
}
