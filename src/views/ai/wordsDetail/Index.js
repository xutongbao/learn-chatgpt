import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SinglePageHeader, Icon } from '../../../components/light'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Dropdown, Divider, Skeleton, Image } from 'antd'
import useList from './useList'
import './index.css'
import './index2.css'

function Index(props) {
  const {
    isLoading,
    currentWord,
    dataSource,
    isHasMore,
    handleSearch,
    handleGetById,
    handleAudioPlayerBtnClick,
  } = useList(props)
  const getItems = () => {
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
        icon: <Icon name="course" className="m-words-detail-menu-icon"></Icon>,
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
        icon: <Icon name="course" className="m-words-detail-menu-icon"></Icon>,
      },
      {
        key: 'chrome',
        label: (
          <>
            {/* eslint-disable-next-line */}
            <a href={`https://static.xutongbao.top/app/ChromeSetup.exe`} target="_blank">
              下载chrome浏览器（推荐）
            </a>
          </>
        ),
        icon: <Icon name="chrome" className="m-words-detail-menu-icon"></Icon>,
      },
    ]
    return items
  }
  let wideScreenHistory =
    localStorage.getItem('wideScreen') === 'false' ? false : true
  return (
    <div className="m-words-detail-wrap-box">
      <div
        className={`m-words-detail-wrap-chat ${
          wideScreenHistory ? 'active' : ''
        }`}
      >
        <SinglePageHeader
          goBackPath="/ai/words"
          title="识字-详情"
        ></SinglePageHeader>
        <div className="m-words-detail-list-wrap">
          <div className="m-words-detail-list" id="scrollableDiv">
            <Dropdown
              menu={{ items: getItems() }}
              className="m-words-detail-dropdown"
              trigger={['click', 'hover']}
            >
              <Icon name="more" className="m-words-detail-menu-btn"></Icon>
            </Dropdown>

            <InfiniteScroll
              dataLength={dataSource.length}
              next={handleSearch}
              refreshFunction={() => handleSearch({ page: 1, isRefresh: true })}
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
              pullDownToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8595; 下拉刷新</h3>
              }
              releaseToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8593; 释放刷新</h3>
              }
              hasMore={isHasMore}
              loader={
                <Skeleton
                  avatar
                  // paragraph={{
                  //   rows: 3,
                  // }}
                  active
                  className="m-h5-lesson-play-skeleton"
                />
              }
              endMessage={
                dataSource.length === 0 ? null : <Divider plain>end~</Divider>
              }
              scrollableTarget="scrollableDiv"
            >
              <div className="m-words-detail-word-wrap">
                {dataSource.map((item, index) => (
                  <div
                    className={`m-words-detail-word-item ${
                      item.uid === currentWord.uid ? 'active' : ''
                    }`}
                    id={`m-word-${item.uid}`}
                    key={index}
                    onClick={() => handleGetById({ uid: item.uid })}
                  >
                    {item.word}
                  </div>
                ))}
              </div>
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
            </InfiniteScroll>
          </div>
          {isLoading ? (
            <div className="m-words-detail-info">
              <Skeleton
                avatar
                paragraph={{
                  rows: 3,
                }}
                active
                className="m-h5-lesson-play-skeleton"
              />
            </div>
          ) : (
            <div className="m-words-detail-info">
              <div className="m-words-detail-info-main">
                <div className="m-words-detail-info-word">
                  {currentWord.word}
                </div>
                <div className="m-words-detail-info-img-wrap">
                  <Image
                    src={currentWord.relationImageCdn}
                    className="m-words-detail-info-img"
                    alt={'图片'}
                  ></Image>
                </div>
                {currentWord.wordAudioCdn ? (
                  <div className="m-wrods-detail-info-word-audio-wrap">
                    <Icon
                      className={`m-words-audio-player-icon`}
                      name="audio"
                      title="播放音频"
                      onClick={() =>
                        handleAudioPlayerBtnClick({
                          playUrl: currentWord.wordAudioCdn,
                        })
                      }
                    ></Icon>
                  </div>
                ) : null}

                <div className="m-words-detail-info-list">
                  <div className="m-words-detail-info-list-title">词语</div>
                  {currentWord?.ci?.map((item) => (
                    <div
                      key={item.id}
                      className="m-words-detail-info-list-item-ci"
                    >
                      <div className="m-words-detail-info-list-item-text-ci">
                        <span
                          dangerouslySetInnerHTML={{ __html: item.textForHtml }}
                        ></span>
                        {item.audioCdn ? (
                          <Icon
                            className={`m-words-audio-player-icon`}
                            name="audio"
                            title="播放音频"
                            onClick={() =>
                              handleAudioPlayerBtnClick({
                                playUrl: item.audioCdn,
                              })
                            }
                          ></Icon>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  <div className="m-words-detail-info-list-title">句子</div>
                  {currentWord?.sentence?.map((item) => (
                    <div
                      key={item.id}
                      className="m-words-detail-info-list-item-sentence"
                    >
                      <div className="m-words-detail-info-list-item-text-sentence">
                        <span
                          dangerouslySetInnerHTML={{ __html: item.textForHtml }}
                        ></span>
                        {item.audioCdn ? (
                          <Icon
                            className={`m-words-audio-player-icon`}
                            name="audio"
                            title="播放音频"
                            onClick={() =>
                              handleAudioPlayerBtnClick({
                                playUrl: item.audioCdn,
                              })
                            }
                          ></Icon>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="m-words-detail-footer">
          <div id={`m-words-audio-player`}></div>
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
