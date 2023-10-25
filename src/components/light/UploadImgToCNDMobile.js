import React, { useState } from 'react'
import { ImageUploader, Dialog } from 'antd-mobile'
import { v4 as uuidv4 } from 'uuid'
import {
  imageUrlFormat,
  uploadImgGetTokenFromLocalStorage,
  uploadGetTokenFromLocalStorageForH5,
} from '../../utils/tools'
import urls from '../../api/urls'
import axios from 'axios'

export default function UploadImgToCND({
  value = '',
  msg,
  type = 'add',
  onChange,
  accept = '.jpg,.png,.jpeg',
  imgUrlCnd,
  imgDir = 'img',
  filePrefix = '',
  uploadType = 1,
  isSd = false,
}) {
  const imageUrl = imageUrlFormat(imgUrlCnd)
  let defaultValue = {
    uid: '-1',
    name: imageUrl,
    status: 'done',
    url: imageUrl,
  }
  const [fileList, setFileList] = useState(value ? [defaultValue] : [])

  const mockUpload = async (file) => {
    const uid = uuidv4()
    const reslutIndex = Array.from(file.name).findLastIndex(
      (item) => item === '.'
    )
    const fileName = uid + file.name.slice(reslutIndex, file.name.length)
    let token
    if (uploadType === 1) {
      token = uploadImgGetTokenFromLocalStorage()
    } else if (uploadType === 2) {
      token = uploadGetTokenFromLocalStorageForH5()
    } else {
      token = uploadImgGetTokenFromLocalStorage()
    }
    const data = new FormData()
    data.append('file', file)
    data.append(
      'key',
      `${imgDir}/${filePrefix ? filePrefix + '-' : ''}${fileName}`
    )
    data.append('fname', fileName)
    data.append('token', token)
    await axios({
      url: urls.light.uploadToCDN,
      method: 'post',
      data,
    }).then((res) => {
      if (res.data.code === 200) {
        if (isSd) {
          typeof onChange === 'function' &&
            onChange('https://static.xutongbao.top/' + res.data.data.key)
        } else {
          typeof onChange === 'function' && onChange(res.data.data.key)
        }
      }
    })

    return {
      url: URL.createObjectURL(file),
    }
  }

  return (
    <span>
      {type !== 'check' ? (
        <ImageUploader
          value={fileList}
          onChange={(info) => {
            if (Array.isArray(info) && info.length === 0) {
              typeof onChange === 'function' && onChange(undefined)
            }
            console.log(info)
            setFileList(info)
          }}
          upload={mockUpload}
          maxCount={1}
          onDelete={() => {
            return Dialog.confirm({
              content: '是否确认删除',
            })
          }}
        />
      ) : value ? (
        <img src={imageUrl} alt={imageUrl} className="m-upload-img-check"></img>
      ) : null}
    </span>
  )
}
