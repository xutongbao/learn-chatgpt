import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Switch,
  Modal,
} from 'antd'
import { checkOnlyEnglish, checkIncrementOf } from '../../../../../utils/tools'
import useSelectModelForSinkin from './useSelectModelForSinkin'
import useSelectLoraForSinkin from './useSelectLoraForSinkin'
import usePrompt from './usePrompt'
import { getRouterSearchObj } from '../../../../../utils/tools'
import { Picture } from '../../../../../components/light'
import { handleGetData } from './config'
import Api from '../../../../../api'

const { confirm } = Modal
const { Option } = Select

export default function useInfoDialog(props) {
  const [type, setType] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})
  let sdHistoryParamsSinkin = localStorage.getItem('sdHistoryParamsSinkin')
  let sdHistoryParamsObj = {}
  try {
    if (sdHistoryParamsSinkin) {
      sdHistoryParamsObj = JSON.parse(sdHistoryParamsSinkin)
    }
  } catch (error) {
    console.log(error)
  }
  const [isShowMoreSetting, setIsShowMoreSetting] = useState(
    sdHistoryParamsObj.moreSetting
  )
  //获取路由参数
  const routerSearchObj = getRouterSearchObj(props)

  const handleSelectPrompt = (promptArr) => {
    let message = form.getFieldValue('prompt')
    let tempMessage = []
    if (message.trim() !== '') {
      let messageNew = message.replace(/，/g, ',')
      tempMessage = [...messageNew.split(','), ...promptArr]
    } else {
      tempMessage = [...promptArr]
    }

    tempMessage = new Set(tempMessage)
    tempMessage = Array.from(tempMessage).join(',')
    form.setFieldsValue({
      prompt: tempMessage,
    })
  }

  const handleSelectModel = (item) => {
    form.setFieldsValue({
      model_id: item.model_id,
      modelName: item.name,
      modelCoverImg: item.avatar,
    })
  }

  const handleSelectLora = (item) => {
    form.setFieldsValue({
      lora_model: item.model_id,
      loraName: item.name,
      loraCoverImg: item.avatar,
    })
  }

  const { promptHandleModalVisible, promptGetDom } = usePrompt({
    ...props,
    handleSelectPrompt: handleSelectPrompt,
  })

  const { selectModelHandleModalVisibleForSinkin, selectModelGetDomForSinkin } =
    useSelectModelForSinkin({
      ...props,
      handleSelectModel,
    })

  const { selectLoraHandleModalVisibleForSinkin, selectLoraGetDomForSinkin } =
    useSelectLoraForSinkin({
      ...props,
      handleSelectModel: handleSelectLora,
    })

  //初始值
  let addInitValues = {}
  if (process.env.REACT_APP_MODE === 'dev') {
    addInitValues = {
      prompt: '',
      moreSetting: false,
      apiType: '1',
      sdType: 'text2img',
      version: 'v3',
      negative_prompt:
        'ng_deepnegative_v1_75t, (badhandv4:1.2), (worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, ((monochrome)), ((grayscale)) watermark, moles',
      use_default_neg: 'false',
      model_id: 'yBG2r9O',
      modelName: 'majicMIX realistic',
      modelCoverImg:
        'https://static.xutongbao.top/ai/sinkin/models/029_yBG2r9O.png',
      lora_model: '',
      loraName: '',
      loraCoverImg: '',
      lora_scale: 0.75,
      width: 512,
      height: 768,
      samples: 1,
      num_inference_steps: 30,
      safety_checker: 'no',
      enhance_prompt: 'yes',
      guidance_scale: 5,
      strength: 0.3,
      scheduler: 'K_EULER_ANCESTRAL',
    }
  } else {
    addInitValues = {
      prompt: '',
      moreSetting: false,
      apiType: '1',
      sdType: 'text2img',
      version: 'v3',
      negative_prompt:
        'ng_deepnegative_v1_75t, (badhandv4:1.2), (worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, ((monochrome)), ((grayscale)) watermark, moles',
      use_default_neg: 'false',
      model_id: 'yBG2r9O',
      modelName: 'majicMIX realistic',
      modelCoverImg:
        'https://static.xutongbao.top/ai/sinkin/models/029_yBG2r9O.png',
      lora_model: '',
      loraName: '',
      loraCoverImg: '',
      lora_scale: 0.75,
      width: 512,
      height: 768,
      samples: 1,
      num_inference_steps: 30,
      safety_checker: 'no',
      enhance_prompt: 'yes',
      guidance_scale: 5,
      strength: 0.3,
      scheduler: 'K_EULER_ANCESTRAL',
    }
  }

  const handleGetConfig = () => {
    Api.h5.configWelcome().then((res) => {
      if (res.code === 200) {
        let models = res.data.config.models
        let resultIndex = models.findIndex(
          (item) => item.model_id === routerSearchObj.modelId
        )
        if (resultIndex >= 0) {
          form.setFieldsValue({
            modelName: models[resultIndex].name,
            modelCoverImg: models[resultIndex].avatar,
          })
        }
      }
    })
  }

  //显示添加对话框
  const handleDialogShow = ({ type = 'add' } = {}) => {
    let sdHistoryParamsSinkin = localStorage.getItem('sdHistoryParamsSinkin')
    let sdHistoryParamsObj = {}
    try {
      if (sdHistoryParamsSinkin) {
        sdHistoryParamsObj = JSON.parse(sdHistoryParamsSinkin)
      }
    } catch (error) {
      console.log(error)
    }
    delete sdHistoryParamsObj.prompt
    setType(type)
    if (type === 'add') {
      setInitValues({
        ...addInitValues,
        ...sdHistoryParamsObj,
        model_id: routerSearchObj.modelId,
      })
    }
    setIsModalVisible(true)
    handleGetConfig()
  }

  //添加或编辑
  const handleFinish = (values) => {
    handleGetData()
    console.log('Success:', values)
    values = {
      ...values,
      width: values.width + '',
      height: values.height + '',
      samples: values.samples + '',
      num_inference_steps: values.num_inference_steps + '',
    }
    if (type === 'add') {
      let sdHistoryParamsSinkin = { ...addInitValues, ...values }
      localStorage.setItem(
        'sdHistoryParamsSinkin',
        JSON.stringify(sdHistoryParamsSinkin)
      )
      let token = localStorage.getItem('token')
      if (token) {
        const callback = ({ isNeedClear = true } = {}) => {
          if (isNeedClear === true) {
            form.setFieldsValue({
              prompt: '',
            })
          }
        }
        props.handleSend(sdHistoryParamsSinkin, callback)
      } else {
        props.history.push('/ai/login')
      }
      //setIsModalVisible(false)
    } else if (type === 'edit') {
    }
  }

  //校验失败
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleTry = () => {
    let hooks = [
      {
        id: '1',
        prompt: '1girl,sweater,white background,',
      },
      {
        id: '2',
        prompt: '1girl,hair with bangs,black long dress,(yellow background),',
      },
      {
        id: '3',
        prompt: '1girl,face,white background,',
      },
      {
        id: '4',
        prompt: '1girl,face,Undercut Fade,red hair,white background,',
      },
      {
        id: '5',
        prompt: '1girl,face,curly hair,red hair,white background,',
      },
      {
        id: '6',
        prompt: '1boy,handsome male,face,beard,white background,',
      },
      {
        id: '7',
        prompt:
          '1 chinese gril with headphones, natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, ((((cinematic look)))), soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded',
      },
      {
        id: '8',
        prompt: '1 chinese gril with headphones',
      },
      {
        id: '9',
        prompt:
          '1girl, Chinese Style,animal ears, bangs, black choker, black hair, black eyes, blurry, cat ears, choker, closed mouth, collarbone, eyelashes, lips, long hair, looking at viewer, portrait, solo,(shiny skin),realistic,fashi-girl,mature female',
      },
    ]
    let prompt = form.getFieldValue('prompt')
    let hooksTemp = hooks.filter(
      (item) => prompt.includes(item.prompt) === false
    )
    hooksTemp.sort(() => {
      return Math.random() > 0.5 ? -1 : 1
    })
    console.log(hooksTemp)
    if (hooksTemp.length > 0) {
      form.setFieldsValue({
        prompt: hooksTemp[0].prompt,
      })
    }
  }

  const handleMoreSetting = (value) => {
    setIsShowMoreSetting(value)
  }

  const handleDrawTheSameStyle = (item) => {
    confirm({
      title: `确认要【画同款】图片吗？`,
      onOk() {
        let sdHistoryParamsSinkin = localStorage.getItem(
          'sdHistoryParamsSinkin'
        )
        let sdHistoryParamsObj = {}
        try {
          if (sdHistoryParamsSinkin) {
            sdHistoryParamsObj = JSON.parse(sdHistoryParamsSinkin)
          }
        } catch (error) {
          console.log(error)
        }
        delete sdHistoryParamsObj.prompt

        const { prompt, negativePrompt, Size, steps, sampler } = item.meta

        let width = 512
        let height = 768
        if (Size) {
          let sizeArr = Size.split('x')
          if (Array.isArray(sizeArr) && sizeArr.length === 2) {
            let tempWidth = sizeArr[0] - 0
            let tempHeight = sizeArr[1] - 0
            if (typeof tempWidth === 'number') {
              width = tempWidth
            }
            if (typeof tempHeight === 'number') {
              height = tempHeight
            }
          }
        }

        let hooks = [
          'DPMSolverMultistep',
          'K_EULER_ANCESTRAL',
          'DDIM',
          'K_EULER',
          'PNDM',
          'KLMS',
        ]
        let scheduler = 'K_EULER_ANCESTRAL'
        if (hooks.includes(sampler)) {
          scheduler = sampler
        }
        console.log(666, form.getFieldsValue())
        setInitValues({
          ...sdHistoryParamsObj,
          ...addInitValues,
          ...form.getFieldsValue(),
          model_id: routerSearchObj.modelId,
          prompt,
          negative_prompt: negativePrompt,
          width,
          height,
          num_inference_steps: steps,
          scheduler,
        })
        setIsModalVisible(!isModalVisible)
      },
    })
  }

  // 每次打开对话框时要重置一下表单，防止表单记忆上一次的值，添加、编辑、查看共用一个表单
  useEffect(() => {
    form.resetFields()
  }, [isModalVisible, form])

  useEffect(() => {
    handleDialogShow()
    // eslint-disable-next-line
  }, [])

  //Dom
  const getDom = () => {
    return (
      <>
        <Form
          form={form}
          labelCol={{ span: window.innerWidth > 768 ? 4 : 8 }}
          wrapperCol={{ span: window.innerWidth > 768 ? 20 : 16 }}
          initialValues={{ ...initValues }}
          scrollToFirstError={true}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <div
            id="m-modal-form-info-sd"
            className="m-modal-form-info m-sd-simple-modal-form-info"
          >
            <Form.Item
              label="提示词"
              tooltip="(prompt)Text prompt with description of the things you want in the image to be generated."
              className="m-required"
            >
              <Form.Item
                name="prompt"
                noStyle
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                ]}
              >
                <Input.TextArea
                  rows={5}
                  maxLength={1000}
                  showCount
                  allowClear
                />
              </Form.Item>
              <div>
                <div className="m-sd-simple-modal-btn-wrap">
                  <Space>
                    <Button
                      type="primary"
                      className="m-space"
                      onClick={() => promptHandleModalVisible({ form })}
                    >
                      关键词词典
                    </Button>
                    <Button
                      type="primary"
                      className="m-space"
                      onClick={() => handleTry()}
                    >
                      试试关键词
                    </Button>
                  </Space>
                </div>
              </div>
            </Form.Item>
            <Form.Item
              label="更多设置"
              name="moreSetting"
              valuePropName="checked"
            >
              <Switch onChange={handleMoreSetting} />
            </Form.Item>
            <div
              className={`m-sd-simple-more-setting-info ${
                isShowMoreSetting ? 'active' : ''
              }`}
            >
              <Form.Item
                label="反向提示词"
                name="negative_prompt"
                tooltip="(negative_prompt)Items you don't want in the image."
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                  {
                    validator: (e, value) => checkOnlyEnglish(e, value),
                  },
                ]}
              >
                <Input.TextArea
                  rows={5}
                  maxLength={1000}
                  showCount
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label="使用默认反向提示词"
                name="use_default_neg"
                rules={[
                  {
                    required: true,
                    message: '请选择！',
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  getPopupContainer={() =>
                    document.getElementById('m-modal-form-info-sd')
                  }
                >
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="大模型ID"
                tooltip="(model_id)The id of the model."
                className="m-required"
              >
                <Form.Item
                  name="model_id"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: '请输入！',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <div>
                  <div className="m-sd-simple-modal-btn-wrap">
                    <Space>
                      <Button
                        type="primary"
                        className="m-space"
                        onClick={() =>
                          selectModelHandleModalVisibleForSinkin({ form })
                        }
                      >
                        选择
                      </Button>
                    </Space>
                  </div>
                  参考链接：
                  {/* eslint-disable-next-line */}
                  <a href="https://sinkin.ai/?models=1" target="_blank">
                    https://sinkin.ai/?models=1
                  </a>
                </div>
              </Form.Item>
              <Form.Item label="大模型名称" name="modelName">
                <Input disabled></Input>
              </Form.Item>
              <Form.Item label="大模型封面" name="modelCoverImg">
                <Picture></Picture>
              </Form.Item>
              <Form.Item label="Lora ID" tooltip="(lora_model)">
                <Form.Item name="lora_model" noStyle>
                  <Input />
                </Form.Item>
                <div>
                  <div className="m-sd-simple-modal-btn-wrap">
                    <Space>
                      <Button
                        type="primary"
                        className="m-space"
                        onClick={() =>
                          selectLoraHandleModalVisibleForSinkin({ form })
                        }
                      >
                        选择
                      </Button>
                    </Space>
                  </div>
                  参考链接：
                  {/* eslint-disable-next-line */}
                  <a href="https://sinkin.ai/?models=1" target="_blank">
                    https://sinkin.ai/?models=1
                  </a>
                </div>
              </Form.Item>
              <Form.Item label="Lora名称" name="loraName">
                <Input disabled></Input>
              </Form.Item>
              <Form.Item label="Lora封面" name="loraCoverImg">
                <Picture></Picture>
              </Form.Item>
              <Form.Item
                label="Lora权重"
                name="lora_scale"
                tooltip="Lora权重"
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                ]}
              >
                <InputNumber min={0.01} max={1} step={0.1} precision={2} />
              </Form.Item>
              <Form.Item
                label="宽度"
                name="width"
                tooltip="(width)最大值：896"
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                  {
                    validator: (e, value) => checkIncrementOf(e, value, 8),
                  },
                ]}
              >
                <InputNumber min={128} max={896} step={1} precision={0} />
              </Form.Item>
              <Form.Item
                label="高度"
                name="height"
                tooltip="(height)最大值：896"
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                  {
                    validator: (e, value) => checkIncrementOf(e, value, 8),
                  },
                ]}
              >
                <InputNumber min={128} max={896} step={1} precision={0} />
              </Form.Item>
              <Form.Item
                label="生成图片数量"
                name="samples"
                tooltip="(samples)Number of images to be returned in response. The maximum value is 4."
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                ]}
              >
                <InputNumber min={1} max={4} step={1} precision={0} />
              </Form.Item>
              <Form.Item
                label="噪声优化的次数"
                name="num_inference_steps"
                tooltip="(num_inference_steps)Number of denoising steps. Available values: 21, 31, 41, 51."
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                ]}
              >
                <InputNumber min={10} max={50} step={1} precision={0} />
              </Form.Item>
              <Form.Item
                label="随机种子"
                name="seed"
                tooltip="(seed)Seed is used to reproduce results, same seed will give you same image in return again. Pass null for a random number."
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="guidance_scale"
                name="guidance_scale"
                tooltip="Scale for classifier-free guidance (minimum: 1; maximum: 20)."
                rules={[
                  {
                    required: true,
                    message: '请输入！',
                  },
                ]}
              >
                <InputNumber min={1} max={20} step={1} precision={1} />
              </Form.Item>
              <Form.Item
                label="scheduler"
                name="scheduler"
                rules={[
                  {
                    required: true,
                    message: '请选择！',
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  allowClear
                  getPopupContainer={() =>
                    document.getElementById('m-modal-form-info-sd')
                  }
                >
                  <Option value="DPMSolverMultistep">DPMSolverMultistep</Option>
                  <Option value="K_EULER_ANCESTRAL">K_EULER_ANCESTRAL</Option>
                  <Option value="DDIM">DDIM</Option>
                  <Option value="K_EULER">K_EULER</Option>
                  <Option value="PNDM">PNDM</Option>
                  <Option value="KLMS">KLMS</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <Form.Item
            wrapperCol={{ span: 24 }}
            className="m-modal-footer m-sd-simple-modal-footer"
          >
            <Button
              type="primary"
              htmlType="submit"
              className="m-space"
              loading={props.isSending}
            >
              提交
            </Button>
            <Button
              className="m-space"
              onClick={() => {
                form.resetFields()
              }}
            >
              重置
            </Button>
          </Form.Item>
        </Form>
        {promptGetDom('2')}
        {selectModelGetDomForSinkin()}
        {selectLoraGetDomForSinkin()}
      </>
    )
  }

  return {
    dialogInfoShow: handleDialogShow,
    dialogInfoDom: getDom,
    dialogInfoDrawTheSameStyle: handleDrawTheSameStyle,
  }
}
