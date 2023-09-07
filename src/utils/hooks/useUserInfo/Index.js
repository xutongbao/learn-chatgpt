import React from 'react'
import { Image, Modal, Descriptions, Skeleton } from 'antd'
import useList from './useList'
import { Icon, SinglePageHeader } from '../../../components/light'
import moment from 'moment'
import './index.css'

export default function Index(props) {
  const {
    isModalVisible,
    userInfo,
    item,
    isLoading,
    setIsModalVisible,
    handleAvatarClick,
    handleSendMessage,
    showModel,
  } = useList(props)

  const getPayStatusDom = (text) => {
    let hook = {
      1: {
        title: '未付费',
        className: 'grey',
      },
      2: {
        title: '已付费',
        className: 'green',
      },
    }
    return (
      <span className={`m-tag-status ${hook[text] && hook[text].className}`}>
        {hook[text] && hook[text].title}
      </span>
    )
  }

  const getOnlineStatusDom = (text) => {
    let hook = {
      0: {
        title: '离线',
        className: 'grey',
      },
      1: {
        title: '在线',
        className: 'green',
      },
    }
    return (
      <span className={`m-tag-status ${hook[text] && hook[text].className}`}>
        {hook[text] && hook[text].title}
      </span>
    )
  }

  const getVipStatusDom = (userInfo) => {
    if (userInfo.isVipStatus) {
      return (
        <span className={`m-tag-status green`}>
          {`剩余${userInfo.remainDay}天`}
        </span>
      )
    } else {
      return <span className={`m-tag-status grey`}>{`已过期`}</span>
    }
  }

  const getDom = () => {
    return (
      <>
        <Modal
          title=""
          open={isModalVisible}
          closeIcon={false}
          footer={null}
          width={800}
          className="m-modal-full-screen"
          forceRender
        >
          <div className="m-hooks-userinfo-wrap-box">
            <div className="m-hooks-userinfo-wrap">
              <div className="m-hooks-userinfo-main">
                <SinglePageHeader
                  goBackPath="/ai/index/userlist"
                  onClick={() => setIsModalVisible(false)}
                  isBackTextVisible={false}
                  title="用户信息"
                ></SinglePageHeader>
                <div className="m-hooks-userinfo-wrap">
                  {isLoading ? (
                    <Skeleton
                      avatar
                      paragraph={{
                        rows: 3,
                      }}
                      active
                      className="m-h5-lesson-play-skeleton"
                    />
                  ) : (
                    <div className="m-hooks-userinfo-header-wrap">
                      <div className="m-hooks-userinfo-header">
                        {userInfo.avatarCdn ? (
                          <div onClick={handleAvatarClick}>
                            <Image
                              src={userInfo.avatarCdn}
                              className="m-hooks-userinfo-header-img"
                              alt={'图片'}
                            ></Image>
                          </div>
                        ) : (
                          <span className="m-hooks-userinfo-header-img"></span>
                        )}

                        <div className="m-hooks-userinfo-header-info">
                          <div className="m-hooks-userinfo-header-info-row1">
                            <span className="m-hooks-userinfo-header-username m-ellipsis">
                              {userInfo.nickname}
                            </span>
                            {userInfo.isVipStatus ? (
                              <Icon
                                name="vip"
                                className="m-hooks-userinfo-header-vip"
                                title="会员"
                              ></Icon>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="m-hooks-userinfo-desc-wrap">
                        <Descriptions
                          title={null}
                          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                        >
                          {userInfo?.isOnline ? (
                            <Descriptions.Item label="在线状态" span={1}>
                              {getOnlineStatusDom(userInfo?.isOnline)}
                            </Descriptions.Item>
                          ) : null}
                          {userInfo?.payStatus ? (
                            <Descriptions.Item label="是否付费" span={1}>
                              {getPayStatusDom(userInfo?.payStatus)}
                            </Descriptions.Item>
                          ) : null}
                          {typeof userInfo?.isVipStatus !== 'undefined' ? (
                            <Descriptions.Item label="会员状态" span={1}>
                              {getVipStatusDom(userInfo)}
                            </Descriptions.Item>
                          ) : null}
                          {item?.info?.platformos ? (
                            <Descriptions.Item label="消息来至" span={1}>
                              {`${item?.info.platformos} v${item?.info.version}`}
                            </Descriptions.Item>
                          ) : null}
                          <Descriptions.Item label="注册时间" span={1}>
                            {moment(userInfo.createTime - 0).format(
                              'MM-DD HH:mm:ss'
                            )}
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                    </div>
                  )}

                  <div
                    className="m-hooks-userinfo-btn-wrap"
                    onClick={() => handleSendMessage()}
                  >
                    <Icon
                      name="chat"
                      className="m-hooks-userinfo-btn-icon"
                    ></Icon>
                    发消息
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    )
  }

  return {
    userInfoShowModel: showModel,
    userInfoGetDom: getDom,
  }
}
