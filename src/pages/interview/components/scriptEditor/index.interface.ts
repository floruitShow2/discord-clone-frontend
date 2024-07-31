import { HTMLAttributes } from 'react'
import { PlaygroundFile } from '../../playgroundContext'

export interface ScriptEditorProps extends HTMLAttributes<HTMLElement> {
  file?: PlaygroundFile
}
