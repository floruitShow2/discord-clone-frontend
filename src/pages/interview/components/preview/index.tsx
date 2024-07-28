import iframeRaw from './iframe.html?raw'
import { BaseProps } from './index.interface'
import { cs } from '@/utils/property'

const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }))

const Preview = (props: BaseProps) => {
  const { className, url, style } = props
  console.log(url)

  return <iframe className={cs(className)} style={style} src={iframeUrl} />
}

export default Preview
