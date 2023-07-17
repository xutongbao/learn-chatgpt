import React from 'react'
import { Upload, message } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import {
  imageUrlFormat,
  uploadGetTokenFromLocalStorageForH5,
} from '../../../utils/tools'
import Icon from '../Icon'
import urls from '../../../api/urls'
import './index.css'

export default function UploadToCNDAir({
  value = '',
  msg,
  type = 'add',
  accept = '.mp4',
  imgUrlCnd,
  videoDir = 'video/temp',
  filePrefix = '',
  handleChangeFile,
}) {
  const imageUrl = imageUrlFormat(imgUrlCnd)
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
    action: urls.light.uploadToCDN,
    data: (file) => {
      const uid = uuidv4()
      const reslutIndex = Array.from(file.name).findLastIndex(
        (item) => item === '.'
      )
      const fileName = uid + file.name.slice(reslutIndex, file.name.length)
      return {
        key: `${videoDir}/${
          filePrefix ? filePrefix + '-' : ''
        }${Date.now()}-${fileName}`,
        fname: fileName,
        token: uploadGetTokenFromLocalStorageForH5(),
      }
    },
    headers: {},
    maxCount: 1,
    listType: 'picture',
    defaultFileList: [],
    showUploadList: false,
    accept,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        if (info.file.response.code === 200) {
          handleChangeFile && handleChangeFile({ info })
        }
      } else if (info.file.status === 'uploading') {
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  return (
    <span>
      {type !== 'check' ? (
        <Upload {...uploadProps}>
          <Icon name="add" className="m-upload-to-cdn-air-icon"></Icon>
          <span className="m-upload-text">{msg}</span>
        </Upload>
      ) : value ? (
        <a href={imageUrl} target="_blank" rel="noreferrer">
          {imageUrl}
        </a>
      ) : null}
    </span>
  )
}
