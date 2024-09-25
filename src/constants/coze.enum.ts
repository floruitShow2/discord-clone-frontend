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

// 对应 Coze 机器人的本地用户
export enum CozeRobot2UserEnum {
  MELEON_UI = '66f03381afa51fe0d15bcec5'
}
export const CozeUsers: string[] = [CozeRobot2UserEnum.MELEON_UI]
export const CozeRobots: Record<CozeRobot2UserEnum, { bot_id: string }> = {
  [CozeRobot2UserEnum.MELEON_UI]: {
    bot_id: '7415948447243092006'
  }
}