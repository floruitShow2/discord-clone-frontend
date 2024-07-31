import { useContext, useEffect, useState } from 'react'
import iframeRaw from './iframe.html?raw'
import { BaseProps } from './index.interface'
import { PlaygroundContext } from '../../playgroundContext'
// import ScriptEditor from '../scriptEditor'
import { compile } from './compile'

// const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }))

const Preview = (props: BaseProps) => {
  // const { className, url, style } = props
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

  useEffect(() => {
    const res = compile(files, 'index.tsx')
    setCompiledCode(res)
  }, [files])

  // return <iframe className={cs(className)} style={style} src={iframeUrl} />
  return (
    <div style={{ height: 'calc(100% - 500px - 40px)' }}>
      <iframe
        src={iframeUrl}
        style={{
          width: '100%',
          height: '100%',
          padding: 0,
          border: 'none'
        }}
      />
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
