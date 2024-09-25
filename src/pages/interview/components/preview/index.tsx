import { useContext, useEffect, useRef, useState } from 'react'
import { cs } from '@/utils/property'
import { PlaygroundContext } from '../../playgroundContext'
import { UnexpectedPreview } from '../unexpectedPreview'
import iframeRaw from './iframe.html?raw'
import CompileWorker from './compile.worker?worker'
import { BaseProps, MessageData } from './index.interface'

// const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }))

const Preview = (props: BaseProps) => {
  const { className } = props
  // console.log(url)
  const { files } = useContext(PlaygroundContext)
  const [compiledCode, setCompiledCode] = useState('')

  const getIframeUrl = () => {
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0"
          }
        }
      </script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      )
    return URL.createObjectURL(new Blob([res], { type: 'text/html' }))
  }
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl())
  useEffect(() => {
    setIframeUrl(getIframeUrl())
  }, [compiledCode])

  const compileWorker = useRef<Worker>()
  useEffect(() => {
    compileWorker.current = new CompileWorker()
    if (compileWorker.current) {
      compileWorker.current.addEventListener('message', ({ data }) => {
        console.log('worker', data)
        if (data.type === 'COMPILED_CODE') {
          setError('')
          setCompiledCode(data.data)
        } else if (data.type === 'ERROR') {
          setError(data.data)
        }
      })
    }
  }, [])
  useEffect(() => {
    if (compileWorker.current) {
      compileWorker.current.postMessage({ files, entry: 'index.tsx' })
    }
    // const res = compile(files, 'index.tsx')
    // setCompiledCode(res)
    // setError('')
  }, [files])

  const [error, setError] = useState('')
  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data
    if (type === 'ERROR') {
      setError(message)
    }
  }
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className={cs('relative w-full', className)} style={{ height: 'calc(100% - 500px - 40px)' }}>
      <iframe
        src={iframeUrl}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          border: 'none'
        }}
      />

      <UnexpectedPreview type="error" content={error} />
      {/* <ScriptEditor
        file={{
          name: 'dist.js',
          value: compiledCode,
          language: 'javascript'
        }}
      /> */}
    </div>
  )
}

export default Preview
