import * as React from 'react'
import MonacoEditor, { OnMount } from '@monaco-editor/react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { createATA } from './ata'

function InterviewPage() {
  const { theme } = useSelector((state: RootState) => state.settings)

  const code = `import lodash from 'lodash';
function App() {
  return <div>guang</div>  
}  
  `

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument')?.run()
    })

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true
    })

    const ata = createATA((code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
    })

    editor.onDidChangeModelContent(() => {
      ata(editor.getValue())
    })
    ata(editor.getValue())
  }

  return (
    <div className="w-full h-full flex items-start justify-between">
      <aside className="w-[400px] h-full border-r border-solid border-primary-b bg-primary">
        侧边栏，预览题目【markdown】
      </aside>
      <main className="flex-1 h-full bg-primary">
        <MonacoEditor
          path={'guang.tsx'}
          language={'typescript'}
          value={code}
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
        ></MonacoEditor>
      </main>
    </div>
  )
}

export default InterviewPage
