import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Input, Button, Dropdown, Popover, Skeleton } from 'antd'
import useList from './useList'
import useFuntionCalling from './useFuntionCalling'
import moment from 'moment'
import { SinglePageHeader, Icon } from '../../../../../components/light'
import { Scrollbar } from 'react-scrollbars-custom'
import { AudioRecorder } from 'react-audio-voice-recorder'
import useDialog from './useDialog'
import useUserInfo from '../../../../../utils/hooks/useUserInfo/Index'
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
    inputType,
    routerSearchObj,
    isLoading,
    handleSend,
    handleCtrlEnter,
    handleInputChange,
    handleScroll,
    getMessageToolbar,
    handleToolbarOpenChange,
    handleAudioPlayerBtnClick,
    handleAction,
    changeMessageByUpload,
    setInputType,
    handleUploadAudio,
    handleNotAllowedOrFound,
  } = useList({ ...props, dialogShow })

  const { functionCallingGetDom } = useFuntionCalling({
    ...props,
    changeMessageByUpload,
  })

  const getItems = () => {
    const items = [
      {
        key: '1',
        label: '用户信息',
        icon: <Icon name="people" className="m-real-chat-menu-icon"></Icon>,
        onClick: () =>
          userInfoShowModel({
            uid: routerSearchObj.friendUserId,
            info: {},
          }),
      },
      {
        key: '2',
        label: '刷新',
        icon: <Icon name="reset" className="m-real-chat-menu-icon"></Icon>,
        onClick: () => handleAction({ type: 'refresh' }),
      },
    ]
    return items
  }

  //音频播放器
  const getAudioDom = (item) => {
    return (
      <div className="m-real-chat-audio-player-wrap">
        <div id={`m-chat-audio-player-${item.uid}`}></div>
      </div>
    )
  }

  let wideScreenHistory =
    localStorage.getItem('wideScreen') === 'false' ? false : true
  return (
    <div className="m-real-chat-wrap-box">
      <div
        className={`m-real-chat-wrap-chat ${wideScreenHistory ? 'active' : ''}`}
      >
        <SinglePageHeader
          // goBackPath="/ai/index/home/chatList"
          title={decodeURIComponent(routerSearchObj.name)}
        ></SinglePageHeader>
        <div
          className="m-real-chat-main"
          id="scrollableDiv"
          onScroll={handleScroll}
        >
          <div
            className={`m-real-chat-list ${
              window.platform === 'rn' ? 'rn' : ''
            }`}
          >
            {window.platform === 'rn' ? null : (
              <Dropdown
                menu={{ items: getItems() }}
                className="m-real-chat-dropdown"
                trigger={['click', 'hover']}
              >
                <Icon name="more" className="m-real-chat-menu-btn"></Icon>
              </Dropdown>
            )}

            {dataSource.length > 0 ? (
              <Scrollbar onScroll={handleScroll} ref={scrollEl}>
                {dataSource.map((item, index) => (
                  <div key={index} id={`message-item-${item.uid}`}>
                    <div className="m-real-chat-user-list-wrap-wrap">
                      <div className="m-real-chat-user-list-wrap">
                        <img
                          className="m-real-chat-user-list-avatar"
                          src={item.messageOwner.avatarCdn}
                          alt="头像"
                          onClick={() =>
                            userInfoShowModel({
                              uid: item.messageOwner.uid,
                              info: item.info,
                            })
                          }
                        ></img>
                        <div className="m-real-chat-message-wrap">
                          <div className="m-real-chat-nickname">
                            {item.messageOwner.nickname}{' '}
                            {moment(item.createTime - 0).format(
                              'MM-DD HH:mm:ss'
                            )}
                          </div>
                          <div className="m-real-chat-message-outer">
                            <div className="m-real-chat-message-inner">
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
                                <div className="m-real-chat-message-inner-inner">
                                  <div
                                    className={`m-real-chat-message m-select-text chat-type${
                                      item.messageType
                                    } ${
                                      item.messageOwner.uid ===
                                      localStorage.getItem('uid')
                                        ? 'me'
                                        : ''
                                    }`}
                                    dangerouslySetInnerHTML={{
                                      __html: item.info.message,
                                    }}
                                    id={`m-real-chat-message-value-${item.uid}`}
                                  ></div>
                                  <div
                                    className={`m-real-chat-message-cross chat-type2 ${
                                      item.messageOwner.uid ===
                                      localStorage.getItem('uid')
                                        ? 'me'
                                        : ''
                                    }`}
                                  ></div>
                                </div>
                              </Popover>
                              <div
                                className="m-real-chat-message-footer"
                                id={`m-real-chat-message-footer-${item.uid}`}
                              >
                                <div className="m-real-chat-message-footer-toolbar">
                                  <Popover
                                    placement="bottomLeft"
                                    title={null}
                                    content={getAudioDom(item)}
                                    trigger="click"
                                    className="m-real-chat-audio-popover"
                                    getPopupContainer={() =>
                                      document.getElementById(
                                        `m-real-chat-message-footer-${item.uid}`
                                      )
                                    }
                                  >
                                    <Icon
                                      className={`m-real-chat-message-audio-player-btn audio-play ${
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
                                        className={`m-real-chat-message-audio-player-btn audio-ing ${
                                          item.isAudioLoading ? 'active' : ''
                                        }`}
                                        loading={true}
                                      />
                                    ) : null}
                                  </Popover>
                                </div>
                                {item.messageOwner.uid ===
                                localStorage.getItem('uid') ? (
                                  <>
                                    {Array.isArray(item.friendsUserInfoArr) &&
                                    item.friendsUserInfoArr.length === 1 &&
                                    item.friendsUserInfoArr[0].isRead ===
                                      '1' ? (
                                      <div className="m-real-chat-message-footer-info">
                                        已读
                                      </div>
                                    ) : (
                                      <div className="m-real-chat-message-footer-info unread">
                                        未读
                                      </div>
                                    )}
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
        <div className="m-real-chat-footer">
          {inputType === '1' ? (
            <div className="m-real-chat-input-wrap">
              {/* <Icon
                name="audio"
                className="m-real-chat-input-type-icon"
                onClick={() => setInputType('2')}
              ></Icon> */}
              <Input.TextArea
                value={message}
                onChange={handleInputChange}
                onKeyUp={(e) => handleCtrlEnter(e)}
                placeholder="请输入"
                allowClear
                // disabled={isSending}
                className="m-real-chat-input"
                autoSize={{
                  minRows: 3,
                  maxRows: 8,
                }}
              />
            </div>
          ) : null}

          <div
            className={`m-real-chat-audio-recorder-wrap-outer ${
              inputType === '2' ? 'active' : ''
            }`}
          >
            <Icon
              name="keyboard"
              className="m-real-chat-input-type-icon"
              onClick={() => setInputType('1')}
            ></Icon>
            <div className="m-real-chat-audio-recorder-wrap">
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
            <div className="m-real-chat-footer-btn-wrap">
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
                  className="m-real-chat-footer-btn-send"
                >
                  发送
                </Button>
              </Popover>
              {/* <Popover
                placement="topRight"
                content={device?.type === 'mobile' ? '' : <div>插件库</div>}
                trigger={device?.type === 'mobile' ? '' : 'hover'}
              >
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={functionCallingShowDrawer}
                ></Button>
              </Popover> */}
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
