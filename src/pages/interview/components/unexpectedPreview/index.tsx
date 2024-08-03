import { useEffect, useState } from 'react'
import { cs } from '@/utils/property'
import { UnexpectedProps } from './index.interface'

export function UnexpectedPreview(props: UnexpectedProps) {
  const { type, content } = props

  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(!!content)
  }, [content])

  return visible ? (
    <div
      className={cs(
        'absolute left-1/2 bottom-2 -translate-x-1/2',
        'w-[95%] h-2/3 p-4',
        'border border-solid rounded-md',
        type === 'warn'
          ? 'text-orange-500 bg-orange-100 border-orange-300'
          : 'text-red-500 bg-red-100 border-red-300'
      )}
    >
      <div className="w-full h-full relative">
        <pre dangerouslySetInnerHTML={{ __html: content || '' }}></pre>
      </div>
    </div>
  ) : null
}
