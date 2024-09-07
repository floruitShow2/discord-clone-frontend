import { request } from '@/utils/service'

enum URLs {
  FetchVideoFrame = '/api/file/video/getFrame',
  DownloadFile = '/api/file/download'
}

export const DownloadFile = (fileId: string) => {
  return request.get<Blob>(URLs.DownloadFile, { params: { id: fileId }, responseType: 'blob' })
}

export const FetchVideoFrame = (params: { url: string; seconds: number }) => {
  return request.get<string>(URLs.FetchVideoFrame, { params })
}
