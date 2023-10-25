import { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { objArrayUnique } from '../../../../../utils/tools'

export default function useSelectAvatar(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [avatarList, setAvatarList] = useState([])
  const [modelId, setModleId] = useState()

  const {
    // eslint-disable-next-line
    location: { search },
    handleSelectModel,
  } = props

  //初始值
  let addInitValues = {}
  if (process.env.REACT_APP_MODE === 'dev') {
    addInitValues = {
      code: '',
    }
  } else {
    // eslint-disable-next-line
    addInitValues = {
      code: '',
    }
  }

  //显示对话框
  const handleModalVisible = ({ form }) => {
    let fields = form.getFieldsValue()
    setModleId(fields.model_id)
    setIsModalVisible(true)
  }

  const handleSelect = (item) => {
    handleSelectModel(item)
    setIsModalVisible(false)
  }

  //Dom
  const getDom = () => {
    return (
      <>
        <Modal
          title="选择model_id"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="m-modal-full-screen m-sd-chat-modal"
          // forceRender
        >
          <div className="m-modal-form-info m-sd-chat-modal-form-info">
            <div className="m-sd-chat-select-avatar-wrap">
              {avatarList.map((item) => (
                <div
                  className={`m-sd-chat-select-avatar-img-wrap ${
                    modelId === item.model_id ? 'active' : ''
                  }`}
                  key={item.avatar}
                >
                  <img
                    src={item.avatar}
                    className="m-sd-chat-select-avatar-img"
                    onClick={() => handleSelect(item)}
                    alt="头像"
                  ></img>
                  <div className="m-sd-chat-select-avatar-title">
                    {item.model_id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </>
    )
  }

  useEffect(() => {
    let avatarList = [
      {
        model_id: 'midjourney',
        avatar: 'https://static.xutongbao.top/ai/sdModel/001midjourney.png',
      },
      {
        model_id: 'anything-v3',
        avatar: 'https://static.xutongbao.top/ai/sdModel/002anything-v3.png',
      },
      {
        model_id: 'realistic-vision-v13',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/003realistic-vision-v13.png',
      },
      {
        model_id: 'dream-shaper-8797',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/004dream-shaper-8797.png',
      },
      {
        model_id: 'anything-v4',
        avatar: 'https://static.xutongbao.top/ai/sdModel/005anything-v4.png',
      },
      {
        model_id: 'anything-v5',
        avatar: 'https://static.xutongbao.top/ai/sdModel/006anything-v5.png',
      },
      {
        model_id: 'deliberateappfactory',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/007deliberateappfactory.png',
      },
      {
        model_id: 'dark-sushi-25d',
        avatar: 'https://static.xutongbao.top/ai/sdModel/008dark-sushi-25d.png',
      },
      {
        model_id: 'bg-dream-irl',
        avatar: 'https://static.xutongbao.top/ai/sdModel/009bg-dream-irl.png',
      },
      {
        model_id: 'chillout-app-factory',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/010chillout-app-factory.png',
      },
      {
        model_id: 'gta5-artwork-diffusi',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/011gta5-artwork-diffusi.png',
      },
      {
        model_id: 'sdxl',
        avatar: 'https://static.xutongbao.top/ai/sdModel/012sdxl.png',
      },
      {
        model_id: 'majicmixrealistic',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/013majicmixrealistic.png',
      },
      {
        model_id: 'pinkdream-appfactory',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/014pinkdream-appfactory.png',
      },
      {
        model_id: 'perfect-deli-appfact',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/015perfect-deli-appfact.png',
      },
      {
        model_id: 'anime-babes-bigger',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/016anime-babes-bigger.png',
      },
      {
        model_id: 'dark-appfactory',
        avatar:
          'https://static.xutongbao.top/ai/sdModel/017dark-appfactory.png',
      },
      {
        model_id: 'wifu-diffusion',
        avatar: 'https://static.xutongbao.top/ai/sdModel/018wifu-diffusion.png',
      },
    ]

    avatarList = objArrayUnique({ arr: avatarList, field: 'model_id' })
    setAvatarList(avatarList)
  }, [])

  return {
    selectModelHandleModalVisible: handleModalVisible,
    selectModelGetDom: getDom,
  }
}
