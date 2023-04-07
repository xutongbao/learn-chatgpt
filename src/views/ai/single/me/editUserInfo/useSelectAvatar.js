import { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { Loading } from '../../../../../components/light'

export default function useSelectAvatar(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  // eslint-disable-next-line
  const [initValues, setInitValues] = useState({})
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line
  const [type, setType] = useState('add')
  const [avatarList, setAvatarList] = useState([])

  const {
    // eslint-disable-next-line
    location: { search },
    handleSelectAvatar,
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
  const handleModalVisible = ({ type, record }) => {
    setIsModalVisible(true)
  }

  const handleSelect = (item) => {
    handleSelectAvatar(item)
    setIsModalVisible(false)
  }

  //Dom
  const getDom = () => {
    return (
      <>
        <Modal
          title="选择图片"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          forceRender
        >
          <div className="m-ai-edit-userinfo-select-avatar-wrap">
            {avatarList.map((item) => (
              <div
                className="m-ai-edit-userinfo-select-avatar-img-wrap"
                key={item.avatar}
              >
                <img
                  src={item.avatar}
                  className="m-ai-edit-userinfo-select-avatar-img"
                  onClick={() => handleSelect(item)}
                  alt="头像"
                ></img>
              </div>
            ))}
          </div>
        </Modal>
        <Loading isLazyLoading={isLoading}></Loading>
      </>
    )
  }

  useEffect(() => {
    let avatarList = [
      {
        id: '001',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/001-avatar.jpg',
      },
      {
        id: '002',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/002-avatar.jpg',
      },
      {
        id: '003',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/003-avatar.jpg',
      },
      {
        id: '004',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/004-avatar.jpg',
      },
      {
        id: '005',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/005-avatar.jpg',
      },
      {
        id: '006',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/006-avatar.jpg',
      },
      {
        id: '007',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/007-avatar.jpg',
      },
      {
        id: '008',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/008-avatar.jpg',
      },
      {
        id: '009',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/009-avatar.jpg',
      },
      {
        id: '010',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/010-avatar.jpg',
      },
      {
        id: '011',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/011-avatar.jpg',
      },
      {
        id: '012',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/012-avatar.jpg',
      },
      {
        id: '013',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/013-avatar.jpg',
      },
      {
        id: '014',
        avatar: 'http://static.xutongbao.top/img/avatarSelect/014-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/015-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/016-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/017-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/018-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/019-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/020-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/021-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/022-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/023-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/024-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/025-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/026-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/027-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/028-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/029-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/030-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/031-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/032-avatar.jpg',
      },
      {
        avatar:
          'http://static.xutongbao.top/img/avatarSelect/033-avatar.jpg?time=20230403',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/034-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/035-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/036-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/037-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/038-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/039-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/040-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/041-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/042-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/043-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/044-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/045-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/046-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/047-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/048-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/049-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/050-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/051-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/052-avatar.jpg',
      },
      {
        avatar: 'http://static.xutongbao.top/img/avatarSelect/053-avatar.jpg',
      },
    ]
    avatarList = avatarList.sort((a, b) => {
      return Math.random() > 0.5 ? 1 : -1
    })
    setAvatarList(avatarList)
  }, [])

  return {
    selectAvatarHandleModalVisible: handleModalVisible,
    selectAvatarGetDom: getDom,
  }
}
