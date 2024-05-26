export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  TIMESTAMP = 'timestamp'
}

export enum SocketEmitEvents {
  CREATE_MESSAGE = 'createMessage'
}

export enum SocketOnEvents {
  SOCKET_CONNECT = 'connect',
  MSG_CREATE = 'onCreateMessage'
}
