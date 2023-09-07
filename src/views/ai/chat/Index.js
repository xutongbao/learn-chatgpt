import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Input, Button, Dropdown, Popover, Skeleton } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import useList from './useList'
import useFuntionCalling from './useFuntionCalling'
import moment from 'moment'
import { SinglePageHeader, Icon } from '../../../components/light'
import { Scrollbar } from 'react-scrollbars-custom'
import { AudioRecorder } from 'react-audio-voice-recorder'
import useDialog from './useDialog'
import useUserInfo from '../../../utils/hooks/useUserInfo/Index'
import './index.css'
import './index2.css'

function Index(props) {
  const { dialogShow, dialogDom } = useDialog(props)
  const { userInfoShowModel, userInfoGetDom } = useUserInfo()

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
    inputType,
    isLoading,
    handleSend,
    handleCtrlEnter,
    handleInputChange,
    handleScroll,
    handleUpdateToGPT4,
    getMessageToolbar,
    handleToolbarOpenChange,
    handleAudioPlayerBtnClick,
    // handleSelectText,
    //handleTouchStart,
    //handleTouchEnd,
    // handleDoubleClick,
    handleAction,
    changeMessageByUpload,
    setInputType,
    handleUploadAudio,
    handleNotAllowedOrFound,
  } = useList({ ...props, dialogShow })

  const { functionCallingShowDrawer, functionCallingGetDom } =
    useFuntionCalling({
      ...props,
      changeMessageByUpload,
    })

  const getItems = () => {
    if (pageType === '1' || pageType === '3') {
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
          key: 'web',
          label: (
            <>
              {/* eslint-disable-next-line */}
              <a
                href={`https://blog.csdn.net/xutongbao/article/details/131568991`}
                target="_blank"
              >
                ChatGPT已经联网
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
              <a
                href={`https://static.xutongbao.top/app/ChromeSetup.exe`}
                target="_blank"
              >
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
          key: 'web',
          label: (
            <>
              {/* eslint-disable-next-line */}
              <a
                href={`https://blog.csdn.net/xutongbao/article/details/131568991`}
                target="_blank"
              >
                ChatGPT已经联网
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
              <a
                href={`https://static.xutongbao.top/app/ChromeSetup.exe`}
                target="_blank"
              >
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
          <div className={`m-ai-list ${window.platform === 'rn' ? 'rn' : ''}`}>
            {window.platform === 'rn' ? null : (
              <Dropdown
                menu={{ items: getItems() }}
                className="m-ai-dropdown"
                trigger={['click', 'hover']}
              >
                <Icon name="more" className="m-ai-menu-btn"></Icon>
              </Dropdown>
            )}

            {dataSource.length > 0 ? (
              <Scrollbar onScroll={handleScroll} ref={scrollEl}>
                {dataSource.map((item, index) => (
                  <div key={index} id={`message-item-${item.uid}`}>
                    <div className="m-ai-user-list-wrap-wrap">
                      <div className="m-ai-user-list-wrap">
                        {item.messageType === '1' ? (
                          <img
                            className="m-ai-user-list-avatar"
                            src={item.userAvatarCdn}
                            alt="头像"
                            onClick={() =>
                              userInfoShowModel({
                                uid: item.userInfo.uid,
                                info: item.info,
                              })
                            }
                          ></img>
                        ) : (
                          <Popover
                            placement="rightTop"
                            title={null}
                            content={
                              <div className="m-ai-user-list-avatar-popover">
                                Based on OpenAI API (
                                {item.chatGPTVersion === '4'
                                  ? 'gpt-4'
                                  : 'gpt-3.5-turbo-16k-0613'}
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
                                    className={`m-ai-message m-select-text chat-type${
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
                                    id={`m-ai-message-value-${item.uid}`}
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
                                    {item.isAudioLoading ? (
                                      <Button
                                        type="text"
                                        className={`m-ai-message-audio-player-btn audio-ing ${
                                          item.isAudioLoading ? 'active' : ''
                                        }`}
                                        loading={true}
                                      />
                                    ) : null}
                                  </Popover>
                                </div>
                                {(item.chatGPTVersion === '3.5' ||
                                  item.chatGPTVersion === '') &&
                                item.messageType === '2' ? (
                                  <>
                                    <div className="m-ai-message-footer-info">
                                      gpt-3.5-turbo-16k-0613
                                    </div>
                                    <div
                                      className="m-ai-message-footer-upgrade"
                                      onClick={() => handleUpdateToGPT4()}
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

            {dataSource.length === 0 && isLoading ? (
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
          {inputType === '1' ? (
            <div className="m-ai-chat-input-wrap">
              <Icon
                name="audio"
                className="m-ai-chat-input-type-icon"
                onClick={() => setInputType('2')}
              ></Icon>
              <Input.TextArea
                value={message}
                onChange={handleInputChange}
                onKeyUp={(e) => handleCtrlEnter(e)}
                placeholder="请输入"
                allowClear
                // disabled={isSending}
                className="m-ai-chat-input"
                autoSize={{
                  minRows: 3,
                  maxRows: 8,
                }}
              />
            </div>
          ) : null}

          <div
            className={`m-ai-chat-audio-recorder-wrap-outer ${
              inputType === '2' ? 'active' : ''
            }`}
          >
            <Icon
              name="keyboard"
              className="m-ai-chat-input-type-icon"
              onClick={() => setInputType('1')}
            ></Icon>
            <div className="m-ai-chat-audio-recorder-wrap">
              <AudioRecorder
                onRecordingComplete={handleUploadAudio}
                onNotAllowedOrFound={handleNotAllowedOrFound}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                // downloadOnSavePress={true}
                downloadFileExtension="webm"
                showVisualizer={true}
                classes={{
                  AudioRecorderStartSaveClass: 'js-audio-send',
                }}
              />
            </div>
          </div>

          {inputType === '1' ? (
            <div className="m-ai-footer-btn-wrap">
              <Popover
                placement="topRight"
                content={<div>Ctrl+Enter</div>}
                trigger={device?.type === 'mobile' ? '' : 'hover'}
              >
                <Button
                  type="primary"
                  loading={isSending}
                  // icon={<SendOutlined />}
                  onClick={handleSend}
                  className="m-ai-footer-btn-send"
                >
                  发送
                </Button>
              </Popover>
              <Popover
                placement="topRight"
                content={device?.type === 'mobile' ? '' : <div>插件库</div>}
                trigger={device?.type === 'mobile' ? '' : 'hover'}
              >
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={functionCallingShowDrawer}
                ></Button>
              </Popover>
            </div>
          ) : null}
        </div>
        {functionCallingGetDom()}
        {dialogDom()}
        {userInfoGetDom()}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    collapsed: state.getIn(['light', 'collapsed']),
    isRNGotToken: state.getIn(['light', 'isRNGotToken']),
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
