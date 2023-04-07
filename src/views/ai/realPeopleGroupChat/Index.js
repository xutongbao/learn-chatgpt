import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Input, Button, Dropdown, Popover, Descriptions, Skeleton } from 'antd'
import useList from './useList'
import moment from 'moment'
import { Scrollbar } from 'react-scrollbars-custom'
import { SinglePageHeader, Icon } from '../../../components/light'

import './index.css'

function Index(props) {
  // eslint-disable-next-line
  const {
    dataSource,
    message,
    isSending,
    scrollEl,
    handleSend,
    handleInputChange,
    handleScroll,
    handleAction,
    getMessageToolbar,
  } = useList(props)

  const getItems = () => {
    const items = [
      {
        key: '0',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a
              href={`https://blog.csdn.net/xutongbao/article/details/129851721?spm=1001.2014.3001.5501`}
              target="_blank"
            >
              我的GPT-4 API 接入之旅
            </a>
          </>
        ),
        icon: <Icon name="course" className="m-ai-menu-icon"></Icon>,
      },
      {
        key: '1',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a
              href={`https://blog.csdn.net/xutongbao/article/details/129007691?spm=1001.2014.3001.5501`}
              target="_blank"
            >
              ChatGPT学习心得
            </a>
          </>
        ),
        icon: <Icon name="course" className="m-ai-menu-icon"></Icon>,
      },
      {
        key: 'chrome',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a href={`https://llq.ywswge.cn`} target="_blank">
              下载chrome浏览器（推荐）
            </a>
          </>
        ),
        icon: <Icon name="chrome" className="m-ai-menu-icon"></Icon>,
      },
      {
        key: '3',
        label: '刷新',
        icon: <Icon name="reset" className="m-ai-menu-icon"></Icon>,
        onClick: () => handleAction({ type: 'refresh' }),
      },
    ]
    return items
  }

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

  const getContent = (item) => {
    return (
      <div className="m-ai-group-chat-userinfo-wrap">
        <Descriptions
          title="用户信息"
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          {item?.userInfo?.payStatus ? (
            <Descriptions.Item label="是否付费" span={1}>
              {getPayStatusDom(item?.userInfo?.payStatus)}
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item label="注册时间" span={1}>
            {moment(item.userInfo.createTime - 0).format('MM-DD HH:mm:ss')}
          </Descriptions.Item>
        </Descriptions>
      </div>
    )
  }

  return (
    <div className="m-ai-wrap-box">
      <div className="m-ai-wrap-real-chat">
        <SinglePageHeader
          goBackPath="/ai/index/home/chatList"
          title="真人群聊"
        ></SinglePageHeader>
        <div className="m-ai-main" id="scrollableDiv" onScroll={handleScroll}>
          <div className="m-ai-list">
            <Dropdown
              menu={{ items: getItems() }}
              className="m-ai-dropdown"
              trigger={['click', 'hover']}
            >
              <Icon name="more" className="m-ai-menu-btn"></Icon>
            </Dropdown>
            {dataSource.length > 0 ? (
              <Scrollbar onScroll={handleScroll} ref={scrollEl}>
                {dataSource.map((item, index) => (
                  <div key={index} id={`message-item-${item.uid}`}>
                    <div className="m-ai-user-list-wrap-wrap">
                      <div className="m-ai-user-list-wrap">
                        <Popover
                          placement="rightTop"
                          title={null}
                          content={getContent(item)}
                          trigger="click"
                          getPopupContainer={() =>
                            document.getElementById(`message-item-${item.uid}`)
                          }
                        >
                          <img
                            className="m-ai-user-list-avatar"
                            src={item.userAvatarCdn}
                            alt="头像"
                          ></img>
                        </Popover>
                        <div className="m-ai-message-wrap">
                          <div className="m-ai-nickname">
                            {item.nickname}{' '}
                            {moment(item.createTime - 0).format(
                              'MM-DD HH:mm:ss'
                            )}
                          </div>
                          <div className="m-ai-message-outer">
                            <div className="m-ai-message-inner">
                              <Popover
                                placement="topRight"
                                title={null}
                                content={getMessageToolbar(item)}
                                trigger="click"
                                getPopupContainer={() =>
                                  document.getElementById(
                                    `message-item-${item.uid}`
                                  )
                                }
                              >
                                <div className="m-ai-message-inner-inner">
                                  <div
                                    className={`m-ai-message type${
                                      item.messageType
                                    } ${
                                      item.nickname ===
                                      localStorage.getItem('nickname')
                                        ? 'me'
                                        : ''
                                    }`}
                                    dangerouslySetInnerHTML={{
                                      __html: item.message,
                                    }}
                                  ></div>
                                  <div
                                    className={`m-ai-message-cross chat-type${
                                      item.messageType
                                    } ${
                                      item.nickname ===
                                      localStorage.getItem('nickname')
                                        ? 'me'
                                        : ''
                                    }`}
                                  ></div>
                                </div>
                              </Popover>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Scrollbar>
            ) : null}

            {dataSource.length === 0 ? (
              <Skeleton
                avatar
                paragraph={{
                  rows: 3,
                }}
                active
                className="m-h5-lesson-play-skeleton"
              />
            ) : null}
          </div>
        </div>
        <div className="m-ai-footer">
          <Input.TextArea
            value={message}
            onChange={handleInputChange}
            placeholder="请输入"
            disabled={isSending}
            autoSize={{
              minRows: 3,
              maxRows: 8,
            }}
          />
          <Button type="primary" disabled={isSending} onClick={handleSend}>
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    collapsed: state.getIn(['light', 'collapsed']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetState(key, value) {
      dispatch({ type: 'SET_LIGHT_STATE', key, value })
    },
    onDispatch(action) {
      dispatch(action)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index))
