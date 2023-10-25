import { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'
import { objArrayUnique } from '../../../../../utils/tools'

export default function useSelectAvatar(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [avatarList, setAvatarList] = useState([])
  const [modelIds, setModleIds] = useState([])

  const {
    // eslint-disable-next-line
    location: { search },
    handleSelectLora,
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
    if (fields.lora_model) {
      let modelIdArr = fields.lora_model.split(',')
      setModleIds(modelIdArr)
    } else {
      setModleIds([])
    }
    setIsModalVisible(true)
  }

  const handleSelect = (select) => {
    let resultIndex = modelIds.findIndex((item) => item === select.model_id)
    if (resultIndex >= 0) {
      modelIds.splice(resultIndex, 1)
    } else {
      modelIds.push(select.model_id)
    }
    setModleIds([...modelIds])
  }

  const handleSubmit = () => {
    let modelIdsStr = modelIds.join(',')
    handleSelectLora(modelIdsStr)
    setIsModalVisible(false)
  }

  //Dom
  const getDom = () => {
    return (
      <>
        <Modal
          title="选择lora_model"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="m-modal-full-screen m-sd-chat-modal"
          // forceRender
        >
          <div
            className="m-modal-form-info m-sd-chat-modal-form-info"
          >
            <div className="m-sd-chat-select-avatar-wrap">
              {avatarList.map((item) => (
                <div
                  className={`m-sd-chat-select-avatar-img-wrap ${
                    modelIds.includes(item.model_id) ? 'active' : ''
                  }`}
                  key={item.model_id}
                >
                  {modelIds.includes(item.model_id) ? (
                    <img
                      src={item.avatar}
                      className="m-sd-chat-select-avatar-img"
                      onClick={() => handleSelect(item)}
                      alt="头像"
                    ></img>
                  ) : (
                    <img
                      src={item.avatar}
                      className="m-sd-chat-select-avatar-img-unselected"
                      onClick={() => handleSelect(item)}
                      alt="头像"
                    ></img>
                  )}

                  {modelIds.includes(item.model_id) ? (
                    <div className="m-sd-chat-select-avatar-title">
                      {item.model_id}
                    </div>
                  ) : (
                    <div className="m-sd-chat-select-avatar-title-unselected">
                      {item.model_id}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="m-sd-chat-select-footer">
            <Button
              className="m-space"
              onClick={() => setIsModalVisible(false)}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => handleSubmit()}
              className="m-space"
            >
              确定
            </Button>
          </div>
        </Modal>
      </>
    )
  }

  useEffect(() => {
    let avatarList = [
      {
        model_id: 'more_details',
        avatar: 'https://static.xutongbao.top/ai/sdLora/001more_details.png',
      },
      {
        model_id: 'obese-girls--concept',
        avatar:
          'https://static.xutongbao.top/ai/sdLora/002obese-girls--concept.png',
      },
      {
        model_id: 'yae-miko-genshin',
        avatar: 'https://static.xutongbao.top/ai/sdLora/003yae-miko-genshin.png',
      },
      {
        model_id: 'mix4cutegirl',
        avatar: 'https://static.xutongbao.top/ai/sdLora/004mix4cutegirl.png',
      },
      {
        model_id: 'u58hvdfu4q',
        avatar: 'https://static.xutongbao.top/ai/sdLora/005u58hvdfu4q.png',
      },
      {
        model_id: 'full-body',
        avatar: 'https://static.xutongbao.top/ai/sdLora/006full-body.png',
      },
      {
        model_id: 'beautiful-detail-eye',
        avatar: 'https://static.xutongbao.top/ai/sdLora/007beautiful-detail-eye.png',
      },
      {
        model_id: 'contrast-fix',
        avatar: 'https://static.xutongbao.top/ai/sdLora/008contrast-fix.png',
      },
      {
        model_id: 'hc-kasumigaoka-utaha',
        avatar: 'https://static.xutongbao.top/ai/sdLora/009hc-kasumigaoka-utaha.png',
      },
      {
        model_id: 'hc-echidna-re-zero',
        avatar: 'https://static.xutongbao.top/ai/sdLora/010hc-echidna-re-zero.png',
      },
      {
        model_id: 'yorbriar-lora',
        avatar: 'https://static.xutongbao.top/ai/sdLora/011yorbriar-lora.png',
      },
      {
        model_id: 'mangaart',
        avatar: 'https://static.xutongbao.top/ai/sdLora/012mangaart.png',
      },
      {
        model_id: 'detailtweakerlora',
        avatar: 'https://static.xutongbao.top/ai/sdLora/013detailtweakerlora.png',
      },
      {
        model_id: 'epi-noise-offset-v2',
        avatar: 'https://static.xutongbao.top/ai/sdLora/014epi-noise-offset-v2.png',
      },
      {
        model_id: 'maf',
        avatar: 'https://static.xutongbao.top/ai/sdLora/015maf.png',
      },
      {
        model_id: 'xiangrikui',
        avatar: 'https://static.xutongbao.top/ai/sdLora/016xiangrikui.png',
      },
    ]

    avatarList = objArrayUnique({ arr: avatarList, field: 'model_id' })
    setAvatarList(avatarList)
  }, [])

  return {
    selectLoraHandleModalVisible: handleModalVisible,
    selectLoraGetDom: getDom,
  }
}
