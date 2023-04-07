import React from 'react'
import { Button, Upload, message } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import {
  imageUrlFormat,
  uploadImgGetTokenFromLocalStorage,
} from '../../utils/tools'
import urls from '../../api/urls'

export default function UploadVideoToCND({
  value = '',
  msg,
  type = 'add',
  onChange,
  accept = '.mp4',
  imgUrlCnd,
  videoDir = 'video/temp',
  filePrefix = ''
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
      const reslutIndex = Array.from(file.name).findLastIndex(item => item === '.')
      const fileName = uid + file.name.slice(reslutIndex, file.name.length)
      return {
        key: `${videoDir}/${filePrefix ? filePrefix + '-' : ''}${fileName}`,
        fname: fileName,
        token: uploadImgGetTokenFromLocalStorage(),
      }
    },
    headers: {},
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
          onChange(info.file.response.data.key)
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
          <Button>上传视频{type}</Button>
          <span className="m-upload-text">{msg}</span>
        </Upload>
      ) : (
        value ? (
          <a href={imageUrl} target="_blank" rel="noreferrer">{imageUrl}</a>
        ): null
      )}
    </span>
  )
}
