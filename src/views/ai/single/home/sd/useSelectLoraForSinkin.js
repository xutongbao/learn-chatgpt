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
    setModleId(fields.lora_model)
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
          title="选择lora"
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
                  onClick={() => handleSelect(item)}
                >
                  <img
                    src={item.avatar}
                    className="m-sd-chat-select-avatar-img"
                    alt="头像"
                  ></img>
                  <div className="m-sd-chat-select-avatar-title">
                    {item.name} (ID:{item.model_id})
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
    let models = [
      {
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b4f6dbc0-f3f9-4e5d-cc2c-d423555aa300/width=450/259687.jpeg',
        id: '63f86728a94852bf620de6ba',
        link: 'https://civitai.com/models/7716/taiwan-doll-likeness',
        name: 'Taiwan Doll Likeness',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c7d1ab44-bf90-4be2-99c3-57e6b87db700/width=450',
        id: '63f86747a94852bf620de6bb',
        link: 'https://civitai.com/models/8484/yae-miko-or-realistic-genshin',
        name: 'Yae Miko | Realistic Genshin',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/676532a0-04ad-41c0-cac4-d6d1fa595400/width=450',
        id: '63f86762a94852bf620de6bc',
        link: 'https://civitai.com/models/6638/samdoesarts-sam-yang-style-lora',
        name: 'SamDoesArts Style',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2338276a-87f7-4a1e-f92a-776a18ee4200/width=450',
        id: '63f86778a94852bf620de6bd',
        link: 'https://civitai.com/models/8730/hipoly-3d-model-lora',
        name: 'Hipoly 3D Model',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b1e40d0f-2aa2-4b42-ae1f-ee75f0e42c00/width=450',
        id: '63f86791a94852bf620de6be',
        link: 'https://civitai.com/models/5042/wlop-style-lora',
        name: 'WLOP Style',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9d2d5992-2e4c-4199-083c-cd53c4a4ce00/width=450/166942',
        id: '640124dea94852bf620de6bf',
        link: 'https://civitai.com/models/8217/fashion-girl',
        name: 'Fashion Girl',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1068e7d8-e7ed-49a9-ae61-ae7e7cbb0f00/width=400/167154',
        id: '640fe505a94852bf620de6c2',
        link: 'https://civitai.com/models/13941/epinoiseoffset',
        name: 'epi_noiseoffset',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e1af4e8e-9f19-4b2a-3e51-27aae63e2900/width=400/178487',
        id: '64164c00a94852bf620de6c3',
        link: 'https://civitai.com/models/11352/guofeng3lora',
        name: 'GuoFeng3',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/24ac2393-5acd-4f5e-6f8e-5cff4635db00/width=400/168197',
        id: '64266fe8a94852bf620de6c7',
        link: 'https://civitai.com/models/14171/cutegirlmix4',
        name: 'Cute Girl Mix4',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b860526b-b86a-4009-de67-6e28c1b08400/width=450/00023-2118280204.png',
        id: '642d5137a94852bf620de6c8',
        link: 'https://civitai.com/models/8765?modelVersionId=10638',
        name: "Theovercomer8's Contrast Fix",
      },
      {
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d1095ede-1bbf-4abe-29f0-e4bf042d4600/width=450/355884.jpeg',
        id: '642d5bc9a94852bf620de6c9',
        link: 'https://civitai.com/models/26124/koreandolllikeness-v20',
        name: 'KoreanDollLikeness V2',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/22cb02c6-d35d-4689-1ac0-ee35ea997c00/width=450/153353.jpeg',
        id: '64320988a94852bf620de6ca',
        link: 'https://civitai.com/models/13068/russian-doll-likeness',
        name: 'Russian Doll Likeness',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f39bbb06-3d4b-40cf-36ef-0abac596a000/width=450/375791.jpeg',
        id: '6441ecfb25f742da35a33941',
        link: 'https://civitai.com/models/25995/blindbox',
        name: 'blindbox',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2fff45f4-5e4d-4c4c-0e54-c293b26aee00/width=450/212957',
        id: '644335e281aa1cbb7f979817',
        link: 'https://civitai.com/models/12597/moxin',
        name: 'MoXin',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/65f4efa0-c412-4532-69e6-120edba40000/width=450',
        id: '64433fe981aa1cbb7f9798a4',
        link: 'https://civitai.com/models/5373/makima-chainsaw-man-lora',
        name: 'Makima (Chainsaw Man)',
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/db1107bc-2493-4354-84d4-82a83cc3b600/width=450',
        id: '644dcfb90b565dad324250aa',
        link: 'https://civitai.com/models/8949',
        name: 'Jim Lee (DC Comics / Marvel) Style',
      },
      {
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/fa545fa5-10ca-4b41-8ca0-f91dab227816/width=450/1.jpeg',
        id: '6458617e9fbd2fa61f5bef55',
        link: 'https://civitai.com/models/48139/lowra',
        name: 'LowRA',
      },
      {
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/166551e3-7cea-4c04-ab0e-abc6c8dfc799/width=450',
        id: '64746db54576e7679088f694',
        link: 'https://civitai.com/models/28811/japanesedolllikeness-v15',
        name: 'JapaneseDollLikeness',
      },
      {
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c1697174-7c8d-4bde-b053-7b1ec0692b64/width=450',
        id: '647944c3911a6fa8a2e2712b',
        link: 'https://civitai.com/models/82098/add-more-details-detail-enhancer-tweaker-lora',
        name: 'Add More Details - Detail Enhancer',
      },
      {
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0038e0a9-7543-482b-93bd-e855d2389028/width=450/00008-2987955084.jpeg',
        id: '64af3d903e3dd03c42387499',
        link: 'https://civitai.com/models/73756/3d-rendering-style',
        name: '3D rendering style',
      },
    ]

    let avatarList = []

    avatarList = models.map((item, index) => {
      let num = ''
      index++
      if (index < 10) {
        num = '00' + index
      } else {
        num = '0' + index
      }
      let avatar = `https://static.xutongbao.top/ai/sinkin/lora/${num}_${item.id}.png`
      return {
        ...item,
        model_id: item.id,
        avatar,
      }
    })

    avatarList = objArrayUnique({ arr: avatarList, field: 'model_id' })
    setAvatarList(avatarList)
  }, [])

  return {
    selectLoraHandleModalVisibleForSinkin: handleModalVisible,
    selectLoraGetDomForSinkin: getDom,
  }
}
