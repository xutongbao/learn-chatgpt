import React, { useState, useEffect, useRef } from 'react'
import { Button, Upload, message, Modal, Carousel } from 'antd'
import Icon from './Icon'
import urls from '../../api/urls'
import {
  imageUrlFormat,
  addUploadToken,
  addUploadExtraData,
} from '../../utils/tools'

let orderType = 'up'
export default function UploadImgPlusLightWithOrder({
  value = [],
  msg,
  onChange,
  ctype = 'company',
  multiple = false
}) {
  const [fileList, setFileList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const carouselEl = useRef(null)

  const getUrl = (file) => {
    let url = ''
    if (file.url) {
      url = file.url
    } else if (file.response && file.response.data) {
      url = file.response.data.fileImg
    }
    return url
  }

  const handlePreview = (file) => {
    const currentIndex = fileList.findIndex(item => {
      return getUrl(item) === getUrl(file)
    })
    carouselEl.current.goTo(currentIndex, false)
    setIsModalVisible(true)
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
    //listType: "picture-card",
    fileList: [...fileList],
    accept: '.jpg',
    className: 'm-upload-order',
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: (
        <div>
          <Icon
            name="top-arrow"
            title="置顶"
            className="m-upload-img-icon"
            onClick={() => {
              orderType = 'top'
            }}
          ></Icon>
          <Icon
            name="order-arrow"
            title="上移"
            className="m-upload-img-icon"
            onClick={() => {
              orderType = 'up'
            }}
          ></Icon>
          <Icon
            name="order-arrow"
            title="下移"
            className="m-upload-img-icon rotate"
            onClick={() => {
              orderType = 'down'
            }}
          ></Icon>
          <Icon
            name="top-arrow"
            title="置底"
            className="m-upload-img-icon rotate"
            onClick={() => {
              orderType = 'bottom'
            }}
          ></Icon>
        </div>
      ),
      showRemoveIcon: true,
    },
    onChange(info) {
      let fileList = [...info.fileList]
      setFileList(fileList)
      if (info.file.status !== 'uploading') {
        const result = info.fileList.map((item) => {
          if (item.historyUrl) {
            return item.historyUrl
          } else if (item.response && item.response.data) {
            return item.response.data.filePath
          } else {
            return undefined
          }
        }).filter(item => item)
        console.log(result)
        if (result.length === 0) {
          //handleFileList([])
          onChange(undefined)
        } else {
          //handleFileList(result)
          onChange(result)
        }
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
        if (info.file.response.state === 1) {
          const result = info.fileList.map((item) => {
            if (item.historyUrl) {
              return item.historyUrl
            } else if (item.response && item.response.data) {
              return item.response.data.filePath
            } else {
              return undefined
            }
          }).filter(item => item)
          console.log(result)
          //handleFileList(result)
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
      console.log(value)
      console.log(url)
      if (Array.isArray(value) && value.length > 0) {
        let index = value.findIndex((item) => {
          return url.includes(item)
        })
        if (orderType === 'top') {
          if (index > 0) {
            const temp = value[index]
            value.splice(index, 1)
            value.unshift(temp)
            handleFileList(value)
            onChange(value)
          }
        } else if (orderType === 'up') {
          // 利用ES6的解构赋值能更加便捷的进行元素交换
          if (index > 0) {
            ;[value[index - 1], value[index]] = [value[index], value[index - 1]]
            handleFileList(value)
            onChange(value)
          }
        } else if (orderType === 'down') {
          if (index < value.length - 1) {
            ;[value[index + 1], value[index]] = [value[index], value[index + 1]]
            handleFileList(value)
            onChange(value)
          }
        } else if (orderType === 'bottom') {
          if (index < value.length - 1) {
            const temp = value[index]
            value.splice(index, 1)
            value.push(temp)
            handleFileList(value)
            onChange(value)
          }
        }
      }
    },
    onPreview: handlePreview,
  }

  const handleFileList = (value) => {
    if (Array.isArray(value)) {
      const tempFileList = value.map((item, index) => {
        return {
          uid: index,
          name: imageUrlFormat(item),
          status: 'done',
          url: imageUrlFormat(item),
          historyUrl: item,
        }
      })
      setFileList(tempFileList)
    }
  }

  useEffect(() => {
    handleFileList(value)
    // eslint-disable-next-line
  }, [])

  return (
    <span>
      <Upload {...uploadProps}>
        <Button>上传图片</Button>
        <span className="m-upload-text">{msg}</span>
      </Upload>
      <Modal
        title="预览"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        className="m-modal-full-screen m-carousel-modal"
        footer={null}
        forceRender
      >
        <Carousel className="m-carousel" dots={ {className: "m-dots"} } ref={carouselEl} >
          {fileList.map((file) =>  {
            let url = ''
            if (file.url) {
              url = file.url
            } else if (file.response && file.response.data) {
              url = file.response.data.fileImg
            }
            return (
              <div className="m-carousel-img-wrap" key={url}>
                <img
                  src={url}
                  className="m-carousel-img"
                  alt="img"
                />
              </div>
            )
          })}
        </Carousel>
        <div className="m-modal-img-footer">
          <Button className="m-space" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>
        </div>
      </Modal>
    </span>
  )
}
