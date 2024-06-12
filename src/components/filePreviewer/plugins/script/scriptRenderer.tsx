import { useEffect, useState } from 'react'
import MonacoEditor, { OnMount } from '@monaco-editor/react'
import { RendererProps } from '../../index.interface'

export default function ScriptRenderer(props: RendererProps) {
  const { filename, url } = props

  const [code, setCode] = useState<string>('')
  const loadCode = async (url: string) => {
    const response = await fetch(url)
    const val = await response.text()
    setCode(val)
  }
  useEffect(() => {
    loadCode(url)
  }, [url])

  const [fileType, setFileType] = useState<string>('')
  const updateFileType = (value: string) => {
    const fileExt = value.split('.').pop()
    const fileTypeMap: Record<string, string> = {
        js: 'javascript',
        ts: 'typescript',
        html: 'html',
        jsx: 'javascript',
        tsx: 'typescript'
    }
    setFileType(fileTypeMap[fileExt || 'js'])
  }
  useEffect(() => {
    updateFileType(filename)
  }, [filename])
  
  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true
    })
  }

  return (
    <div className="w-full h-full bg-module">
      <MonacoEditor
        language={fileType}
        value={code}
        options={{
          fontSize: 16,
          readOnly: false,
          disableLayerHinting: true,
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false
          },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6
          }
        }}
        onMount={handleEditorMount}
      ></MonacoEditor>
    </div>
  )
}
