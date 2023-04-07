import React, { useState } from 'react'
import { Popover, Input, Form, Button } from 'antd'
import Icon from './Icon'

export default function EditCell(props) {
  const { children, record, handleEditCell } = props
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)

  const callback = () => {
    setVisible(false)
  }

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    handleEditCell({ record, values, callback })
  }

  //校验失败
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const getContent = () => {
    return (
      <div>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ ...record }}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <div id="m-modal-form-info" className="m-modal-form-info">
            <Form.Item
              label="名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入名称！',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
            className="m-modal-footer"
          >
            <Button type="primary" htmlType="submit" className="m-space">
              <Icon name="submit" className="m-tool-btn-icon"></Icon>
              提交
            </Button>
            <Button
              className="m-space"
              onClick={() => {
                form.resetFields()
              }}
            >
              <Icon name="reset" className="m-tool-btn-icon"></Icon>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  const handleVisibleChange = (visible) => {
    console.log(visible)
    setVisible(visible)
  }

  return (
    <Popover
      placement="top"
      title={'编辑'}
      content={getContent()}
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
      getPopupContainer={() => document.getElementById('m-content-wrap')}
    >
      {children}
    </Popover>
  )
}
