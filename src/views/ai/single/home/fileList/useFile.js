import React, { useState, useEffect } from 'react'
import { Button, Form, Modal } from 'antd'
import { getModalFields } from './config'
import { Icon } from '../../../../../components/light'
import Api from '../../../../../api'
import { uploadGetTokenForH5 } from '../../../../../utils/tools'

export default function useFile(props) {
  const [form] = Form.useForm()
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})
  const [modalTitle, setModalTitle] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [type, setType] = useState('add')

  //初始值
  let addInitValues = {}
  if (process.env.REACT_APP_MODE === 'dev') {
    addInitValues = {
      count: 10,
      codeType: '2',
    }
  } else {
    addInitValues = {
      count: 10,
      codeType: '2',
    }
  }

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    if (type === 'add') {
      Api.h5
        .fileAdd({
          ...values,
        })
        .then((res) => {
          if (res.code === 200) {
            setIsModalVisible(false)
            props.handleSearch({ page: 1, isRefresh: true })
          }
        })
    } else if (type === 'edit') {
      Api.h5.fileEdit({ ...initValues, ...values }).then((res) => {
        if (res.code === 200) {
          setIsModalVisible(false)
          props.handleSearch({ page: 1, isRefresh: true })
        }
      })
    }
  }

  //校验失败
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  //显示添加对话框
  const handleAdd = () => {
    setType('add')
    setInitValues({ ...addInitValues })
    setModalTitle('添加')
    setIsModalVisible(true)
    uploadGetTokenForH5()
  }

  const handleChangeFile = ({ info }) => {
    console.log(info)
    form.setFieldsValue({ name: info.file.name })
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
          forceRender
        >
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 17 }}
            initialValues={{ ...initValues }}
            scrollToFirstError={true}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
          >
            <div id="m-modal-form-info" className="m-modal-form-info">
              {getModalFields({
                type,
                initValues,
                handleChangeFile,
              })}
            </div>
            <Form.Item
              wrapperCol={{ offset: 4, span: 17 }}
              className="m-modal-footer"
            >
              {(type === 'add' || type === 'edit') && (
                <>
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
      </>
    )
  }

  return {
    fileOpenModel: handleAdd,
    fileGetDom: getDom,
  }
}
