import { HTMLAttributes } from 'react'

export interface EditorRange {
  range: Range
  selection: Selection
}

export enum NodeType {
  TEXT = 'text',
  BR = 'br',
  MENTION = 'mention',
  EMOJI = 'emoji'
}
interface TextNode {
  type: NodeType.TEXT | NodeType.BR
  data: string
}
interface MentionNode {
  type: NodeType.MENTION
  data: Message.Mention
}
interface EmojiNode {
  type: NodeType.EMOJI
  data: Message.Emoji
}
export type INode = TextNode | MentionNode | EmojiNode

export interface ChatInputMethod {
  focus: () => void
  createEmoji: (src: string) => void
}

export interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  value?: string
  mentions?: Message.Mention[]
  emojis?: Message.Emoji[]

  placeholder?: string
  disabled?: boolean

  loadMembers?: (query: string) => Promise<User.UserEntity[]>

  onInputChange?: (value: string, mentions: Message.Mention[], emojis: Message.Emoji[]) => void
  onFocus?: (event: React.FocusEvent<HTMLDivElement, Element>) => void
  onBlur?: (event: React.FocusEvent<HTMLDivElement, Element>) => void
  onConfirm?: (event: React.KeyboardEvent<HTMLDivElement>) => void
}
