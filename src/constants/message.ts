export enum MessageTypeEnum {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  ACTION = 'action',
  // ai 回复中
  CHAT = 'chat',
  MARKDOWN = 'markdown'
}

export enum SocketEmitEvents {
  CREATE_MESSAGE = 'createMessage'
}

export enum SocketOnEvents {
  SOCKET_CONNECT = 'connect',
  MSG_CREATE = 'onCreateMessage',
  MSG_RECALL = 'onRecallMessage'
}
