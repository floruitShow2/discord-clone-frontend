export interface RoomDrawerProps {
  /**
   * @description 是否显示
   */
  visible: boolean
  /**
   * @description 弹窗内容
   */
  children?: React.ReactNode
  /**
   * @description 关闭弹窗
   */
  onClose: () => void
}

export enum RoomDrawerContentEnum {
  REPLY_CHAIN = 'replyChain'
}

export interface RoomDrawerContentProps {
  type: RoomDrawerContentEnum
  roomId?: string
  messageId: string
  onClose: () => void
}
