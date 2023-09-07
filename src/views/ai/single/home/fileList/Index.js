import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SinglePageHeader, Icon } from '../../../../../components/light'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Dropdown, Divider, Skeleton, Button, Space, Image } from 'antd'
import useList from './useList'
import moment from 'moment'
import useFile from './useFile'
import './index.css'

function Index(props) {
  const { dataSource, isHasMore, isLoading, handleSearch, handleCopy } =
    useList(props)
  const { fileOpenModel, fileGetDom } = useFile({ handleSearch })
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
        icon: <Icon name="course" className="m-filelist-menu-icon"></Icon>,
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
        icon: <Icon name="course" className="m-filelist-menu-icon"></Icon>,
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
        icon: <Icon name="chrome" className="m-filelist-menu-icon"></Icon>,
      },
    ]
    return items
  }
  // eslint-disable-next-line
  return (
    <div className="m-filelist-wrap-box">
      <div className={`m-filelist-wrap-chat`}>
        <SinglePageHeader
          goBackPath="/ai/index/home/chatList"
          title="我的文件"
        ></SinglePageHeader>
        <div className="m-filelist-list" id="scrollableDiv">
          {window.platform === 'rn' ? null : (
            <Dropdown
              menu={{ items: getItems() }}
              className="m-filelist-dropdown"
              trigger={['click', 'hover']}
            >
              <Icon name="more" className="m-filelist-menu-btn"></Icon>
            </Dropdown>
          )}
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
                paragraph={{
                  rows: 3,
                }}
                active
                className="m-h5-lesson-play-skeleton"
              />
            }
            endMessage={
              dataSource.length === 0 ? null : (
                <Divider plain>已经到底啦~</Divider>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <div className="m-filelist-item-wrap">
              {dataSource.map((item) => (
                <div
                  className={`m-filelist-item`}
                  key={item.uid}
                  // onClick={() =>
                  //   handleJumpPage(
                  //     `/ai/wordsDetail?uid=${item.uid}&pageNum=${item.pageNum}`
                  //   )
                  // }
                >
                  <Icon
                    name={item.fileType}
                    className="m-filelist-item-icon"
                  ></Icon>
                  <div className="m-filelist-item-info">
                    <div className="m-filelist-item-name">{item.name}</div>
                    {/* eslint-disable-next-line */}
                    <a
                      href={`${item.urlCdn}`}
                      title={`${item.urlCdn}`}
                      target="_blank"
                      className="m-filelist-item-url m-ellipsis"
                    >
                      {item.urlCdn}
                    </a>
                    <div className="m-filelist-item-nickname">
                      <Image
                        src={item.userAvatarCdn}
                        className="m-filelist-item-avatar"
                        alt={'图片'}
                      ></Image>
                      {item.nickname}
                    </div>
                    <div className="m-filelist-item-datetime">
                      {moment(item.createTime - 0).format('MM-DD HH:mm:ss')}
                    </div>
                    <div className="m-filelist-item-btn-wrap">
                      <Space>
                        <Button
                          onClick={() => handleCopy(item.urlCdn)}
                          size="small"
                        >
                          复制链接
                        </Button>
                      </Space>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          </InfiniteScroll>
        </div>
        <div className="m-filelist-footer">
          <Space>
            <Button type="primary" onClick={() => fileOpenModel()}>
              添加文件
            </Button>
          </Space>
        </div>
        {fileGetDom()}
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
