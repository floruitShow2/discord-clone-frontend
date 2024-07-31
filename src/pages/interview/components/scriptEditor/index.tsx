import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import MonacoEditor, { OnMount } from '@monaco-editor/react'
import { createATA } from '../../ata'
import { PlaygroundContext, PlaygroundFile } from '../../playgroundContext'
import { ScriptEditorProps } from './index.interface'

function ScriptEditor(props: ScriptEditorProps) {
  const { file: modelFile } = props
  const { theme } = useSelector((state: RootState) => state.settings)

  const { files, selectedFilename, updateFile } = useContext(PlaygroundContext)

  const [curFile, setCurFile] = useState<PlaygroundFile | null>()
  useEffect(() => {
    const findFile = files.find((f) => f.name === selectedFilename)
    setCurFile(modelFile || findFile || null)
  }, [selectedFilename, modelFile])

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true
    })

    // 配置 Less 语法
    monaco.languages.register({ id: 'less' })
    monaco.languages.setMonarchTokensProvider('less', {
      // Less 语法规则
      tokenizer: {
        root: [
          [/[@#\$][\w-]+/, 'variable'],
          [/[{}]/, 'delimiter.bracket'],
          [/\s*[:=]\s*/, 'delimiter'],
          [/\d+(%|px|em|rem|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)?/, 'number'],
          [/[;]/, 'delimiter'],
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
          [/[a-z-]+(?=:)/, 'attribute'],
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string."'],
          [/'/, 'string', "@string.'"]
        ],
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
        string: [
          [/[^\\"']+/, 'string'],
          [/\\./, 'string.escape'],
          [
            /["']/,
            { cases: { '$#==$S2': { token: 'string', next: '@pop' }, '@default': 'string' } }
          ]
        ]
      }
    })

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
    })

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue())
    })
    ata(editor.getValue())
  }

  const handleValueChange = (val?: string) => {
    if (!curFile) return
    updateFile(curFile.name, {
      ...curFile,
      value: val || ''
    })
  }

  return (
    <MonacoEditor
      path={curFile?.name}
      language={curFile?.language || 'javascript'}
      value={curFile?.value || ''}
      theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
      options={{
        fontSize: 16,
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
      onChange={handleValueChange}
    ></MonacoEditor>
  )
}

export default ScriptEditor
