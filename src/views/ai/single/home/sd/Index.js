import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Input, Button, Dropdown, Popover, Skeleton, Image } from 'antd'
import useList from './useList'
import useFuntionCalling from './useFuntionCalling'
import moment from 'moment'
import { SinglePageHeader, Icon } from '../../../../../components/light'
import { Scrollbar } from 'react-scrollbars-custom'
import { AudioRecorder } from 'react-audio-voice-recorder'
import useDialog from './useDialog'
import useInfoDialog from './useInfoDialog'
import usePrompt from './usePrompt'

import useUserInfo from '../../../../../utils/hooks/useUserInfo/Index'
import './index.css'
import './index2.css'

let handleInputChangeByInfoDialogTemp

function Index(props) {
  const { dialogShow, dialogDom } = useDialog(props)
  const { dialogInfoShow, dialogInfoDom } = useInfoDialog({
    ...props,
    handleInputChangeByInfoDialog: handleInputChangeByInfoDialogTemp,
  })

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
    isLoading,
    routerSearchObj,
    previewCurrent,
    handleSend,
    handleCtrlEnter,
    handleInputChange,
    handleInputChangeByInfoDialog,
    handleScroll,
    getMessageToolbar,
    handleToolbarOpenChange,
    handleAction,
    changeMessageByUpload,
    setInputType,
    handleUploadAudio,
    handleNotAllowedOrFound,
    handleImgClick,
    handlePreviewChange,
    handleSelectPrompt,
    handleTry,
  } = useList({ ...props, dialogShow })

  handleInputChangeByInfoDialogTemp = handleInputChangeByInfoDialog

  const { functionCallingGetDom } = useFuntionCalling({
    ...props,
    changeMessageByUpload,
  })

  const { promptHandleModalVisible, promptGetDom } = usePrompt({
    ...props,
    handleSelectPrompt: handleSelectPrompt,
  })

  const getItems = () => {
    const items = [
      {
        key: '2',
        label: '刷新',
        icon: <Icon name="reset" className="m-sd-chat-menu-icon"></Icon>,
        onClick: () => handleAction({ type: 'refresh' }),
      },
    ]
    return items
  }

  let wideScreenHistory =
    localStorage.getItem('wideScreen') === 'false' ? false : true
  return (
    <div className="m-sd-chat-wrap-box">
      <div
        className={`m-sd-chat-wrap-chat ${wideScreenHistory ? 'active' : ''}`}
      >
        <SinglePageHeader
          // goBackPath="/ai/index/home/chatList"
          title={routerSearchObj.type === '1' ? 'Stable Diffusion' : 'SD群聊'}
        ></SinglePageHeader>
        <div
          className="m-sd-chat-main"
          id="scrollableDiv"
          onScroll={handleScroll}
        >
          <div
            className={`m-sd-chat-list ${window.platform === 'rn' ? 'rn' : ''}`}
          >
            {window.platform === 'rn' ? null : (
              <Dropdown
                menu={{ items: getItems() }}
                className="m-sd-chat-dropdown"
                trigger={['click', 'hover']}
              >
                <Icon name="more" className="m-sd-chat-menu-btn"></Icon>
              </Dropdown>
            )}

            {dataSource.length > 0 ? (
              <Scrollbar onScroll={handleScroll} ref={scrollEl}>
                {dataSource.map((item, index) => (
                  <div key={index} id={`message-item-${item.uid}`}>
                    <div className="m-sd-chat-user-list-wrap-wrap">
                      <div className="m-sd-chat-user-list-wrap">
                        <img
                          className="m-sd-chat-user-list-avatar"
                          src={item.user.avatarCdn}
                          alt="头像"
                          onClick={() =>
                            userInfoShowModel({
                              uid: item.user.uid,
                              info: item.info,
                            })
                          }
                        ></img>
                        <div className="m-sd-chat-message-wrap">
                          <div className="m-sd-chat-nickname">
                            {item.user.nickname}{' '}
                            {moment(item.createTime - 0).format(
                              'MM-DD HH:mm:ss'
                            )}
                          </div>
                          <div className="m-sd-chat-message-outer">
                            <div className="m-sd-chat-message-inner">
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
                                <div className="m-sd-chat-message-inner-inner">
                                  <div
                                    className={`m-sd-chat-message m-select-text chat-type${
                                      item.messageType
                                    } ${
                                      item.user.uid ===
                                      localStorage.getItem('uid')
                                        ? 'me'
                                        : ''
                                    }`}
                                    dangerouslySetInnerHTML={{
                                      __html: item.message,
                                    }}
                                    id={`m-sd-chat-message-value-${item.uid}`}
                                  ></div>
                                  <div
                                    className={`m-sd-chat-message-cross chat-type2 ${
                                      item.user.uid ===
                                      localStorage.getItem('uid')
                                        ? 'me'
                                        : ''
                                    }`}
                                  ></div>
                                </div>
                              </Popover>
                              <div
                                className="m-sd-chat-message-footer"
                                id={`m-sd-chat-message-footer-${item.uid}`}
                              >
                                <div className="m-sd-chat-message-footer-toolbar"></div>
                                <div className="m-ai-message-footer-info"></div>
                                <Icon
                                  name="info"
                                  className="m-sd-chat-message-info-icon"
                                  onClick={() =>
                                    dialogInfoShow({ item, type: 'check' })
                                  }
                                  title="更多基础绘画配置"
                                ></Icon>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="m-sd-chat-user-list-wrap">
                        <Popover
                          placement="rightTop"
                          title={null}
                          content={
                            <div className="m-ai-user-list-avatar-popover">
                              Based on Stable Diffusion Api.
                            </div>
                          }
                          trigger="click"
                          getPopupContainer={() =>
                            document.getElementById(`message-item-${item.uid}`)
                          }
                        >
                          <img
                            className="m-sd-chat-user-list-avatar"
                            src={'https://static.xutongbao.top/img/m-sd.jpg'}
                            alt="头像"
                          ></img>
                        </Popover>
                        <div className="m-sd-chat-message-wrap">
                          <div className="m-sd-chat-nickname">
                            {'robot'}{' '}
                            {moment(item.createTime - 0 + 1000).format(
                              'MM-DD HH:mm:ss'
                            )}
                          </div>
                          <div className="m-sd-chat-message-outer">
                            <div className="m-sd-chat-message-inner">
                              <div className="m-sd-chat-message-inner-inner">
                                <div
                                  className={`m-sd-chat-message m-sd-chat-img-box m-select-text chat-type2`}
                                >
                                  {Array.isArray(item.pictureList) && item.pictureList.length > 0 &&
                                    item.pictureList.map((picItem) => (
                                      <div
                                        key={picItem}
                                        className={`m-sd-chat-img-wrap ${
                                          item.pictureList.length > 2
                                            ? 'four'
                                            : 'two'
                                        }`}
                                      >
                                        <Image.PreviewGroup
                                          items={item.pictureList}
                                          preview={{
                                            current: previewCurrent,
                                            onChange: (current, prevCurrent) =>
                                              handlePreviewChange(
                                                current,
                                                prevCurrent
                                              ),
                                          }}
                                        >
                                          <Image
                                            src={picItem}
                                            className="m-sd-chat-img"
                                            alt={'图片'}
                                            onClick={() =>
                                              handleImgClick({
                                                pictureList: item.pictureList,
                                                picItem,
                                              })
                                            }
                                          ></Image>
                                        </Image.PreviewGroup>
                                      </div>
                                    ))}
                                  {item.pictureList.length === 0 ? (
                                    <div className="m-sd-chat-loading-gif-wrap">
                                      <img
                                        src="http://static.xutongbao.top/img/loading.gif"
                                        className="m-sd-chat-loading-gif"
                                        alt="图片"
                                      />
                                    </div>
                                  ) : null}
                                </div>
                                <div
                                  className={`m-sd-chat-message-cross chat-type2`}
                                ></div>
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
        <div className="m-sd-chat-input-toolbar">
          {/* <Icon
            name="search"
            className="m-sd-chat-input-toolbar-icon"
            onClick={() => promptHandleModalVisible()}
            title="关键词词典"
          ></Icon> */}
          <Button
            type="primary"
            className="m-space"
            onClick={() => promptHandleModalVisible()}
            size="small"
          >
            关键词词典
          </Button>
          <Button
            type="primary"
            className="m-space"
            onClick={() => handleTry()}
            size="small"
          >
            试试关键词
          </Button>
        </div>
        <div className="m-sd-chat-footer">
          {inputType === '1' ? (
            <div className="m-sd-chat-input-wrap">
              {/* <Icon
                name="audio"
                className="m-sd-chat-input-type-icon"
                onClick={() => setInputType('2')}
              ></Icon> */}
              <Input.TextArea
                value={message}
                onChange={handleInputChange}
                onKeyUp={(e) => handleCtrlEnter(e)}
                placeholder="请输入中文/英文提示词，例如：1girl,face,white background"
                allowClear
                // disabled={isSending}
                className="m-sd-chat-input"
                autoSize={{
                  minRows: 3,
                  maxRows: 8,
                }}
                maxLength={1000}
              />
              <Icon
                name="info"
                className="m-sd-chat-input-info-icon"
                onClick={() => dialogInfoShow({ message, type: 'add' })}
                title="更多基础绘画配置"
              ></Icon>
            </div>
          ) : null}

          <div
            className={`m-sd-chat-audio-recorder-wrap-outer ${
              inputType === '2' ? 'active' : ''
            }`}
          >
            <Icon
              name="keyboard"
              className="m-sd-chat-input-type-icon"
              onClick={() => setInputType('1')}
            ></Icon>
            <div className="m-sd-chat-audio-recorder-wrap">
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
            <div className="m-sd-chat-footer-btn-wrap">
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
                  className="m-sd-chat-footer-btn-send"
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
        {dialogInfoDom()}
        {promptGetDom('1')}
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
