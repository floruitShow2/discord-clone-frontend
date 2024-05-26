import { request } from '@/utils/service'

enum URLs {
  USER_LOGIN = '/api/user/login',
  FETCH_USER_INFO = '/api/user/getUserInfo'
}

export const Login = (data: User.LoginInput) => {
  return request.post<{ accessToken: string }>(URLs.USER_LOGIN, data)
}

export const FetchUserInfo = () => {
  return request.get<User.UserEntity>(URLs.FETCH_USER_INFO)
}
