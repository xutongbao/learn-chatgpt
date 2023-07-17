import { Form, Input } from 'antd'
import { UploadVideoToCND } from '../../../../../components/light'

//添加编辑查看对话框表单字段
const getModalFields = ({ type, initValues, handleChangeFile }) => {
  return (
    <>
      <Form.Item
        label="上传文件"
        name="url"
        rules={[
          {
            required: true,
            message: '请上传文件！',
          },
        ]}
      >
        <UploadVideoToCND
          type={type}
          accept={'*.*'}
          videoDir={`ai/file`}
          imgUrlCnd={initValues.urlCdn}
          filePrefix={''}
          handleChangeFile={handleChangeFile}
        ></UploadVideoToCND>
      </Form.Item>
      <Form.Item
        label="文件名"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入文件名！',
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  )
}

export { getModalFields }
