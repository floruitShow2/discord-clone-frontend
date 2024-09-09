import { HTMLAttributes } from 'react'

export interface EditorRange {
  range: Range
  selection: Selection
}

export interface IMember {
  userId: string
  username: string
  avatar: string
}
export interface IMention extends IMember {
  offset?: number
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
  data: IMention
}
export type INode = TextNode | MentionNode

export interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  metions?: IMention[]

  placeholder?: string
  disabled?: boolean

  loadMembers?: (query: string) => Promise<IMember[]>

  onInputChange?: (value: string, mentions: IMention[]) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement, Element>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement, Element>) => void
  onConfirm?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}
