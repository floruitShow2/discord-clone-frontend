export enum MessageTypeEnum {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  ACTION = 'action',
  CHAT = 'chat'
}

export enum SocketEmitEvents {
  CREATE_MESSAGE = 'createMessage'
}

export enum SocketOnEvents {
  SOCKET_CONNECT = 'connect',
  MSG_CREATE = 'onCreateMessage',
  MSG_RECALL = 'onRecallMessage'
}
