import React, { HTMLAttributes } from 'react'
export interface BaseProps extends HTMLAttributes<HTMLUListElement> {
  msgs: Message.Entity[]
}

export interface NormalMessageProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
  onPreview: (msg: Message.Entity) => void
}

export interface DropdownListProps extends HTMLAttributes<HTMLElement> {
  msg: Message.Entity
}
