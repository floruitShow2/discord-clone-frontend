import * as React from 'react'
import { Modal, Avatar, Upload, Input } from '@arco-design/web-react'
import { IconEdit, IconShareExternal } from '@arco-design/web-react/icon'
import type { UploadItem } from '@arco-design/web-react/es/Upload'
import { useModal } from '@/hooks/useModal'
import type { AvatarItem } from './index.interface'

function CreateServerModal() {
  const { isOpen, closeModal } = useModal('CreateServerModal')

  const [avatar, setAvatar] = React.useState<AvatarItem | null>(null)

  const handleAvatarUpload = (files: UploadItem[], currentFile: UploadItem) => {
    setAvatar({
      ...currentFile,
      url: currentFile.originFile ? URL.createObjectURL(currentFile.originFile) : ''
    })
  }

  return (
    <Modal title="Create a Server" visible={isOpen} onOk={closeModal} onCancel={closeModal}>
      <p className='mb-3 text-sm text-primary-l'>
        Give your server a personality with a name and an image. You can always change it later.
      </p>

      {avatar ? (
        <Avatar
          className="mb-3 !w-20 !h-20"
          size={72}
          triggerType="mask"
          triggerIcon={
            <Upload
              accept=".jpg,.png,.jpeg"
              autoUpload={false}
              showUploadList={false}
              onChange={handleAvatarUpload}
            >
              <IconEdit />
            </Upload>
          }
        >
          <img src={avatar?.url} alt="" />
        </Avatar>
      ) : (
        <Upload
          className='mb-3'
          accept=".jpg,.png,.jpeg"
          autoUpload={false}
          showUploadList={false}
          onChange={handleAvatarUpload}
        >
          <div className="w-20 h-20 flex items-center justify-center rounded-full text-primary-l bg-module transition-colors hover:text-heavy-l">
            <IconShareExternal fontSize={18} />
          </div>
        </Upload>
      )}

      <div className='flex flex-col items-start justify-start'>
        <span className='mb-2 text-sm text-primary-l'>Server Name</span>
        <Input placeholder='Please enter your '></Input>
      </div>
    </Modal>
  )
}

export default CreateServerModal
