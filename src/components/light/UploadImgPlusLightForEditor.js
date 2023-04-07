import React from 'react'
import { Button, Upload, message } from 'antd'
import urls from '../../api/urls'
import {
  imageUrlFormat,
  addUploadToken,
  addUploadExtraData,
} from '../../utils/tools'
import Icon from './Icon'
import * as clipboard from 'clipboard-polyfill/text'

let isCopy = false
export default function UploadImgPlusLightForEditor(props) {
  const {
    value = [],
    msg,
    onChange,
    ctype = 'company',
    onInsertImage,
    multiple = true,
  } = props
  let fileList = []
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

  const handleIsCopy = (value) => {
    isCopy = value
  }

  const uploadProps = {
    name: 'file',
    action: urls.light.uploadFile,
    data: {
      ctype,
      ...addUploadExtraData(),
    },
    headers: {
      ...addUploadToken(),
    },
    //maxCount: 1,
    multiple,
    listType: 'picture',
    defaultFileList: [...fileList],
    accept: '.jpg',
    className: 'm-upload',
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: (
        <div>
          <span title="插入图片">
            <Icon
              className="m-upload-img-icon"
              name="add"
              onClick={() => handleIsCopy(false)}
            ></Icon>
          </span>
          <span title="复制图片链接">
            <Icon
              className="m-upload-img-icon"
              name="copy"
              onClick={() => handleIsCopy(true)}
            ></Icon>
          </span>
        </div>
      ),
      showRemoveIcon: true,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        const result = info.fileList
          .map((item) => {
            if (item.historyUrl) {
              return item.historyUrl
            } else if (item.response && item.response.data) {
              return item.response.data.filePath
            } else {
              return undefined
            }
          })
          .filter((item) => item)
        if (result.length === 0) {
          onChange(undefined)
        } else {
          onChange(result)
        }
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        if (info.file.response.state === 1) {
          const result = info.fileList
            .map((item) => {
              if (item.historyUrl) {
                return item.historyUrl
              } else if (item.response && item.response.data) {
                return item.response.data.filePath
              } else {
                return undefined
              }
            })
            .filter((item) => item)
          onChange(result)
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
    onDownload(file) {
      let url = ''
      if (file.url) {
        url = file.url
      } else if (file.response && file.response.data) {
        url = file.response.data.fileImg
      }
      if (isCopy) {
        console.log('复制')
        //file.response.data.fileImg
        clipboard.writeText(url).then(() => {
          message.success('复制图片链接成功')
        })
      } else {
        onInsertImage([url])
      }
    },
  }

  //插入全部
  const handleInsertAll = () => {
    if (Array.isArray(fileList) && fileList.length > 0) {
      let urls = fileList.map((file) => {
        let url = ''
        if (file.url) {
          url = file.url
        } else if (file.response && file.response.data) {
          url = file.response.data.fileImg
        }
        return url
      })
      onInsertImage(urls)
      console.log(fileList)
    } else {
      message.info('请先上传图片')
    }
  }

  return (
    <span>
      <Upload {...uploadProps}>
        <Button>上传图片</Button>
        <span className="m-upload-text">{msg}</span>
      </Upload>
      <Button className="m-top-space" onClick={() => handleInsertAll()}>
        插入全部
      </Button>
    </span>
  )
}
