import { HTMLAttributes } from 'react'

export interface EditorRange {
  range: Range
  selection: Selection
}

export enum NodeType {
  TEXT = 'text',
  BR = 'br',
  MENTION = 'mention'
}
interface TextNode {
  type: NodeType.TEXT | NodeType.BR
  data: string
}
interface MentionNode {
  type: NodeType.MENTION
  data: Message.Mention
}
export type INode = TextNode | MentionNode

export interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  mentions?: Message.Mention[]

  placeholder?: string
  disabled?: boolean

  loadMembers?: (query: string) => Promise<User.UserEntity[]>

  onInputChange?: (value: string, mentions: Message.Mention[]) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement, Element>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement, Element>) => void
  onConfirm?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}
