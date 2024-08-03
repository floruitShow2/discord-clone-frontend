import { createContext, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Message } from '@arco-design/web-react'
import { isUndefined } from '@/utils/is'
import { filename2Language } from '@/utils/file'
import { uncompress } from '@/utils/file/compress'
import TemplateEntry from './template/index?raw'
import TemplateTsx from './template/App?raw'
import TemplateCss from './template/index.css?raw'
import TemplateInterface from './template/index.interface?raw'


export interface PlaygroundFile {
  name: string
  value: string
  readonly?: boolean
  language: Editor.AvailableLang
}
export interface PlaygroundContextProps {
  // 文件列表
  files: PlaygroundFile[]
  setFiles: (files: PlaygroundFile[]) => void

  // 选中文件名
  selectedFilename: string | null
  setSelectedFilename: (filename: string) => void

  // 操作文件
  addFile: (filename?: string) => void
  removeFile: (filename: string) => void
  updateFile: (targetFilename: string, file: Partial<PlaygroundFile>) => void
}

const initialFile: PlaygroundFile[] = [
  {
    name: 'index.tsx',
    language: 'typescript',
    readonly: true,
    value: TemplateEntry
  },
  {
    name: 'App.tsx',
    language: 'typescript',
    value: TemplateTsx
  },
  {
    name: 'index.css',
    language: 'css',
    value: TemplateCss
  },
  {
    name: 'index.interface.ts',
    language: 'typescript',
    value: TemplateInterface
  }
]

export const PlaygroundContext = createContext<PlaygroundContextProps>({
  files: [],
  setFiles: () => {},

  selectedFilename: '',
  setSelectedFilename: () => {},

  addFile: () => {},
  removeFile: () => {},
  updateFile: () => {}
})

const getInitialFile = () => {
  try {
    const hash = decodeURIComponent(uncompress(window.location.hash.slice(1)))
    const files: PlaygroundFile[] = JSON.parse(hash)
    console.log(files)
    return files
  } catch {
    return initialFile
  }
}

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props

  const [files, setFiles] = useState<PlaygroundFile[]>(getInitialFile())
  const [selectedFilename, setSelectedFilename] = useState<string>(files[0]?.name || '')

  const addFile = (filename?: string) => {
    const findFile = files.find((f) => f.name === filename)
    if (findFile) {
      console.warn('文件名冲突，无法新增')
      return
    }
    setFiles((prev) => [
      ...prev,
      {
        name: filename || '',
        language: filename ? filename2Language(filename) : 'javascript',
        value: ''
      }
    ])
  }
  const removeFile = (filename: string) => {
    const findIndex = files.findIndex((f) => f.name === filename)
    if (findIndex === -1) {
      console.warn('该文件名不存在')
      return
    }
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== findIndex)
      return newFiles
    })
  }

  const updateFile = (targetFilename: string, file: Partial<PlaygroundFile>) => {
    const findIndex = files.findIndex((f) => f.name === targetFilename)
    if (findIndex === -1) {
      console.warn('该文件名不存在')
      return
    }

    if (file.name && isUndefined(file.value)) {
      const findFile = files.find((f) => f.name === file.name)
      if (findFile) {
        // 如果是新增时创建了重复的名称，移除它
        if (!targetFilename) {
          removeFile(targetFilename)
        }
        Message.warning({
          content: '文件名冲突'
        })
        return
      }
    }

    files.splice(findIndex, 1, { ...files[findIndex], ...file })
    setFiles([...files])
  }

  return (
    <PlaygroundContext.Provider
      value={{
        files,
        setFiles,
        selectedFilename,
        setSelectedFilename,
        addFile,
        removeFile,
        updateFile
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  )
}
