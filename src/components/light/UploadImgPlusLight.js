import React from 'react'
import { Button, Upload, message } from 'antd'
import urls from '../../api/urls'
import { imageUrlFormat, addUploadToken, addUploadExtraData } from '../../utils/tools'

export default function UploadImgPlusLight({ value = [], msg, onChange, ctype = 'company', multiple = true }) {
  let fileList = [];
  if (Array.isArray(value)) {
    fileList = value.map((item, index) => {
      return {
        uid: index,
        name: imageUrlFormat(item),
        status: 'done',
        url: imageUrlFormat(item),
        historyUrl: item,
      }
    })
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
    //maxCount: 1,
    multiple,
    listType: "picture",
    defaultFileList:[...fileList],
    accept: '.jpg',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        const result = info.fileList.map(item => {
          if (item.historyUrl) {
            return item.historyUrl
          } else if (item.response && item.response.data) {
            return item.response.data.filePath
          } else {
            return undefined
          }
        }).filter(item => item)
        if (result.length === 0) {
          onChange(undefined)
        } else {
          onChange(result)
        }        
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        if (info.file.response.state === 1) {
          const result = info.fileList.map(item => {
            if (item.historyUrl) {
              return item.historyUrl
            } else if (item.response && item.response.data) {
              return item.response.data.filePath
            } else {
              return undefined
            }
          }).filter(item => item)
          onChange(result)          
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  return (
    <span>
      <Upload {...uploadProps}>
        <Button>上传图片</Button>
        <span className="m-upload-text">
          {msg}
        </span>
      </Upload>
    </span>
  )
}
