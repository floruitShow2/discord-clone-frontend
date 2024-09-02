export enum CreateChannelStepEnum {
  // 选择模板
  TEMPLATE = '1',
  // 选择成员
  MEMBERS = '2',
  // 基本信息填写
  FORM = '3'
}

export enum CreateChannelTypeEnum {
  // 默认群组
  DEFAULT = '1',
  // 团队群组
  TEAM = '2',
  // 项目群组
  PROJECT = '3'
}

export interface ChannelTemplate {
  name: string
  code: CreateChannelTypeEnum
  description: string
  disabled: boolean
}

export interface CreateChannelInput {
  template: CreateChannelTypeEnum | ''
  members: string[]
}
