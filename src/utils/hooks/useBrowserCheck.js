import { useState } from 'react'
import { Modal, Button, Space } from 'antd'
import uaParser from 'ua-parser-js'
import './index.css'

const { confirm } = Modal

export default function useBrowserCheck(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [browserName, serBrowserName] = useState('')

  const [version, serVersion] = useState('')
  const {
    // eslint-disable-next-line
    location: { search },
  } = props

  //显示对话框
  const handleModalVisible = () => {
    let ua = uaParser(navigator.userAgent)
    const { browser } = ua
    if (browser) {
      let browserName = browser?.name ? browser?.name: '未知'
      let browserVersion = browser?.version ? browser?.version : '未知'
      let browserMajor= browser?.major ? browser?.major - 0 : '未知'
      serBrowserName(browserName)
      serVersion(browserVersion)

      let historyTime = localStorage.getItem('browserCheckTime')
      let browserCheckReject = localStorage.getItem('browserCheckReject')
      let now = Date.now()

      if (historyTime) {
        if (now - historyTime > 1000 * 60 * 60 * 24) {
          // 继续
        } else {
          return
        }
      } else {
        // 继续
      }
      if (browserCheckReject === '1') {
        return
      }

      // console.log(browser)

      if (browserName === 'Chrome' && browserMajor >= 111) {
        return
      }
      
      if (browserName === 'Mobile Safari' && browserMajor >= 13) {
        return
      }

      setIsModalVisible(true)


    } else {
      serBrowserName('未知')
      serVersion('未知')
    }
  }
  const handleLater = () => {
    setIsModalVisible(false)
    let browserCheckTime = Date.now()
    localStorage.setItem('browserCheckTime', browserCheckTime)
  }

  const handleReject = () => {
    confirm({
      title: '我已经安装新版浏览器，确定要【永久拒绝】这个提醒。',
      onOk() {
        localStorage.setItem('browserCheckReject', '1')
        setIsModalVisible(false)
      },
    })
  }

  //Dom
  const getDom = () => {
    return (
      <>
        <Modal
          title="浏览器版本检查"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          forceRender
        >
          <div>
            <div className="m-ai-browser-check-intro">
              您当前的浏览器名称/内核是
              <span className="m-ai-browser-check-value">
                【{browserName}】
              </span>
              ,版本是
              <span className="m-ai-browser-check-value">【{version}】</span>
              ，请下载最新版chrome浏览器。
            </div>
            <div className="m-ai-browser-check-footer">
              <Space wrap>
                <Button onClick={handleLater}>知道了</Button>
                <Button type="primary" danger onClick={handleReject}>
                  已是最新版
                </Button>
                {/* eslint-disable-next-line */}
                <a href={`https://llq.ywswge.cn`} target="_blank">
                  <Button type="primary">立即下载</Button>
                </a>
              </Space>
            </div>
          </div>
        </Modal>
      </>
    )
  }

  return {
    browserCheckHandleModalVisible: handleModalVisible,
    browserCheckGetDom: getDom,
  }
}
