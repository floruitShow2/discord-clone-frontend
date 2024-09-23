import { createRef, useState } from 'react'
import { UploadItem } from '@arco-design/web-react/es/Upload'
import Cropper, { type ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import UserAvatar from '../userAvatar'
import { IconEdit } from '@arco-design/web-react/icon'
import { Button, Modal, Upload } from '@arco-design/web-react'
import { cs } from '@/utils/property'
import { UploadDataUrl } from '@/api/file'
import { readFileAsDataurl } from '@/utils/file'
import { ImageCropperProps } from './index.interface'

export default function ImageCropper(props: ImageCropperProps) {
    const { url, onChange } = props

  const [visible, setVisible] = useState(false)

  const [fileList, setFileList] = useState<UploadItem[]>([])
  
  // 原始图片文件
  const [image, setImage] = useState(url)

  // 本地图片url
  const [localFileName, setLocalFileName] = useState('')
  const [localImage, setLocalImage] = useState(url)
  const cropperRef = createRef<ReactCropperElement>()

  const handleEdit = () => {
    setVisible(true)
  }

  const handleChangeFiles = async (files: UploadItem[]) => {
    console.log(files)
    const file = files[0]
    if (!file || !file.originFile) return

    try {
      const dataUrl = await readFileAsDataurl(file.originFile)
      setLocalFileName(file.name || '')
      setLocalImage(dataUrl)
    } catch (err) {
      console.log(err)
    } finally {
        setFileList([])
    }
  }
  const handleRevert = () => {
    setLocalImage(image)
  }
  const handleCrop = async () => {
    try {
      if (cropperRef.current?.cropper) {
        const url = cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
        const fd = new FormData()
        fd.append('dataUrl', url)
        fd.append('fileName', localFileName)
        const { data } = await UploadDataUrl(fd)
        if (!data) return
        setImage(data.fileSrc)
        onChange && onChange(data.fileSrc)
        setVisible(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <UserAvatar avatar={image} triggerIcon={<IconEdit onClick={handleEdit} />}></UserAvatar>
      <Modal
        className={cs('w-[60vw]')}
        title="更换头像"
        visible={visible}
        autoFocus={false}
        focusLock={true}
        onOk={handleCrop}
        onCancel={() => setVisible(false)}
      >
        <div className={cs('w-full h-[40vh]', 'flex items-center justify-between')}>
          <Cropper
            ref={cropperRef}
            style={{ height: '100%', width: '50%' }}
            zoomTo={0.3}
            initialAspectRatio={1}
            preview=".img-preview"
            src={localImage}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
          />
          <div className={cs('w-1/2 h-full', 'gap-y-4 flex flex-col items-center justify-center')}>
            <div className={cs('img-preview', '!w-[128px]', 'border border-solid border-gray-200', 'overflow-hidden rounded-md bg-module')}></div>
            <Upload
              accept=".jpg,.png,.jpeg,.webp"
              autoUpload={false}
              showUploadList={false}
              fileList={fileList}
              onChange={handleChangeFiles}
            >
              <Button>选择本地图片</Button>
            </Upload>
            <Button disabled={image === localImage} onClick={handleRevert}>恢复初始头像</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
