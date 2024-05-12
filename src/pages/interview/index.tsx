import * as React from 'react'
import { useSelector } from 'react-redux'
import { Button, ResizeBox } from '@arco-design/web-react'
import MonacoEditor, { OnMount } from '@monaco-editor/react'
import { transform } from '@babel/standalone'
import type { PluginObj } from '@babel/core'
import { RootState } from '@/store'
import { createATA } from './ata'
import Preview from './components/preview/index'
import style from './index.module.less'

function InterviewPage() {
  const { theme } = useSelector((state: RootState) => state.settings)

  const [code, setCode] = React.useState(`import lodash from 'lodash';
function App() {
  return <div>guang</div>  
}  
  `)
  const handleValueChange = (val?: string) => {
    setCode(val || '')
  }

  const handleCompile = () => {
    if (!code) return
    const otherCode =`
      function add(a, b) {
          return a + b;
      }
      export { add };
    `
    const url = URL.createObjectURL(new Blob([otherCode], { type: 'application/javascript' }))
    const transformImportSourcePlugin: PluginObj = {
      visitor: {
          ImportDeclaration(path) {
              path.node.source.value = url;
          }
      }
    }
    const res = transform(code, {
      presets: ['react', 'typescript'],
      filename: 'guang.ts',
      plugins: [transformImportSourcePlugin]
    })
    console.log(res.code)
  }

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

  const Aside: React.FC = () => {
    return <aside className="h-full bg-primary">
      侧边栏，预览题目【markdown】
      <Button onClick={handleCompile}>Play</Button>
    </aside>
  }
  const Main: React.FC = () => {
    return <main className="h-full bg-primary">
      <ResizeBox.Split
        className='w-full h-full'
        direction='vertical'
        max={0.8}
        min={0.2}
        panes={[(
          <div className='h-[500px]'>
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
              onChange={handleValueChange}
            ></MonacoEditor>
          </div>
        ), (
          <Preview className='h-[500px]' url=''></Preview>
        )]}
      />
    </main>
  }

  return (
    <div className="w-full h-full flex items-start justify-between">
      <ResizeBox.SplitGroup
        className='w-full h-full'
        panes={[
          {
            content: <Aside />,
            size: 0.3,
            min: 0.2,
            max: 0.8
          },
          {
            content: <Main />,
            size: 0.7,
            min: 0.2,
            max: 0.8
          }
        ]}
      />
    </div>
  )
}

export default InterviewPage
