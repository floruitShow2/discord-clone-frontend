import * as React from 'react'
import { Modal } from '@arco-design/web-react'
import { useModal } from '@/hooks/useModal'

function CreateServerModal() {
  const { isOpen, closeModal } = useModal('CreateServerModal')

  return (
    <Modal title="Create a Server" visible={isOpen} onOk={closeModal} onCancel={closeModal}>
      Give your server a personality with a name and an image. You can always change it later.
    </Modal>
  )
}

export default CreateServerModal
