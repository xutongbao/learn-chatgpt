import React from 'react'
import { Button, Upload, message } from 'antd'
import { imageUrlFormat, addUploadToken, addUploadExtraData } from '../../utils/tools'
import urls from '../../api/urls'

export default function UploadImgLight({
  value = '',
  msg,
  type = 'add',
  onChange,
  ctype = 'company',
  accept = '*.*',
}) {
  const imageUrl = imageUrlFormat(value)
  let defaultValue = {
    uid: '-1',
    name: imageUrl,
    status: 'done',
    url: imageUrl,
  }

  const fileList = []
  if (value) {
    fileList.push(defaultValue)
  }

  const uploadProps = {
    name: 'file',
    action: urls.light.uploadFile,
    data: {
      ctype,
      ...addUploadExtraData()
    },
    headers: {
      ...addUploadToken()
    },
    maxCount: 1,
    listType: 'picture',
    defaultFileList: [...fileList],
    accept,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
        onChange(undefined)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        if (info.file.response.code === 200) {
          // console.log(info.file.xhr.responseURL)
          // const imgUrl = `${getHost(info.file.xhr.responseURL)}/${info.file.response.data.filename}`
          // console.log(imgUrl)
          onChange(info.file.response.data.filename)
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  return (
    <span>
      {type !== 'check' ? (
        <Upload {...uploadProps}>
          <Button>上传图片</Button>
          <span className="m-upload-text">{msg}</span>
        </Upload>
      ) : (
        value && (
          <img src={imageUrl} alt={imageUrl} className="m-upload-img-check"></img>
        )
      )}
    </span>
  )
}
