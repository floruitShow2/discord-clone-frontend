import { request } from '@/utils/service'

enum URLs {
  USER_LOGIN = '/api/user/login',
  FETCH_USER_INFO = '/api/user/getUserInfo',
  SEARCH = '/api/user/search',
  USER_LIST = '/api/user/list'
}

export const Login = (data: User.LoginInput) => {
  return request.post<{ accessToken: string }>(URLs.USER_LOGIN, data)
}

export const FetchUserInfo = () => {
  return request.get<User.UserEntity>(URLs.FETCH_USER_INFO)
}

export const FetchUserByQuery = (query: string) => {
  return request.get<User.UserEntity[]>(URLs.SEARCH, { params: { query } })
}

export const FetchUserList = (ids: string[]) => {
  return request.get<User.UserEntity[]>(URLs.USER_LIST, { params: { ids } })
}
