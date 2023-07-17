import { useState } from 'react'
import { Drawer, Modal, Descriptions, Image } from 'antd'
// eslint-disable-next-line
import { Icon, UploadToCNDAir } from '../../../components/light'
import useFile from './useFile'
// import Api from '../../../api'

export default function useFunctionCalliing(props) {
  const [open, setOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pluginInfo, setPluginInfo] = useState({})
  const handleSubmitDone = ({ data }) => {
    onClose()
    props.changeMessageByUpload({ data })
  }

  const { fileHandleFinish, fileOpenModel, fileGetDom } = useFile({ handleSubmitDone })

  // eslint-disable-next-line
  const handleChangeFile = ({ info }) => {
    console.log(info)
    fileHandleFinish({
      name: info.file.name,
      url: info.file.response.data.key
    })
  }

  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  const showModal = ({ name }) => {
    if (name === 'add') {
      fileOpenModel()
    } else {
      const hooks = [
        {
          title: 'Google',
          name: 'google',
          use: '联网查询特斯拉签署公平竞争协议的新闻',
          imgList: [
            {
              url: 'http://static.xutongbao.top/img/m-plugin-online1.jpg?time=20230708',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-online2.jpg?time=20230708',
            },
            {
              url: 'http://static.xutongbao.top/img/m-chatgpt-online3.jpg?time=20230706',
            },
          ],
        },
        {
          title: '天气',
          name: 'weather',
          use: '北京现在的天气',
          imgList: [
            {
              url: 'http://static.xutongbao.top/img/m-plugin-weather1.jpg?time=20230708',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-weather2.jpg?time=20230708',
            },
          ],
        },
        {
          title: '邮件',
          name: 'email',
          use: '把这个笑话发到我的邮箱',
          imgList: [
            {
              url: 'http://static.xutongbao.top/img/m-plugin-email1.jpg?time=20230708',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-email2.jpg?time=20230708',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-email3.jpg?time=2023070801',
            },
          ],
        },
        {
          title: 'pdf阅读',
          name: 'pdf',
          use: `http://cdn.xutongbao.top/video/ai/41f2e0a3-d136-41fd-ba95-918ee510b8e6/001-92a2e206-65dc-41bf-961e-78245d7de9f7.pdf?e=1688910302&token=uWcSEFW9Ro8e0pnwbfxS7-sZd0BCN_8nS5Cyvukn:u-g4QYcLd5l_6H01Lcm8cExriMQ=
          根据这个pdf链接的内容，回答：济南的冬天是否会下雪？雪景如何？`,
          imgList: [
            {
              url: 'http://static.xutongbao.top/img/m-plugin-pdf1.png?time=20230710',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-pdf2.png?time=20230710',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-pdf3.png?time=20230710',
            },
          ],
        },
        {
          title: '文字识别',
          name: 'text',
          use: `http://static.xutongbao.top/img/m-img-to-text2.jpg根据这个图片链接，获取图片里的文字，点评这段话哪里写的好，哪里写的不好`,
          imgList: [
            {
              url: 'http://static.xutongbao.top/img/m-plugin-img-to-text1.jpg?time=20230712',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-img-to-text2.png?time=20230712',
            },
          ],
        },
        {
          title: '音频视频',
          name: 'video',
          use: `http://cdn.xutongbao.top/img/ai/file/1689152677434-18001acb-e5c8-46d6-b7fd-eba25e961290.mp3?e=1689158631&token=uWcSEFW9Ro8e0pnwbfxS7-sZd0BCN_8nS5Cyvukn:lsFv95fTomlWpQY5oqiCMJzfFpE=根据这个音频链接，获取文字。
          本插件基于Whisper实现，只支持的格式包括：mp3、mp4、mpeg、mpga、m4a、wav、webm`,
          imgList: [
            {
              url: 'http://static.xutongbao.top/img/m-plugin-whisper1.jpg?time=20230712',
            },
            {
              url: 'http://static.xutongbao.top/img/m-plugin-whisper2.jpg?time=20230712',
            },
          ],
        },
      ]
      let resultIndex = hooks.findIndex((item) => item.name === name)
      if (resultIndex >= 0) {
        setPluginInfo(hooks[resultIndex])
        setIsModalOpen(true)
      }
    }
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  //Dom
  const getDom = () => {
    return (
      <>
        <Drawer
          title="插件库"
          placement={'bottom'}
          onClose={onClose}
          open={open}
          className="m-ai-chat-drawer"
          forceRender
        >
          <div className="m-ai-chat-plugin-wrap">
            {/* <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'addAir' })}
              title="上传文件，如：图片、pdf、视频、音频"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <UploadToCNDAir
                  type={'add'}
                  accept={'*.*'}
                  videoDir={`img/ai/file`}
                  imgUrlCnd={''}
                  filePrefix={''}
                  handleChangeFile={handleChangeFile}
                ></UploadToCNDAir>{' '}
              </div>
              <div className="m-ai-chat-plugin-text">上传文件</div>
            </div> */}
            <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'add' })}
              title="上传文件，如：图片、pdf、视频、音频"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <Icon name="add" className="m-ai-chat-plugin-icon"></Icon>
              </div>
              <div className="m-ai-chat-plugin-text">上传文件</div>
            </div>
            <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'google' })}
              title="联网查询,自动调用谷歌的搜索API"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <Icon name="google" className="m-ai-chat-plugin-icon"></Icon>
              </div>
              <div className="m-ai-chat-plugin-text">Google</div>
            </div>
            <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'weather' })}
              title="联网查天气,自动调用高德的天气查询API"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <Icon name="weather" className="m-ai-chat-plugin-icon"></Icon>
              </div>
              <div className="m-ai-chat-plugin-text">天气</div>
            </div>
            <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'email' })}
              title="送邮件到你的注册邮箱"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <Icon name="email" className="m-ai-chat-plugin-icon"></Icon>
              </div>
              <div className="m-ai-chat-plugin-text">邮件</div>
            </div>
            <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'pdf' })}
              title="通过pdf链接识别文本"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <Icon name="pdf" className="m-ai-chat-plugin-icon"></Icon>
              </div>
              <div className="m-ai-chat-plugin-text">pdf阅读</div>
            </div>
            <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'text' })}
              title="通过图片链接识别文本"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <Icon name="text" className="m-ai-chat-plugin-icon"></Icon>
              </div>
              <div className="m-ai-chat-plugin-text">文字识别</div>
            </div>
            <div
              className="m-ai-chat-plugin-item"
              onClick={() => showModal({ name: 'video' })}
              title="通过音频、视频链接识别文本"
            >
              <div className="m-ai-chat-plugin-item-icon-wrap">
                <Icon name="video" className="m-ai-chat-plugin-icon"></Icon>
              </div>
              <div className="m-ai-chat-plugin-text">音频视频</div>
            </div>
          </div>
        </Drawer>
        <Modal
          title="插件"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <Descriptions>
              <Descriptions.Item label="名称" span={3}>
                {pluginInfo.title}
              </Descriptions.Item>
              <Descriptions.Item label="用法" span={3}>
                {pluginInfo.use}
              </Descriptions.Item>
              <Descriptions.Item label="截图" span={3}>
                <div className="m-ai-chat-plugin-img-list">
                  {Array.isArray(pluginInfo.imgList)
                    ? pluginInfo.imgList.map((item, index) => (
                        <div key={index} className="m-ai-chat-plugin-img-wrap">
                          <Image
                            className="m-ai-chat-plugin-img"
                            src={item.url}
                          />
                        </div>
                      ))
                    : null}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Modal>
        {fileGetDom()}
      </>
    )
  }

  return {
    functionCallingShowDrawer: showDrawer,
    functionCallingGetDom: getDom,
  }
}
