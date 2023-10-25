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
        civitai_model_id: 4384,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e44bb2f8-5cf6-408f-a00d-34293272434e/width=450',
        id: '4zdwGOB',
        link: 'https://civitai.com/models/4384/dreamshaper',
        name: 'DreamShaper',
        tags: [
          'anime',
          'landscapes',
          'girl',
          '3d',
          'photorealistic',
          'inpainting',
          'digital art',
          'scifi',
          'base model',
          'fantasy art',
          'art style',
          'paintings',
          'woman',
          'illustration',
          '2d',
          'digital illustration',
          'fantasy',
          'girls',
          'portraits',
          'realistic',
          'video game',
        ],
      },
      {
        civitai_model_id: 4694,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/40d39c5a-219b-4a38-a6fd-7768d43bba00/width=400',
        id: 'RREKVLd',
        link: 'https://civitai.com/models/4694/magifactory-t-shirt-diffusion',
        name: '<MAGIFACTORY> t-shirt diffusion',
        tags: ['t-shirt', 'logo'],
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d85a565a-fe59-460a-4950-3ed56b2a9a00/width=400',
        id: 'WLNOl76',
        link: 'https://civitai.com/models/4823/deliberate',
        name: 'Deliberate',
      },
      {
        civitai_model_id: 5043,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/42d812b2-9212-4447-3f65-8ab8ab170200/width=400',
        id: 'nG2nkqN',
        link: 'https://civitai.com/models/5043/suzumehachi',
        name: 'Suzumehachi',
        tags: [
          'anime',
          '3d',
          'general purpose',
          'mix',
          'base model',
          'portraits',
          'realistic',
          'semi-realistic',
          'suzumehachi',
        ],
      },
      {
        civitai_model_id: 4201,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/3d24b551-1261-43a0-942d-d669a1669600/width=400',
        id: '8jqEDBN',
        link: 'https://civitai.com/models/4201/realistic-vision-v12',
        name: 'Realistic Vision V1.2',
        tags: [
          'photorealistic',
          'anatomical',
          'base model',
          'cgi',
          'realistic',
          'semi-realistic',
        ],
      },
      {
        civitai_model_id: 2220,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/41befec4-8766-44d2-c919-18724437d200/width=400',
        id: 'mG9Pvko',
        link: 'https://civitai.com/models/2220/babes',
        name: 'Babes',
        tags: [
          'animals',
          'subject',
          'midjourney',
          'bimbo',
          'sexy',
          'female',
          'babes',
          'base model',
          'portrait',
          'graphic design',
          'woman',
          'illustration',
          'cars',
          'fantasy',
          'girls',
          'male',
          'portraits',
          'style art',
          'cartoonish',
          'carton',
        ],
      },
      {
        civitai_model_id: 4201,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/393713d6-c943-4c6a-7247-ad5f03583200/width=400/333323',
        id: 'r2La2w2',
        link: 'https://civitai.com/models/4201/realistic-vision-v13',
        name: 'Realistic Vision',
        tags: [
          'photorealistic',
          'anatomical',
          'base model',
          'cgi',
          'realistic',
          'semi-realistic',
        ],
      },
      {
        civitai_model_id: 1116,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2654aa3-f5b8-4e6a-a2d9-f6bf7f0e0400/width=400',
        id: 'vlnWOO4',
        link: 'https://civitai.com/models/1116/rpg',
        name: 'RPG V4',
        tags: [
          'baldur’s gate',
          'new world',
          'style',
          'fantasy',
          'rpg',
          'world of warcraft',
        ],
      },
      {
        cover_img:
          'https://illustration-generated.s3.us-west-1.amazonaws.com/1676500650_391.jpg',
        id: 'V6vYoaL',
        link: 'https://huggingface.co/Dunkindont/Foto-Assisted-Diffusion-FAD_V0',
        name: 'Foto Assisted Diffusion (FAD) V0',
      },
      {
        civitai_model_id: 10028,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/991f0217-2501-4106-957a-fcc7643f7061/width=450',
        id: 'qGdxrYG',
        link: 'https://civitai.com/models/10028',
        name: 'NeverEnding Dream',
        tags: [
          'anime',
          'landscapes',
          'girl',
          '3d',
          'photorealistic',
          'female',
          'cosplay',
          'base model',
          'art style',
          'woman',
          'illustration',
          'digital illustration',
          'fantasy',
          'girls',
          'photography',
          'portraits',
          'realistic',
          'semi-realistic',
          'video game',
          'women',
        ],
      },
      {
        civitai_model_id: 4823,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0fb83c7f-7760-4870-95ec-4f7653ea4f00/width=450',
        id: 'K6KkkKl',
        link: 'https://civitai.com/models/4823/deliberate',
        name: 'Deliberate V2',
        tags: [
          'character',
          'girl',
          '3d',
          'subject',
          'render',
          'photorealistic',
          'female',
          'retro',
          'anatomical',
          'art',
          'intricate',
          'accurate',
          'woman',
          'illustration',
          'cars',
          'cartoon',
          'cinematic',
          'fantasy',
          'photography',
          'realistic',
        ],
      },
      {
        civitai_model_id: 7240,
        cover_img:
          'https://illustration-generated.s3.us-west-1.amazonaws.com/meina_mix_v11.png',
        id: 'vln8Nwr',
        link: 'https://civitai.com/models/7240/meinamix',
        name: 'MeinaMix',
        tags: [
          'anime',
          'girl',
          'sexy',
          'female',
          'inpainting',
          'mix',
          'base model',
          'model',
          'illustration',
          '2d',
          'artstyle',
          'portraits',
          'semi-realistic',
          'landscape',
          'styles',
        ],
      },
      {
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d0dd4ebe-dc32-48e3-ce92-1b4dd060b500/width=450/190336',
        id: 'NR6ZVma',
        link: 'https://civitai.com/models/5396/dalcefopainting',
        name: 'dalcefo_painting',
      },
      {
        civitai_model_id: 10415,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/31243ad7-720b-424d-4473-7ab3b2df1100/width=400/178650',
        id: 'LA9j2nX',
        link: 'https://civitai.com/models/10415/3-guofeng3',
        name: 'GuoFeng',
        tags: [
          'anime',
          'girl',
          '3d',
          'chinese',
          'chinese dress',
          'style',
          'woman',
          'cartoon',
          'game character',
          'girls',
          'realistic',
        ],
      },
      {
        civitai_model_id: 3079,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2d5b905f-abee-46a0-6a05-6e799955c200/width=400/',
        id: 'NRz9J7R',
        link: 'https://civitai.com/models/3079/duchaitenaiart',
        name: 'DucHaitenAIart',
        tags: [
          'anime',
          '3d',
          'all in one',
          'manga',
          'pixar',
          'style',
          'woman',
          '2d',
          'cartoon',
          'digital illustration',
          'portraits',
        ],
      },
      {
        civitai_model_id: 17754,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/25bc6b0d-e955-4eff-b406-935c59abfe00/width=400/377620',
        id: 'DreamFul',
        link: 'https://civitai.com/models/17754/dreamful',
        name: 'DreamFul',
        tags: [
          'anime',
          'girl',
          'portaits',
          '3d',
          'photorealistic',
          'illustration',
          'beautiful',
          'fantasy',
          'photography',
          'realistic',
        ],
      },
      {
        civitai_model_id: 8542,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/86750c07-8e7c-42ab-a1b5-1c9e113f1300/width=400/158036',
        id: 'lGJBaxy',
        link: 'https://civitai.com/models/8542/duchaitenclassicanime',
        name: 'DucHaitenClassicAnime',
        tags: ['anime', 'classic', '3d', 'retro', 'manga', 'cgi', 'style'],
      },
      {
        civitai_model_id: 5041,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/46ea935f-5f47-4ac6-1bf7-008497c28200/width=400/',
        id: 'X9zNVO1',
        link: 'https://civitai.com/models/5041/cheese-daddys-landscapes-mix',
        name: "Cheese Daddy's Landscapes mix",
        tags: [
          'landscapes',
          'photorealistic',
          'nvinkpunk',
          'style',
          'illustration',
          'fantasy',
          'photography',
        ],
      },
      {
        civitai_model_id: 23521,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b0bcc02f-a72f-4a56-6815-ad71d583ae00/width=400/316023',
        id: 'woErXml',
        link: 'https://civitai.com/models/23521/anime-pastel-dream',
        name: 'Anime Pastel Dream',
        tags: [
          'anime',
          'girl',
          'sexy',
          'female',
          'manga',
          'base model',
          'concept art',
          'pastel',
          'art style',
          'woman',
          'illustration',
          'artstyle',
          'beautiful',
          'cute',
          'fantasy',
          'girls',
        ],
      },
      {
        civitai_model_id: 23900,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/5c162e30-f848-41da-b746-c51ccbf0e700/width=400/337388',
        id: 'WLRRBnv',
        link: 'https://civitai.com/models/23900',
        name: 'AnyLoRA',
        tags: [
          'anime',
          'girl',
          'sexy',
          'female',
          'manga',
          'base model',
          'art style',
          'woman',
          'illustration',
          'beautiful',
          'girls',
          'anylora',
        ],
      },
      {
        civitai_model_id: 2504,
        cover_img:
          'https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2c982a55-fd90-4b68-4004-fe8fc3489000/width=400/01420-3641529570-3d_render_of_a_highly_detailed_Batman_Cyborg_wearing_cybernetics_and_intricate_detail_armor_with_armored_plates_hdr_8k_subs.png',
        id: 'mG22KJg',
        link: 'https://civitai.com/models/2504/unvail-ai-3dkx-v2',
        name: 'Unvail AI 3DKX',
        tags: [
          '3d',
          'all in one',
          'versatile',
          'highly detailed',
          '3d cartoon',
          '3d render',
          'very high quality',
        ],
      },
      {
        cover_img:
          'https://illustration-generated.s3.us-west-1.amazonaws.com/vK2AgHVo8FS1WMsdBphHE.jpg',
        id: 'EYWOblK',
        link: 'https://huggingface.co/DucHaiten/DucHaiten-StyleLikeMe',
        name: 'DucHaiten-StyleLikeMe',
      },
      {
        civitai_model_id: 11866,
        cover_img:
          'https://illustration-generated.s3.us-west-1.amazonaws.com/meina_pastel_v6_512.png',
        id: 'xylZzvg',
        link: 'https://civitai.com/models/11866/meinapastel',
        name: 'MeinaPastel',
        tags: [
          'anime',
          'girl',
          'colorful',
          'inpainting',
          'base model',
          'vibrant colors',
          'illustration',
          'artstyle',
          'fantasy',
        ],
      },
      {
        civitai_model_id: 2583,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b4b46cd4-68a8-41fa-bf37-32f99e0170e8/width=450',
        id: '76EmEaz',
        link: 'https://civitai.com/models/2583/hassaku-hentai-model',
        name: 'Hassaku',
        tags: ['anime', 'porn', 'base model', 'nudity', 'hentai'],
      },
      {
        civitai_model_id: 12606,
        cover_img:
          'https://illustration-generated.s3.us-west-1.amazonaws.com/meinahentai_v4_cover.png',
        id: 'RR6lMmw',
        link: 'https://civitai.com/models/12606/meinahentai',
        name: 'MeinaHentai',
        tags: [
          'anime',
          'girl',
          'sexy',
          'inpainting',
          'base model',
          'naked',
          'nudes',
          'sex',
          'breasts',
          'erotic pose',
          'girls',
          'hentai',
        ],
      },
      {
        civitai_model_id: 2220,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/5da872a2-6a67-4c6b-88c5-c468f2fffa10/width=450',
        id: '1kaWBJZ',
        link: 'https://civitai.com/models/2220/babes',
        name: 'Babes 2.0',
        tags: [
          'animals',
          'subject',
          'midjourney',
          'bimbo',
          'sexy',
          'female',
          'babes',
          'base model',
          'portrait',
          'graphic design',
          'woman',
          'illustration',
          'cars',
          'fantasy',
          'girls',
          'male',
          'portraits',
          'style art',
          'cartoonish',
          'carton',
        ],
      },
      {
        civitai_model_id: 36520,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/f7ded602-a8cc-4b27-9c1f-8a8c403d1455/width=450/1.jpeg',
        id: 'DY5rYnx',
        link: 'https://civitai.com/models/36520/ghostmix',
        name: 'GhostMix',
        tags: [
          'anime',
          'photorealistic',
          'female',
          'base model',
          'art style',
          'game character',
          'girls',
          'portraits',
          'realistic',
        ],
      },
      {
        civitai_model_id: 25494,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ca9fcb9f-d272-48ca-a306-1e80b2c14451/width=450',
        id: 'vlDnKP6',
        link: 'https://civitai.com/models/25494/brabeautiful-realistic-asians-v5',
        name: 'Beautiful Realistic Asians',
        tags: ['base model', 'photo', 'japanese', 'realistic', 'women'],
      },
      {
        civitai_model_id: 43331,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/39f18eb5-9a00-43a7-125d-9e883c62cb00/width=450/00005-4029347388.jpeg',
        id: 'yBG2r9O',
        link: 'https://civitai.com/models/43331/majicmix-realistic',
        name: 'majicMIX realistic',
        tags: ['base model', 'realistic'],
      },
      {
        civitai_model_id: 8281,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/44161e2e-c69a-4452-b237-3c10fb111198/width=450',
        id: 'MRmvdVG',
        link: 'https://civitai.com/models/8281/perfect-world',
        name: 'Perfect World',
        tags: [
          'girl',
          '3d',
          'sexy',
          'porn',
          'mix',
          'fantasy art',
          'style',
          'ulzzang',
          'woman',
          'breasts',
          'artstyle',
          'fantasy',
          'girls',
          'hentai',
          'semi-realistic',
        ],
      },
      {
        civitai_model_id: 62778,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a71a026b-aa58-4049-b73e-ba98069d4cb9/width=450/00013-3138559612.jpeg',
        id: 'MRm5kNX',
        link: 'https://civitai.com/models/62778/majicmix-sombre',
        name: 'majicMIX sombre',
        tags: ['base model', 'realistic'],
      },
      {
        civitai_model_id: 81458,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/9b6bd78d-27df-42f1-aa74-d9692f3940f6/width=450',
        id: 'mGYMaD5',
        link: 'https://civitai.com/models/81458/absolutereality',
        name: 'AbsoluteReality',
        tags: [
          'landscapes',
          'photorealistic',
          'base model',
          'portrait',
          'hyperrealistic character portraits',
          'photography',
          'realistic',
        ],
      },
      {
        civitai_model_id: 79754,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/6b1e31ac-3ec0-46ee-a31e-34341e051849/width=450',
        id: 'eLy25wO',
        link: 'https://civitai.com/models/79754/reliberate',
        name: 'Reliberate',
        tags: ['character', 'realism', 'photo'],
      },
      {
        civitai_model_id: 28059,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c50e821a-c478-4435-b917-b7bceddf8dc7/width=450',
        id: 'GbEkeEP',
        link: 'https://civitai.com/models/28059/icbinp-i-cant-believe-its-not-photography',
        name: 'ICBINP - "I Can\'t Believe It\'s Not Photography"',
        tags: [
          'person',
          'realism',
          'base model',
          'portrait',
          'photo',
          'hyperrealistic character portraits',
          'photography',
        ],
      },
      {
        civitai_model_id: 18798,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e74e3e02-cb0f-4dd5-b997-05d5f4b629ba/width=450/00094.jpeg',
        id: 'PREaKGN',
        link: 'https://civitai.com/models/18798/meinaunreal',
        name: 'MeinaUnreal',
        tags: [
          'anime',
          'girl',
          'sexy',
          'female',
          'inpainting',
          'highly detailed',
          'base model',
          'woman',
          'illustration',
          'fantasy',
          'portraits',
          'semi-realistic',
        ],
      },
      {
        civitai_model_id: 25694,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c0fdc100-4ba7-4876-8e2e-603f1e90d787/width=450',
        id: 'woojZkD',
        link: 'https://civitai.com/models/25694/epicrealism',
        name: 'epiCRealism',
        tags: [
          'photorealistic',
          'female',
          'analog',
          'realism',
          'base model',
          'portrait',
          'raw photo',
          'woman',
          'photography',
          'photorealism',
          'realistic',
          'photoshoot',
          'natural colors',
        ],
      },
      {
        civitai_model_id: 47274,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a0ce8d0a-cd18-450c-8dff-0e016aa29357/width=450',
        id: 'Y99mNKb',
        link: 'https://civitai.com/models/47274/xxmix9realistic',
        name: 'XXMix_9realistic',
        tags: [
          'photorealistic',
          'sexy',
          'female',
          'style',
          'woman',
          'girls',
          'realistic',
        ],
      },
      {
        civitai_model_id: 15003,
        cover_img:
          'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/30cd4bac-74e9-4ac1-8b50-12110132e617/width=450/Cyber3.21.jpeg',
        id: 'd55J1xB',
        link: 'https://civitai.com/models/15003/cyberrealistic',
        name: 'CyberRealistic',
        tags: [
          'girl',
          'photorealistic',
          'female',
          'highly detailed',
          'base model',
          'beautiful',
          'male',
          'photorealism',
          'realistic',
        ],
      },
      {
        cover_img:
          'https://replicate.delivery/pbxt/vvBlyDVF56LaIpRRFcNaZlSsMFPf6SxiaDEOeVzovlXRHgWRA/out-1.png',
        id: 'wozEgKm',
        link: '',
        name: 'Stable Diffusion XL',
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
      let avatar = `https://static.xutongbao.top/ai/sinkin/models/${num}_${item.id}.png`
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
    selectModelHandleModalVisibleForSinkin: handleModalVisible,
    selectModelGetDomForSinkin: getDom,
  }
}
