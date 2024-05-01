import { useState } from 'react'
import { Modal, Avatar, Upload, Input } from '@arco-design/web-react'
import { IconEdit, IconShareExternal } from '@arco-design/web-react/icon'
import type { UploadItem } from '@arco-design/web-react/es/Upload'
import { useMutation } from '@apollo/client'
import { Mutation, MutationCreateServerArgs } from '@/gql/graphql'
import { CREATE_SERVER } from '@/graphql/mutations/server'
import { useModal } from '@/hooks/useModal'
import type { AvatarItem } from './index.interface'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

function CreateServerModal() {
  const { isOpen, closeModal } = useModal('CreateServerModal')

  const { userInfo } = useSelector((state: RootState) => state.user)

  const [createServer, { loading }] = useMutation<Mutation, MutationCreateServerArgs>(CREATE_SERVER)

  const [avatar, setAvatar] = useState<AvatarItem | null>(null)

  const handleAvatarUpload = (files: UploadItem[], currentFile: UploadItem) => {
    setAvatar({
      ...currentFile,
      url: currentFile.originFile ? URL.createObjectURL(currentFile.originFile) : ''
    })
  }

  const [serverName, setServerName] = useState('')

  const onSubmit = async () => {
    console.log(serverName, avatar)
    if (!serverName || !avatar?.url) return false
    if (!userInfo?.id) return false

    createServer({
      variables: {
        server: {
          name: serverName,
          profileId: userInfo?.id
        },
        file: avatar.originFile
      },
      onCompleted() {
        setAvatar(null)
        setServerName('')
        closeModal()
      }
    })

    return false
  }

  return (
    <Modal title="Create a Server" visible={isOpen} onOk={onSubmit} onCancel={closeModal}>
      <p className="mb-3 text-sm text-primary-l">
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
          className="mb-3"
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

      <div className="flex flex-col items-start justify-start">
        <span className="mb-2 text-sm text-primary-l">Server Name</span>
        <Input
          value={serverName}
          placeholder="Please enter your server name"
          onChange={setServerName}
        ></Input>
      </div>
    </Modal>
  )
}

export default CreateServerModal
