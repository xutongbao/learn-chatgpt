import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// eslint-disable-next-line
import {
  Input,
  Button,
  Dropdown,
  Popover,
  Descriptions,
  Skeleton,
  Image,
} from 'antd'
import useList from './useList'
import moment from 'moment'
import { SinglePageHeader, Icon } from '../../../components/light'
import { Scrollbar } from 'react-scrollbars-custom'

import './index.css'
import './index2.css'

function Index(props) {
  // eslint-disable-next-line
  const {
    dataSource,
    message,
    isSending,
    scrollEl,
    trigger,
    device,
    pageType,
    title,
    handleSend,
    handleCtrlEnter,
    handleInputChange,
    handleScroll,
    getMessageToolbar,
    handleJumpPage,
    handleToolbarOpenChange,
    handleAudioPlayerBtnClick,
    handleAction,
  } = useList(props)

  const getItems = () => {
    if (pageType === '1') {
      const items = [
        {
          key: '1',
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
          key: '2',
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
          key: 'free',
          label: '免费增加提问次数',
          icon: <Icon name="gift" className="m-ai-menu-icon"></Icon>,
          onClick: () => handleAction({ type: 'free' }),
        },
      ]
      return items
    } else if (pageType === '2') {
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
          key: '2',
          label: '群聊隐身',
          icon: <Icon name="invisible" className="m-ai-menu-icon"></Icon>,
          onClick: () => handleAction({ type: 'invisible' }),
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
          key: 'free',
          label: '免费增加提问次数',
          icon: <Icon name="gift" className="m-ai-menu-icon"></Icon>,
          onClick: () => handleAction({ type: 'free' }),
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

  //用户信息
  const getUserInfo = (item) => {
    return (
      <div className="m-ai-chat-userinfo-wrap">
        <Descriptions
          title="用户信息"
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="用户头像" span={1}>
            <Image
              src={item.userAvatarCdn}
              className="m-ai-chat-intro-img"
              alt={'图片'}
            ></Image>
          </Descriptions.Item>
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
  //音频播放器
  const getAudioDom = (item) => {
    return (
      <div className="m-ai-audio-player-wrap">
        <div id={`m-chat-audio-player-${item.uid}`}></div>
      </div>
    )
  }

  let wideScreenHistory =
    localStorage.getItem('wideScreen') === 'false' ? false : true
  return (
    <div className="m-ai-wrap-box">
      <div className={`m-ai-wrap-chat ${wideScreenHistory ? 'active' : ''}`}>
        <SinglePageHeader
          goBackPath="/ai/index/home/chatList"
          title={title}
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
                        {item.messageType === '1' ? (
                          <Popover
                            placement="rightTop"
                            title={null}
                            content={getUserInfo(item)}
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
                              <div>
                                Based on OpenAI API (
                                {item.chatGPTVersion === '4'
                                  ? 'gpt-4'
                                  : 'gpt-3.5-turbo'}
                                ).
                              </div>
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
                                placement="topLeft"
                                title={null}
                                content={getMessageToolbar(item)}
                                trigger={trigger}
                                open={item.isOpenPopover}
                                onOpenChange={(open) =>
                                  handleToolbarOpenChange({ open, item })
                                }
                                getPopupContainer={() =>
                                  document.getElementById(
                                    `message-item-${item.uid}`
                                  )
                                }
                              >
                                <div className="m-ai-message-inner-inner">
                                  <div
                                    className={`m-ai-message chat-type${
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
                              <div
                                className="m-ai-message-footer"
                                id={`m-ai-message-footer-${item.uid}`}
                              >
                                <div className="m-ai-message-footer-toolbar">
                                  <Popover
                                    placement="bottomLeft"
                                    title={null}
                                    content={getAudioDom(item)}
                                    trigger="click"
                                    className="m-ai-chat-audio-popover"
                                    getPopupContainer={() =>
                                      document.getElementById(
                                        `m-ai-message-footer-${item.uid}`
                                      )
                                    }
                                  >
                                    <Icon
                                      className={`m-ai-message-audio-player-btn audio-play ${
                                        item.audioUrlCdn ? 'active' : ''
                                      }`}
                                      name="audio"
                                      title="播放音频"
                                      onClick={() =>
                                        handleAudioPlayerBtnClick(item)
                                      }
                                    ></Icon>
                                    <Button
                                      type="text"
                                      className={`m-ai-message-audio-player-btn audio-ing ${
                                        item.isAudioLoading ? 'active' : ''
                                      }`}
                                      loading={true}
                                    />
                                  </Popover>
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
                                      升级到GPT-4
                                    </div>
                                  </>
                                ) : null}
                                {item.chatGPTVersion === '4' &&
                                item.messageType === '2' ? (
                                  <>
                                    <div className="m-ai-message-footer-info gpt-4">
                                      gpt-4
                                    </div>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Scrollbar>
            ) : null}

            {dataSource.length === 0 && pageType === '2' ? (
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
            onKeyUp={(e) => handleCtrlEnter(e)}
            placeholder="请输入"
            // disabled={isSending}
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
              <Button type="primary" loading={isSending} onClick={handleSend}>
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
