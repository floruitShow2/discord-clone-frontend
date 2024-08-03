import { cs } from '@/utils/property'
import FilenameList from './components/filenameList'
import Preview from './components/preview/index'
import { PlaygroundProvider } from './playgroundContext'
import ScriptEditor from './components/scriptEditor'
import styles from './index.module.less'
import QuestionPreview from './components/questionPreview'

function InterviewPage() {
  // const handleCompile = () => {
  //   if (!code) return
  //   const otherCode = `
  //     function add(a, b) {
  //         return a + b;
  //     }
  //     export { add };
  //   `
  //   const url = URL.createObjectURL(new Blob([otherCode], { type: 'application/javascript' }))
  //   const transformImportSourcePlugin: PluginObj = {
  //     visitor: {
  //       ImportDeclaration(path) {
  //         path.node.source.value = url
  //       }
  //     }
  //   }
  //   const res = transform(code, {
  //     presets: ['react', 'typescript'],
  //     filename: 'guang.ts',
  //     plugins: [transformImportSourcePlugin]
  //   })
  // }

  return (
    <PlaygroundProvider>
      <div className={cs('w-full h-full', 'flex items-center justify-between')}>
        <aside
          className={cs(
            'w-[400px] h-full bg-primary',
            'border-0 border-r border-solid border-primary-b'
          )}
        >
          <QuestionPreview mode="editor" />
          {/* <Button onClick={handleCompile}>Play</Button> */}
        </aside>
        <main className={cs('h-full bg-primary', styles['main-wrapper'])}>
          <FilenameList className="w-full" />
          <div
            className={cs(
              'w-full h-[500px] py-2',
              'border-0 border-b border-solid border-primary-b'
            )}
          >
            <ScriptEditor />
          </div>
          <Preview className="w-full" style={{ height: 'calc(100% - 500px - 40px)' }} url="" />
        </main>
      </div>
    </PlaygroundProvider>
  )
}

export default InterviewPage
