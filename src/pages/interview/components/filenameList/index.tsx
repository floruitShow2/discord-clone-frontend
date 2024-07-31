import { useContext, useEffect, useState } from 'react'
import { Button } from '@arco-design/web-react'
import { IconPlus, IconClose } from '@arco-design/web-react/icon'
import { cs } from '@/utils/property'
import { PlaygroundContext, PlaygroundFile } from '../../playgroundContext'
import { FilenameListProps } from './index.interface'
import './index.less'

function FilenameList(props: FilenameListProps) {
  const { className } = props
  const { files, selectedFilename, setSelectedFilename, removeFile } = useContext(PlaygroundContext)

  useEffect(() => {
    setSelectedFilename(selectedFilename || files[0]?.name || '')
  }, [files])

  return (
    <div
      className={cs(
        'relative',
        'w-full h-[40px]',
        'flex flex-nowrap items-center justify-between',
        'border-0 border-b border-solid border-primary-b',
        className
      )}
    >
      <ul
        className={cs(
          'w-full h-full pr-[24px] overflow-auto',
          'gap-x-2 flex items-center justify-start'
        )}
      >
        {files.map((file) => (
          <li
            key={file.name}
            className={cs(
              'h-full px-3',
              'gap-x-1 flex items-center justify-center',
              'text-xs text-primary-l',
              'cursor-pointer',
              'hover:text-blue-500',
              selectedFilename === file.name ? 'bg-module' : ''
            )}
            onClick={() => setSelectedFilename(file.name)}
          >
            <span>{file.name}</span>
            {selectedFilename === file.name && (
              <IconClose
                className="translate-y-[1px]"
                onClick={() => removeFile(selectedFilename)}
              />
            )}
          </li>
        ))}
      </ul>
      <div
        className={cs(
          'absolute top-1/2 right-0 -translate-y-1/2',
          'h-full px-2 bg-white',
          'flex items-center justify-start'
        )}
      >
        <Button size="small" type="text" icon={<IconPlus className="" />}></Button>
      </div>
    </div>
  )
}

export default FilenameList
