import { request } from '@/utils/service'

enum URLs {
  FetchVideoFrame = '/api/file/video/getFrame'
}

export const FetchVideoFrame = (params: { url: string; seconds: number }) => {
  return request.get<string>(URLs.FetchVideoFrame, { params })
}
