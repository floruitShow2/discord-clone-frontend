import { HTMLAttributes } from 'react'
export interface BaseProps extends HTMLAttributes<HTMLUListElement> {
  msgs: Message.Entity[]
}
