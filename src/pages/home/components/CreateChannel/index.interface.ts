import { ChatRoomTypeEnum } from '@/enum/chat-room.enum'

export enum CreateChannelStepEnum {
  // 选择模板
  TEMPLATE = '1',
  // 选择成员
  MEMBERS = '2',
  // 基本信息填写
  FORM = '3'
}

export interface ChannelTemplate {
  name: string
  code: ChatRoomTypeEnum
  description: string
  disabled: boolean
}

export interface CreateChannelProps {
  onSave: () => void
}
