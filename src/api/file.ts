import { request } from '@/utils/service'

enum URLs {
  FetchVideoFrame = '/api/file/video/getFrame',
  UploadFile = '/api/file/upload',
  UploadDataUrl = '/api/file/upload/dataUrl',
  DownloadFile = '/api/file/download'
}

export const DownloadFile = (fileId: string) => {
  return request.get<Blob>(URLs.DownloadFile, { params: { id: fileId }, responseType: 'blob' })
}

export const UploadFile = (data: FormData) => {
  return request.post<LocalFile.Res>(URLs.UploadFile, data)
}

export const UploadDataUrl = (data: FormData) => {
  return request.post<LocalFile.Res>(URLs.UploadDataUrl, data)
}

export const FetchVideoFrame = (params: { url: string; seconds: number }) => {
  return request.get<string>(URLs.FetchVideoFrame, { params })
}
