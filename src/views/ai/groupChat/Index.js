import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Input,
  Button,
  Empty,
  Dropdown,
  Popover,
  Descriptions,
} from 'antd'
import useList from './useList'
import moment from 'moment'
import { Scrollbar } from 'react-scrollbars-custom'
import { SinglePageHeader, Icon } from '../../../components/light'
import AudioPlayer from 'react-h5-audio-player'

import './index.css'
import './index2.css'
import 'react-h5-audio-player/lib/styles.css'

function Index(props) {
  // eslint-disable-next-line
  const {
    dataSource,
    message,
    isSending,
    scrollEl,
    trigger,
    device,
    handleSend,
    handleCtrlEnter,
    handleInputChange,
    handleScroll,
    handleAction,
    getMessageToolbar,
    handleJumpPage,
    handleToAudio,
  } = useList(props)

  const getItems = () => {
    const items = [
      {
        key: '1',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a
              href={`https://blog.csdn.net/xutongbao/article/details/129007691?spm=1001.2014.3001.5501`}
              target="_blank"
            >
              技术博客
            </a>
          </>
        ),
        icon: <Icon name="course" className="m-ai-menu-icon"></Icon>,
      },
      {
        key: '2',
        label: '群聊隐身',
        icon: <Icon name="invisible" className="m-ai-menu-icon"></Icon>,
        onClick: () => handleAction({ type: 'invisible' }),
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

  let wideScreenHistory =
    localStorage.getItem('wideScreen') === 'false' ? false : true
  return (
    <div className="m-ai-wrap-box">
      <div
        className={`m-ai-wrap-chat-group ${wideScreenHistory ? 'active' : ''}`}
      >
        <SinglePageHeader
          goBackPath="/ai/index/home/chatList"
          title="群聊"
        ></SinglePageHeader>
        <div className="m-ai-main" id="scrollableDiv" onScroll={handleScroll}>
          <div className="m-ai-list">
            <Dropdown
              menu={{ items: getItems() }}
              className="m-ai-dropdown"
              trigger={['click', 'hover']}
            >
              <Icon name="menu" className="m-ai-menu-btn"></Icon>
            </Dropdown>
            {dataSource.length > 0 ? (
              <Scrollbar onScroll={handleScroll} ref={scrollEl}>
                {dataSource.map((item, index) => (
                  <div key={index} id={`message-item-${item.uid}`}>
                    <div className="m-ai-user-list-wrap-wrap">
                      <div className="m-ai-user-list-wrap">
                        {item.messageType === '1' ? (
                          <Popover
                            placement="rightTop"
                            title={null}
                            content={getContent(item)}
                            trigger="click"
                            getPopupContainer={() =>
                              document.getElementById(
                                `message-item-${item.uid}`
                              )
                            }
                          >
                            <img
                              className="m-ai-user-list-avatar"
                              src={item.userAvatarCdn}
                              alt="头像"
                            ></img>
                          </Popover>
                        ) : (
                          <Popover
                            placement="rightTop"
                            title={null}
                            content={
                              <div>Based on OpenAI API (gpt-3.5-turbo).</div>
                            }
                            trigger="click"
                            getPopupContainer={() =>
                              document.getElementById(
                                `message-item-${item.uid}`
                              )
                            }
                          >
                            <img
                              className="m-ai-user-list-avatar"
                              src={item.userAvatarCdn}
                              alt="头像"
                            ></img>
                          </Popover>
                        )}

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
                                trigger={trigger}
                                getPopupContainer={() =>
                                  document.getElementById(
                                    `message-item-${item.uid}`
                                  )
                                }
                              >
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
                                    __html: item.messageForHtml,
                                  }}
                                ></div>
                              </Popover>
                              <div className="m-ai-message-footer">
                                <div className="m-ai-message-footer-toolbar">
                                  <Button
                                    className={`m-ai-message-to-audio ${
                                      item.isShowToAudioBtn ? 'active' : ''
                                    }`}
                                    type="link"
                                    loading={item.isAudioLoading}
                                    onClick={() => handleToAudio(item)}
                                  >
                                    转音频
                                  </Button>
                                </div>
                                {(item.chatGPTVersion === '3.5' ||
                                  item.chatGPTVersion === '') &&
                                item.messageType === '2' ? (
                                  <>
                                    <div className="m-ai-message-footer-info">
                                      gpt-3.5-turbo
                                    </div>
                                    <div
                                      className="m-ai-message-footer-upgrade"
                                      onClick={() =>
                                        handleJumpPage('/ai/single/me/exchange')
                                      }
                                    >
                                      升级
                                    </div>
                                  </>
                                ) : null}
                                {item.chatGPTVersion === '4' &&
                                item.messageType === '2' ? (
                                  <>
                                    <div className="m-ai-message-footer-info">
                                      gpt-4
                                    </div>
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <div
                              className={`m-ai-message-audio-wrap ${
                                item.audioUrlCdn ? 'active' : ''
                              }`}
                            >
                              <AudioPlayer
                                src={item.audioUrlCdn}
                                volume={0.5}
                                autoPlay={false}
                                preload="none"
                              />
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
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : null}
          </div>
        </div>
        <div className="m-ai-footer">
          <Input.TextArea
            value={message}
            onChange={handleInputChange}
            onKeyUp={(e) => handleCtrlEnter(e)}
            placeholder="请输入"
            disabled={isSending}
            autoSize={{
              minRows: 3,
              maxRows: 8,
            }}
          />
          <div className="m-ai-footer-btn-wrap">
            <Popover
              placement="topRight"
              content={<div>Ctrl+Enter</div>}
              trigger={device?.type === 'mobile' ? '' : 'hover'}
            >
              <Button type="primary" disabled={isSending} onClick={handleSend}>
                发送
              </Button>
            </Popover>
          </div>
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
