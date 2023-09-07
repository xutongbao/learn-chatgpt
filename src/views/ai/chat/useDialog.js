import React, { useState } from 'react'
import { Modal } from 'antd'
import JoinGroup from '../single/me/joinGroup/Index'
import Exchange from '../single/me/exchange/Index'

export default function useDialog(props) {
  const [type, setType] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)

  //显示添加对话框
  const handleDialogShow = ({ type }) => {
    if (type === 'joinGroup') {
      setModalTitle('微信群')
    } else if (type === 'exchange') {
      setModalTitle('兑换')
    }
    setIsModalVisible(true)
    setType(type)
  }

  //Dom
  const getDom = () => {
    return (
      <Modal
        title={modalTitle}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
        forceRender
      >
        {type === 'joinGroup' ? <JoinGroup></JoinGroup> : null}
        {type === 'exchange' ? <Exchange></Exchange> : null}
      </Modal>
    )
  }

  return {
    dialogShow: handleDialogShow,
    dialogDom: getDom,
  }
}
