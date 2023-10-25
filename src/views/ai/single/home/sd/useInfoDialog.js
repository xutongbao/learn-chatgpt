import React, { useState, useEffect, useReducer } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Space,
} from 'antd'
import { checkOnlyEnglish, checkIncrementOf } from '../../../../../utils/tools'
import { UploadImgToCNDMobile, Picture } from '../../../../../components/light'
import useSelectModel from './useSelectModel'
import useSelectModelForSinkin from './useSelectModelForSinkin'
import useSelectLoraForSinkin from './useSelectLoraForSinkin'

import useSelectLora from './useSelectLora'
import usePrompt from './usePrompt'

import { handleGetData } from './config'

const { Option } = Select

export default function useInfoDialog(props) {
  const [type, setType] = useState()
  // eslint-disable-next-line
  const [modalTitle, setModalTitle] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
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
  // eslint-disable-next-line
  const [apiType, setApiType] = useState(
    sdHistoryParamsObj.apiType ? sdHistoryParamsObj.apiType : '1'
  )
  const [sdType, setSdType] = useState(sdHistoryParamsObj.sdType)
  const [version, setVersion] = useState(sdHistoryParamsObj.version)

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

  const { selectModelHandleModalVisible, selectModelGetDom } = useSelectModel({
    ...props,
    handleSelectModel,
  })

  const { selectModelHandleModalVisibleForSinkin, selectModelGetDomForSinkin } =
    useSelectModelForSinkin({
      ...props,
      handleSelectModel,
    })

  const { selectLoraHandleModalVisible, selectLoraGetDom } = useSelectLora({
    ...props,
    handleSelectLora,
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

  //显示添加对话框
  const handleDialogShow = ({ item, type = 'add', message } = {}) => {
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
        ...item?.info,
        prompt: message,
      })
    } else if (type === 'check') {
      let message
      if (item.info.originalPrompt) {
        message = item.info.originalPrompt
      } else {
        message = item.info.prompt
      }
      setInitValues({
        ...addInitValues,
        ...sdHistoryParamsObj,
        ...item?.info,
        prompt: message,
        seed: item?.info?.response?.meta?.seed,
      })
    }
    setModalTitle('更多基础绘画配置')

    if (item?.info) {
      setSdType(item.info.sdType)
      setVersion(item.info.version)
    } else if (sdHistoryParamsObj) {
      setSdType(sdHistoryParamsObj.sdType)
      setVersion(sdHistoryParamsObj.version)
    }
    setIsModalVisible(true)
    setTimeout(() => {
      forceUpdate()
    }, 0)
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
      message.success('保存成功')
      let sdHistoryParamsSinkin = { ...addInitValues, ...values }
      localStorage.setItem(
        'sdHistoryParamsSinkin',
        JSON.stringify(sdHistoryParamsSinkin)
      )
      props.handleInputChangeByInfoDialog(values.prompt)
      setIsModalVisible(false)
    } else if (type === 'edit') {
    }
  }

  //校验失败
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  // const handleSdApiType = (value) => {
  //   setApiType(value)
  // }

  const handleChangeVersion = (value) => {
    setVersion(value)
  }

  const handleChangeSdType = (value) => {
    setSdType(value)
  }

  // 每次打开对话框时要重置一下表单，防止表单记忆上一次的值，添加、编辑、查看共用一个表单
  useEffect(() => {
    form.resetFields()
  }, [isModalVisible, form])

  //Dom
  const getDom = () => {
    return (
      <>
        <Modal
          title={modalTitle}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="m-modal-full-screen m-sd-chat-modal"
          forceRender
        >
          <Form
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ ...initValues }}
            scrollToFirstError={true}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
          >
            <div
              id="m-modal-form-info-sd"
              className="m-modal-form-info m-sd-chat-modal-form-info"
            >
              {/* <Form.Item
                label="API平台"
                name="apiType"
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
                  onChange={handleSdApiType}
                  // disabled
                >
                  <Option value="1">SinkIn</Option>
                  <Option value="2">stablediffusionapi</Option>
                </Select>
              </Form.Item> */}
              {apiType === '1' ? (
                <>
                  <Form.Item
                    label="提示词"
                    tooltip="(prompt)Text prompt with description of the things you want in the image to be generated."
                  >
                    <Form.Item name="prompt" noStyle>
                      <Input.TextArea
                        rows={5}
                        maxLength={1000}
                        showCount
                        allowClear
                      />
                    </Form.Item>
                    <div>
                      <div className="m-sd-chat-modal-btn-wrap">
                        <Space>
                          <Button
                            type="primary"
                            className="m-space"
                            onClick={() => promptHandleModalVisible({ form })}
                          >
                            词典
                          </Button>
                        </Space>
                      </div>
                    </div>
                  </Form.Item>
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
                  >
                    <Form.Item name="model_id" noStyle>
                      <Input />
                    </Form.Item>
                    <div>
                      <div className="m-sd-chat-modal-btn-wrap">
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
                      <div className="m-sd-chat-modal-btn-wrap">
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
                    label="lora权重"
                    name="lora_scale"
                    tooltip="lora权重"
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
                      <Option value="DPMSolverMultistep">
                        DPMSolverMultistep
                      </Option>
                      <Option value="K_EULER_ANCESTRAL">
                        K_EULER_ANCESTRAL
                      </Option>
                      <Option value="DDIM">DDIM</Option>
                      <Option value="K_EULER">K_EULER</Option>
                      <Option value="PNDM">PNDM</Option>
                      <Option value="KLMS">KLMS</Option>
                    </Select>
                  </Form.Item>
                </>
              ) : null}
              {apiType === '2' ? (
                <>
                  <Form.Item
                    label="方式"
                    name="sdType"
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
                      onChange={handleChangeSdType}
                    >
                      <Option value="text2img">文生图</Option>
                      <Option value="img2img">图生图</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="版本"
                    name="version"
                    tooltip="版本"
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
                      onChange={handleChangeVersion}
                    >
                      <Option value="v3">V3</Option>
                      <Option value="v4">V4</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="提示词"
                    tooltip="(prompt)Text prompt with description of the things you want in the image to be generated."
                  >
                    <Form.Item name="prompt" noStyle>
                      <Input.TextArea
                        rows={5}
                        maxLength={1000}
                        showCount
                        allowClear
                      />
                    </Form.Item>
                    <div>
                      <div className="m-sd-chat-modal-btn-wrap">
                        <Space>
                          <Button
                            type="primary"
                            className="m-space"
                            onClick={() => promptHandleModalVisible({ form })}
                          >
                            词典
                          </Button>
                        </Space>
                      </div>
                    </div>
                  </Form.Item>
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
                  {sdType === 'img2img' ? (
                    <>
                      <Form.Item
                        label="原始图片"
                        name="init_image"
                        tooltip="(init_image)Link to the Initial Image"
                        rules={[
                          {
                            required: true,
                            message: '请上传图片！',
                          },
                        ]}
                      >
                        <UploadImgToCNDMobile
                          type={'edit'}
                          imgDir={`ai/sdInitImage`}
                          filePrefix={`${Date.now()}`}
                          imgUrlCnd={initValues.init_image}
                          uploadType={2}
                          isSd={true}
                        ></UploadImgToCNDMobile>
                      </Form.Item>
                      <Form.Item
                        label="重绘幅度"
                        name="strength"
                        tooltip="(strength)Prompt strength when using init image. 1.0 corresponds to full destruction of information in the init image."
                        rules={[
                          {
                            required: true,
                            message: '请输入！',
                          },
                        ]}
                      >
                        <InputNumber
                          min={0.01}
                          max={1.0}
                          step={0.01}
                          precision={2}
                        />
                      </Form.Item>
                    </>
                  ) : null}
                  {version === 'v4' ? (
                    <>
                      <Form.Item
                        label="model_id"
                        tooltip="(model_id)The id of the model."
                      >
                        <Form.Item name="model_id" noStyle>
                          <Input />
                        </Form.Item>
                        <div>
                          <div className="m-sd-chat-modal-btn-wrap">
                            <Space>
                              <Button
                                type="primary"
                                className="m-space"
                                onClick={() =>
                                  selectModelHandleModalVisible({ form })
                                }
                              >
                                选择
                              </Button>
                            </Space>
                          </div>
                          参考链接：
                          {/* eslint-disable-next-line */}
                          <a
                            href="https://stablediffusionapi.com/models/section/most-used"
                            target="_blank"
                          >
                            https://stablediffusionapi.com/models/section/most-used
                          </a>
                        </div>
                      </Form.Item>
                      <Form.Item label="lora_model" tooltip="(lora_model)">
                        <Form.Item name="lora_model" noStyle>
                          <Input.TextArea rows={5} />
                        </Form.Item>
                        <div>
                          <div className="m-sd-chat-modal-btn-wrap">
                            <Space>
                              <Button
                                type="primary"
                                className="m-space"
                                onClick={() =>
                                  selectLoraHandleModalVisible({ form })
                                }
                              >
                                选择
                              </Button>
                            </Space>
                          </div>
                          参考链接：
                          {/* eslint-disable-next-line */}
                          <a
                            href="https://stablediffusionapi.com/models/section/most-used"
                            target="_blank"
                          >
                            https://stablediffusionapi.com/models/section/most-used
                          </a>
                        </div>
                      </Form.Item>
                    </>
                  ) : null}
                  <Form.Item
                    label="宽度"
                    name="width"
                    tooltip="(width)最大值：1024"
                    rules={[
                      {
                        required: true,
                        message: '请输入！',
                      },
                    ]}
                  >
                    <InputNumber min={100} max={1024} step={1} precision={0} />
                  </Form.Item>
                  <Form.Item
                    label="高度"
                    name="height"
                    tooltip="(height)最大值：1024"
                    rules={[
                      {
                        required: true,
                        message: '请输入！',
                      },
                    ]}
                  >
                    <InputNumber min={100} max={1024} step={1} precision={0} />
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
                    <InputNumber min={20} max={51} step={1} precision={0} />
                  </Form.Item>
                  <Form.Item
                    label="安全检查"
                    name="safety_checker"
                    tooltip="(safety_checker)A checker for NSFW images. If such an image is detected, it will be replaced by a blank image."
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
                      <Option value="yes">开</Option>
                      <Option value="no">关</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="增强提示"
                    name="enhance_prompt"
                    tooltip="(enhance_prompt)Enhance prompts for better results; default: yes, options: yes/no."
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
                      <Option value="yes">开</Option>
                      <Option value="no">关</Option>
                    </Select>
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
                </>
              ) : null}
            </div>
            <Form.Item
              wrapperCol={{ span: 24 }}
              className="m-modal-footer m-sd-chat-modal-footer"
            >
              {(type === 'add' || type === 'edit') && (
                <>
                  <Button type="primary" htmlType="submit" className="m-space">
                    确定
                  </Button>
                  <Button
                    className="m-space"
                    onClick={() => {
                      form.resetFields()
                    }}
                  >
                    重置
                  </Button>
                </>
              )}
              <Button
                className="m-space"
                onClick={() => setIsModalVisible(false)}
              >
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {promptGetDom('2')}
        {selectModelGetDom()}
        {selectLoraGetDom()}
        {selectModelGetDomForSinkin()}
        {selectLoraGetDomForSinkin()}
      </>
    )
  }

  return {
    dialogInfoShow: handleDialogShow,
    dialogInfoDom: getDom,
  }
}
