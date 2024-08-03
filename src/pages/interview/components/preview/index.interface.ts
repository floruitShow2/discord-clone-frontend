import { HTMLAttributes } from 'react'

export interface BaseProps extends HTMLAttributes<HTMLElement> {
  url: string
}

export interface MessageData {
  data: {
    type: string
    message: string
  }
}
