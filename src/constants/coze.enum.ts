export enum CozeConversationStatusEnum {
  // 创建会话
  CREATED = 'event:conversation.chat.created',
  // 会话传递中
  IN_PROGRESS = 'event:conversation.chat.in_progress',
  // 消息变化
  DELTA = 'event:conversation.message.delta',
  // 会话完成
  COMPLETE = 'event:conversation.message.completed'
}
