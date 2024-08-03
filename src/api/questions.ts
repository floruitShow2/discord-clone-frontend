import { request } from '@/utils/service'

enum URLs {
  CREATE_QUESTION = '/api/question/create'
}

export const CreateQuestion = (data: Partial<Question.Entity>) => {
  return request.post<Question.Entity>(URLs.CREATE_QUESTION, data)
}
