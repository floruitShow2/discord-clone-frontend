import { createContext, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { filename2Language } from '@/utils/file'
import TemplateEntry from './template/index?raw'
import TemplateTsx from './template/App?raw'
import TemplateCss from './template/index.css?raw'
import TemplateInterface from './template/index.interface?raw'

export interface PlaygroundFile {
  name: string
  value: string
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
  addFile: (filename: string) => void
  removeFile: (filename: string) => void
  updateFile: (targetFilename: string, file: PlaygroundFile) => void
}

const initialFile: PlaygroundFile[] = [
  {
    name: 'index.tsx',
    language: 'typescript',
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
export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props

  const [files, setFiles] = useState<PlaygroundFile[]>(initialFile)
  const [selectedFilename, setSelectedFilename] = useState<string>(files[0]?.name || '')

  const addFile = (filename: string) => {
    const findFile = files.findIndex((f) => f.name === filename)
    if (findFile) {
      console.warn('文件名冲突，无法新增')
      return
    }
    setFiles((prev) => [
      ...prev,
      { name: filename, language: filename2Language(filename), value: '' }
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

  const updateFile = (targetFilename: string, file: PlaygroundFile) => {
    const findIndex = files.findIndex((f) => f.name === targetFilename)
    if (findIndex === -1) {
      console.warn('该文件名不存在')
      return
    }
    files.splice(findIndex, 1, file)
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
