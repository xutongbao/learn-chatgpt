import { useState, useEffect, useRef } from 'react'
import {
  Skeleton,
  message,
  Divider,
  Empty,
  Popconfirm,
  Drawer,
  Input,
  Button,
  Form,
} from 'antd'
import * as clipboard from 'clipboard-polyfill/text'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Icon } from '../../../../components/light'
import moment from 'moment'
import Api from '../../../../api'
import LazyLoad from 'react-lazy-load'

const { TextArea } = Input

let serverTime
export default function useBehavior(props) {
  const [isLike, setIsLike] = useState()
  const [likeCount, setLikeCount] = useState(0)
  const [isCollect, setIsCollect] = useState(false)
  const [isCommentVisible, setIsCommentVisible] = useState(
    process.env.REACT_APP_MODE === 'dev' && false
  )
  const [isReplyCommentVisible, setIsReplyCommentVisible] = useState(false)
  const [isFollow, setIsFollow] = useState()
  const [followCount, setFollowCount] = useState(0)

  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(10)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 10,
  })
  const [replyState, setReplyState] = useState({
    dataSource: [],
    pageSize: 10,
  })
  const [currentComment, setCurrentComment] = useState({})
  const [replyCurrentComment, setReplyCurrentComment] = useState({})
  const [isHasMore, setIsHasMore] = useState(true)
  const [isOpenCommentAdd, setIsOpenCommentAdd] = useState(false)
  const [commentAddPlaceholder, setIsCommentAddPlaceholder] = useState('')
  const [fields, setFields] = useState([
    {
      name: ['content'],
      value: '',
    },
  ])
  const [type, setType] = useState('add')

  const inputEl = useRef(null)
  // const [serverTime, setServerTime] = useState()
  let dataSource = state.dataSource
  let replyDataSource = replyState.dataSource

  const { courseDetail, currentLesson } = props

  let addInitValues = {}
  if (process.env.REACT_APP_MODE === 'dev') {
    addInitValues = [
      {
        name: ['content'],
        value: '',
      },
    ]
  } else {
    addInitValues = [
      {
        name: ['content'],
        value: '',
      },
    ]
  }

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    let searchData = { pageNum: page, pageSize, lessonId: currentLesson.uid }
    Api.h5.commentSearch(searchData).then((res) => {
      if (res.code === 200) {
        const { pageNum, pageSize, total } = res.data
        serverTime = res.data.serverTime
        if (isRefresh) {
          setState({
            dataSource: [...res.data.list],
            pageSize,
          })
        } else {
          setState({
            dataSource: [...state.dataSource, ...res.data.list],
            pageSize,
          })
        }
        setTotal(total)
        const currentTemp = pageNum + 1
        setCurrent(currentTemp)
        setIsHasMore(pageNum < Math.ceil(total / pageSize))
      }
    })
  }

  //关注
  const handleFollow = () => {
    setIsFollow(isFollow === 1 ? 0 : 1)
    if (isFollow === 1) {
      setFollowCount(followCount - 1)
    } else {
      setFollowCount(followCount + 1)
    }
    Api.h5
      .behaviorFollowAction({
        courseUserIds: [courseDetail.userId],
        isFollow: isFollow === 1 ? false : true
      })
      .then((res) => {
        if (res.code === 200) {
        }
      })
  }

  //分享
  const handleShare = () => {
    clipboard.writeText(window.location.href).then(() => {
      message.success('链接复制成功')
    })
    // if (navigator.share) {
    //   navigator.share(
    //     {
    //       title: 'webShare',
    //       text: 'webShare',
    //       url: window.location.href
    //     }
    //   );
    // }
  }

  //收藏
  const handleCollect = () => {
    setIsCollect(isCollect === 1 ? 0 : 1)
    message.success({
      content:
        isCollect === 1 ? '取消收藏' : '收藏成功！请到【我的】-【收藏】中查看',
    })

    Api.h5
      .behaviorLessonAction({
        lessonIds: [currentLesson.uid],
        behaviorType: '2',
        isAdd: isCollect === 1 ? false : true
      })
      .then((res) => {
        if (res.code === 200) {
        }
      })
  }

  //评论-打开
  const handleOpenComment = () => {
    setIsCommentVisible(true)
  }

  //评论-关闭
  const handleCloseComment = () => {
    setIsCommentVisible(false)
  }

  //评论-软删除
  const handleCommentSoftDelete = (comment) => {
    Api.h5.commentSoftDelete({ ids: [comment.uid] }).then((res) => {
      if (res.code === 200) {
        const resultIndexDataSource = dataSource.findIndex(
          (item) => item.uid === comment.uid
        )
        dataSource.splice(resultIndexDataSource, 1)
        setTotal(total - 1)
        setState({
          dataSource,
          pageSize: 10,
        })
      }
    })
  }

  const handleCommentSoftDeleteForReply = (comment) => {
    Api.h5.commentSoftDelete({ ids: [comment.uid] }).then((res) => {
      if (res.code === 200) {
        refreshReplyList()
      }
    })
  }

  //点赞
  const handleLike = () => {
    console.log('like', currentLesson)
    setIsLike(isLike === 1 ? 0 : 1)
    setLikeCount(isLike === 1 ? likeCount - 1 : likeCount + 1)
    Api.h5
      .behaviorLessonAction({
        lessonIds: [currentLesson.uid],
        behaviorType: '1',
        isAdd: isLike === 1 ? false : true
      })
      .then((res) => {
        if (res.code === 200) {
        }
      })
  }

  //点赞评论
  const handleLikeComment = (comment) => {
    Api.h5
      .commentLike({
        uid: comment.uid,
      })
      .then((res) => {
        if (res.code === 200) {
          const resultIndexDataSource = dataSource.findIndex(
            (item) => item.uid === comment.uid
          )
          if (comment.isLike) {
            dataSource[resultIndexDataSource].isLike = false
            dataSource[resultIndexDataSource].likeCount--
          } else {
            dataSource[resultIndexDataSource].isLike = true
            dataSource[resultIndexDataSource].likeCount++
          }
          setState({
            dataSource,
            pageSize: 10,
          })
        }
      })
  }

  //点赞评论
  const handleLikeCommentForReply = (comment, isCurrentComment) => {
    Api.h5
      .commentLike({
        uid: comment.uid,
      })
      .then((res) => {
        if (res.code === 200) {
          refreshReplyList()
          handleSearch({ page: 1, isRefresh: true })
          if (isCurrentComment === true) {
            currentComment.isLike = !currentComment.isLike
          }
          setCurrentComment(currentComment)
        }
      })
  }

  //格式化数字
  const getFormatCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`
    } else {
      return count
    }
  }

  const getFormatCountForLikeCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`
    } else {
      if (count === 0) {
        return '赞'
      } else {
        return count
      }
    }
  }

  const getFormatCountForReplyCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万 `
    } else {
      if (count === 0) {
        return ''
      } else {
        return `${count} `
      }
    }
  }

  const getCommentTime = (createTime) => {
    const interval = (serverTime - createTime) / 1000
    if (interval < 60) {
      return '刚刚'
    } else if (interval < 60 * 60) {
      let tempTime = Math.floor(interval / 60)
      return `${tempTime}分钟前`
    } else if (interval < 60 * 60 * 24) {
      let tempTime = Math.floor(interval / (60 * 60))
      return `${tempTime}小时前`
    } else if (interval < 60 * 60 * 24 * 7) {
      let tempTime = Math.floor(interval / (60 * 60 * 24))
      return `${tempTime}天前`
    } else if (interval < 60 * 60 * 24 * 365) {
      return moment(createTime - 0).format('MM-DD')
    } else {
      return moment(createTime - 0).format('YYYY-MM-DD')
    }
  }

  const getFrom = (item) => {
    const { regionName, city } = item.address ? item.address : {}
    if (regionName && city) {
      let cityArr = [
        '北京',
        '上海',
        '天津',
        '重庆',
        '北京市',
        '上海市',
        '天津市',
        '重庆市',
      ]
      if (cityArr.includes(regionName)) {
        return ` · 来至${regionName}`
      } else {
        return ` · 来至${regionName} ${city}`
      }
    } else if (item.from) return item.from ? ` · 来至 ${item.from}` : ''
  }

  const handleOpenCommentAdd = () => {
    setType('add')
    setFields(addInitValues)
    setIsOpenCommentAdd(true)
    setTimeout(() => {
      inputEl.current.focus()
    }, 100)
    setIsCommentAddPlaceholder('友善是交流的起点')
  }

  const handleOpenCommentAddForReply = ({ item, isReplyChildItem }) => {
    setType('reply')
    setFields(addInitValues)
    setIsOpenCommentAdd(true)
    setTimeout(() => {
      inputEl.current.focus()
    }, 100)
    setReplyCurrentComment(item)
    if (isReplyChildItem === true) {
      setIsCommentAddPlaceholder(`回复 ${item.nickname}：`)
    } else {
      setIsCommentAddPlaceholder('友善是交流的起点')
    }
  }

  const handleCloseCommentAdd = () => {
    setIsOpenCommentAdd(false)
  }

  //添加或编辑
  const handleFinish = (values) => {
    console.log('Success:', values)
    if (type === 'add') {
      Api.h5
        .commentAdd({
          parentUid: '0',
          lessonId: currentLesson.uid,
          remarks: 'h5',
          ...values,
        })
        .then((res) => {
          if (res.code === 200) {
            message.success('发布成功')
            handleSearch({ page: 1, isRefresh: true })
            handleCloseCommentAdd()
          }
        })
    } else if (type === 'reply') {
      const record = replyCurrentComment
      let parentUid
      let replyId
      if (record.parentUid === '0') {
        parentUid = record.uid
      } else {
        parentUid = record.parentUid
        replyId = record.uid
      }
      Api.h5
        .commentAdd({
          parentUid,
          replyId,
          lessonId: currentLesson.uid,
          remarks: 'h5',
          ...values,
        })
        .then((res) => {
          if (res.code === 200) {
            message.success('发布成功')
            handleSearch({ page: 1, isRefresh: true })
            refreshReplyList()
            handleCloseCommentAdd()
          }
        })
    }
  }

  //校验失败
  const handleFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const refreshReplyList = () => {
    const { lessonId, uid } = currentComment

    Api.h5
      .commentGetReplyListById({
        lessonId,
        uid,
      })
      .then((res) => {
        if (res.code === 200) {
          setReplyState({
            dataSource: res.data.list,
            pageSize: 10,
          })
        }
      })
  }

  const handleOpenReplyComment = (item) => {
    setIsReplyCommentVisible(true)
    setCurrentComment(item)
    const { lessonId, uid } = item
    Api.h5
      .commentGetReplyListById({
        lessonId,
        uid,
      })
      .then((res) => {
        if (res.code === 200) {
          setReplyState({
            dataSource: res.data.list,
            pageSize: 10,
          })
        }
      })
  }
  const handleCloseReplyComment = () => {
    setIsReplyCommentVisible(false)
  }

  useEffect(() => {
    if (courseDetail.uid) {
      Api.h5
        .behaviorCourseUserStatus({
          courseUserIds: [courseDetail.userId],
        })
        .then((res) => {
          if (res.code === 200) {
            if (
              Array.isArray(res.data.behaviorList) &&
              res.data.behaviorList.length === 1
            ) {
              const { isFollow, followCount } = res.data.behaviorList[0]
              setIsFollow(isFollow)
              setFollowCount(followCount)
            } else {
              setIsFollow(0)
              setFollowCount(0)
            }
          }
        })
    }
  }, [courseDetail])

  useEffect(() => {
    if (currentLesson.uid) {
      Api.h5
        .behaviorLessonStatus({
          lessonIds: [currentLesson.uid],
        })
        .then((res) => {
          if (res.code === 200) {
            if (
              Array.isArray(res.data.behaviorList) &&
              res.data.behaviorList.length === 1
            ) {
              setIsLike(res.data.behaviorList[0].isLike)
              setIsCollect(res.data.behaviorList[0].isCollect)
              setLikeCount(res.data.behaviorList[0].likeCount)
            } else {
              setIsLike(0)
              setIsCollect(0)
              setLikeCount(0)
            }
          }
        })
      handleSearch({ page: 1, isRefresh: true })
    }
    // eslint-disable-next-line
  }, [currentLesson.uid])

  const getDom = () => {
    return (
      <>
        {
          //#region 操作
          <>
            {typeof isLike === 'number' ? (
              <div className="m-single-play-group-wrap">
                <div className="m-single-play-group-item" onClick={handleShare}>
                  <Icon
                    name="share-cross"
                    className="m-single-play-group-item-icon"
                  ></Icon>
                  <div className="m-single-play-group-item-title">分享</div>
                </div>
                <div
                  className={`m-single-play-group-item ${
                    isCollect ? 'active' : ''
                  }`}
                  onClick={() => handleCollect()}
                >
                  <Icon
                    name={`${isCollect ? 'collect-active' : 'collect'}`}
                    className="m-single-play-group-item-icon"
                  ></Icon>
                  <div className="m-single-play-group-item-title">
                    {isCollect ? '已收藏' : '收藏'}
                  </div>
                </div>
                <div
                  className="m-single-play-group-item"
                  onClick={() => handleOpenComment()}
                >
                  <Icon
                    name="message"
                    className="m-single-play-group-item-icon"
                  ></Icon>
                  <div className="m-single-play-group-item-title">
                    {getFormatCount(total)}
                  </div>
                </div>
                <div
                  className={`m-single-play-group-item ${
                    isLike === 1 ? 'active' : ''
                  }`}
                  onClick={() => handleLike()}
                >
                  <Icon
                    name={`${isLike === 1 ? 'recommend-active' : 'recommend'}`}
                    className="m-single-play-group-item-icon"
                  ></Icon>
                  <div className="m-single-play-group-item-title">
                    {getFormatCount(likeCount)}
                  </div>
                </div>
              </div>
            ) : (
              <Skeleton
                avatar
                paragraph={{
                  rows: 1,
                }}
                active
                className="m-h5-lesson-play-skeleton"
              />
            )}
          </>
          //#endregion
        }
        {
          //#region 评论
          <>
            {isCommentVisible ? (
              <div className="m-single-play-list-wrap">
                <div className="m-single-play-list-header">
                  <Icon
                    name="delete"
                    onClick={handleCloseComment}
                    className="m-single-play-list-header-name-icon"
                  ></Icon>
                  <div className="m-single-play-list-header-name m-ellipsis">
                    评论 {total}
                  </div>
                </div>
                <Divider style={{ margin: '5px 0 0px' }}></Divider>
                {dataSource.length > 0 ? (
                  <div
                    id="scrollableDiv"
                    className="m-single-play-list-comment"
                  >
                    <InfiniteScroll
                      dataLength={dataSource.length}
                      next={handleSearch}
                      refreshFunction={() =>
                        handleSearch({ page: 1, isRefresh: true })
                      }
                      pullDownToRefresh
                      pullDownToRefreshThreshold={50}
                      pullDownToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>
                          &#8595; 下拉刷新
                        </h3>
                      }
                      releaseToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>
                          &#8593; 释放刷新
                        </h3>
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
                      endMessage={<Divider plain>已经到底啦~</Divider>}
                      scrollableTarget="scrollableDiv"
                    >
                      <div id="m-infinite-list" className="m-infinite-list">
                        {dataSource.map((item, index) => (
                          <div
                            key={index}
                            className={`m-single-play-comment-item-wrap ${
                              index < dataSource.length - 1 ? '' : ''
                            }`}
                          >
                            <div className="m-single-play-comment-item">
                              <div className="m-single-play-comment-item-header">
                                <LazyLoad className="m-single-play-comment-item-header-avatar-wrap">
                                  <img
                                    alt="头像"
                                    src={item.avatarCdn}
                                    className="m-single-play-comment-item-header-avatar"
                                  ></img>
                                </LazyLoad>
                                <div className="m-single-play-comment-item-header-nickname m-ellipsis">
                                  {item.nickname}
                                </div>
                                <div onClick={() => handleLikeComment(item)}>
                                  <Icon
                                    name={`${
                                      item.isLike
                                        ? 'recommend-active'
                                        : 'recommend'
                                    }`}
                                    className={`m-single-play-comment-item-header-icon ${
                                      item.isLike ? 'active' : ''
                                    }`}
                                  ></Icon>
                                  <span
                                    className={`m-single-play-comment-item-header-text ${
                                      item.isLike ? 'active' : ''
                                    }`}
                                  >
                                    {getFormatCountForLikeCount(item.likeCount)}
                                  </span>
                                </div>
                              </div>
                              <div className="m-single-play-comment-item-info">
                                <div
                                  className="m-single-play-comment-item-info-content"
                                  onClick={() => handleOpenReplyComment(item)}
                                >
                                  {item.content}
                                </div>
                                <div className="m-single-play-comment-item-info-toolbar">
                                  <span
                                    className="m-single-play-comment-item-info-toolbar-reply-wrap"
                                    onClick={() => handleOpenReplyComment(item)}
                                  >
                                    {getFormatCountForReplyCount(
                                      item.children ? item.children.length : 0
                                    )}
                                    回复
                                    <Icon
                                      name="arrow"
                                      className={`single-play-comment-item-info-toolbar-reply-icon rotate`}
                                    ></Icon>
                                  </span>
                                  <span className="m-single-play-comment-time m-ellipsis">
                                    {getCommentTime(item.createTime)}
                                    {getFrom(item)}
                                  </span>
                                  {item.isCanSoftDelete ? (
                                    <Popconfirm
                                      placement="left"
                                      title={`确定要删除吗？`}
                                      onConfirm={() =>
                                        handleCommentSoftDelete(item)
                                      }
                                      okText="确定"
                                      cancelText="取消"
                                      getPopupContainer={() =>
                                        document.getElementById(
                                          'm-infinite-list'
                                        )
                                      }
                                    >
                                      <Icon
                                        name="delete"
                                        className="m-single-play-comment-delete"
                                      ></Icon>
                                    </Popconfirm>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </InfiniteScroll>
                  </div>
                ) : (
                  <div className="m-single-play-comment-empty-wrap">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                )}
                <div className="m-single-play-comment-footer">
                  <div
                    className="m-single-play-comment-footer-input"
                    onClick={handleOpenCommentAdd}
                  >
                    <Icon
                      name="edit"
                      className="m-single-play-comment-footer-edit"
                    ></Icon>
                    写评论...
                  </div>
                </div>
              </div>
            ) : null}
            {isReplyCommentVisible ? (
              <div className="m-single-play-list-wrap">
                <div className="m-single-play-list-header">
                  <Icon
                    name="arrow"
                    onClick={handleCloseReplyComment}
                    className="m-single-play-list-header-name-icon"
                  ></Icon>
                  <div className="m-single-play-list-header-name-reply m-ellipsis">
                    {replyDataSource.length
                      ? `${replyDataSource.length}条回复`
                      : '暂无回复'}
                  </div>
                </div>
                <Divider style={{ margin: '5px 0 0px' }}></Divider>

                <div
                  className="m-single-play-list-comment"
                  id="m-infinite-list-reply"
                >
                  {/* 楼主 */}
                  <div className={`m-single-play-comment-item-wrap divider`}>
                    <div className="m-single-play-comment-item">
                      <div className="m-single-play-comment-item-header">
                        <LazyLoad className="m-single-play-comment-item-header-avatar-wrap">
                          <img
                            alt="头像"
                            src={currentComment.avatarCdn}
                            className="m-single-play-comment-item-header-avatar"
                          ></img>
                        </LazyLoad>
                        <div className="m-single-play-comment-item-header-nickname m-ellipsis">
                          {currentComment.nickname}
                        </div>
                        <div
                          onClick={() =>
                            handleLikeCommentForReply(currentComment, true)
                          }
                        >
                          <Icon
                            name={`${
                              currentComment.isLike
                                ? 'recommend-active'
                                : 'recommend'
                            }`}
                            className={`m-single-play-comment-item-header-icon ${
                              currentComment.isLike ? 'active' : ''
                            }`}
                          ></Icon>
                          <span
                            className={`m-single-play-comment-item-header-text ${
                              currentComment.isLike ? 'active' : ''
                            }`}
                          >
                            {getFormatCountForLikeCount(
                              currentComment.likeCount
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="m-single-play-comment-item-info">
                        <div className="m-single-play-comment-item-info-content">
                          {currentComment.content}
                        </div>
                        <div className="m-single-play-comment-item-info-toolbar">
                          <span className="m-single-play-comment-time m-ellipsis">
                            {getCommentTime(currentComment.createTime)}
                            {getFrom(currentComment)}
                          </span>
                          {currentComment.isCanSoftDelete ? (
                            <Popconfirm
                              placement="left"
                              title={`确定要删除吗？`}
                              onConfirm={() =>
                                handleCommentSoftDeleteForReply(currentComment)
                              }
                              okText="确定"
                              cancelText="取消"
                              getPopupContainer={() =>
                                document.getElementById('m-infinite-list-reply')
                              }
                            >
                              <Icon
                                name="delete"
                                className="m-single-play-comment-delete m-hide"
                              ></Icon>
                            </Popconfirm>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  {replyDataSource.length > 0 ? (
                    <div>
                      <div className="m-single-play-comment-reply-title">
                        全部回复
                      </div>
                      <div id="replyComment">
                        <InfiniteScroll
                          dataLength={replyDataSource.length}
                          next={refreshReplyList}
                          refreshFunction={() => refreshReplyList()}
                          pullDownToRefresh
                          pullDownToRefreshThreshold={50}
                          pullDownToRefreshContent={
                            <h3 style={{ textAlign: 'center' }}>
                              &#8595; 下拉刷新
                            </h3>
                          }
                          releaseToRefreshContent={
                            <h3 style={{ textAlign: 'center' }}>
                              &#8593; 释放刷新
                            </h3>
                          }
                          hasMore={false}
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
                          endMessage={<Divider plain>已经到底啦~</Divider>}
                          scrollableTarget="replyComment"
                        >
                          <div className="m-infinite-list">
                            {replyDataSource.map((item, index) => (
                              <div
                                key={index}
                                className={`m-single-play-comment-item-wrap ${
                                  index < replyDataSource.length - 1 ? '' : ''
                                }`}
                              >
                                <div className="m-single-play-comment-item">
                                  <div className="m-single-play-comment-item-header">
                                    <LazyLoad className="m-single-play-comment-item-header-avatar-wrap">
                                      <img
                                        alt="头像"
                                        src={item.avatarCdn}
                                        className="m-single-play-comment-item-header-avatar"
                                      ></img>
                                    </LazyLoad>
                                    <div className="m-single-play-comment-item-header-nickname m-ellipsis">
                                      {item.nickname}
                                    </div>
                                    <div
                                      onClick={() =>
                                        handleLikeCommentForReply(item)
                                      }
                                    >
                                      <Icon
                                        name={`${
                                          item.isLike
                                            ? 'recommend-active'
                                            : 'recommend'
                                        }`}
                                        className={`m-single-play-comment-item-header-icon ${
                                          item.isLike ? 'active' : ''
                                        }`}
                                      ></Icon>
                                      <span
                                        className={`m-single-play-comment-item-header-text ${
                                          item.isLike ? 'active' : ''
                                        }`}
                                      >
                                        {getFormatCountForLikeCount(
                                          item.likeCount
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="m-single-play-comment-item-info">
                                    <div className="m-single-play-comment-item-info-content">
                                      {item.replyId ? (
                                        <div className="m-single-play-comment-content-reply">
                                          <span className="m-single-play-comment-content-reply-nickname">
                                            @{item.replyNickname}
                                          </span>
                                          <span className="m-single-play-comment-content-reply-content">
                                            {item.replyContent}
                                          </span>
                                        </div>
                                      ) : null}
                                      {item.content}
                                    </div>
                                    <div className="m-single-play-comment-item-info-toolbar">
                                      <span
                                        className="m-single-play-comment-item-info-toolbar-reply-wrap"
                                        onClick={() =>
                                          handleOpenCommentAddForReply({
                                            item,
                                            isReplyChildItem: true,
                                          })
                                        }
                                      >
                                        {getFormatCountForReplyCount(
                                          item.children
                                            ? item.children.length
                                            : 0
                                        )}
                                        回复
                                        <Icon
                                          name="arrow"
                                          className={`single-play-comment-item-info-toolbar-reply-icon rotate`}
                                        ></Icon>
                                      </span>
                                      <span className="m-single-play-comment-time m-ellipsis">
                                        {getCommentTime(item.createTime)}
                                        {getFrom(item)}
                                      </span>
                                      {item.isCanSoftDelete ? (
                                        <Popconfirm
                                          placement="left"
                                          title={`确定要删除吗？`}
                                          onConfirm={() =>
                                            handleCommentSoftDeleteForReply(
                                              item
                                            )
                                          }
                                          okText="确定"
                                          cancelText="取消"
                                          getPopupContainer={() =>
                                            document.getElementById(
                                              'm-infinite-list-reply'
                                            )
                                          }
                                        >
                                          <Icon
                                            name="delete"
                                            className="m-single-play-comment-delete"
                                          ></Icon>
                                        </Popconfirm>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </InfiniteScroll>
                      </div>
                    </div>
                  ) : (
                    <div className="m-single-play-comment-empty-wrap">
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无回复"
                      />
                    </div>
                  )}
                </div>

                <div className="m-single-play-comment-footer">
                  <div
                    className="m-single-play-comment-footer-input"
                    onClick={() =>
                      handleOpenCommentAddForReply({ item: currentComment })
                    }
                  >
                    <Icon
                      name="edit"
                      className="m-single-play-comment-footer-edit"
                    ></Icon>
                    写评论...
                  </div>
                </div>
              </div>
            ) : null}
            <Drawer
              title="写评论"
              placement="bottom"
              onClose={handleCloseCommentAdd}
              open={isOpenCommentAdd}
              height={500}
              className="m-single-play-comment-add"
              forceRender
              getContainer={false}
            >
              <div className="m-single-play-comment-add-info">
                {isOpenCommentAdd ? (
                  <Form
                    fields={fields}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    scrollToFirstError={true}
                    onFinish={handleFinish}
                    onFinishFailed={handleFinishFailed}
                  >
                    <Form.Item
                      label=""
                      name="content"
                      rules={[
                        {
                          required: true,
                          message: '请输入评论内容！',
                        },
                      ]}
                    >
                      <TextArea
                        showCount
                        maxLength={100}
                        rows={5}
                        ref={inputEl}
                        placeholder={commentAddPlaceholder}
                      />
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{ offset: 0, span: 17 }}
                      className="m-modal-footer"
                    >
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="m-space"
                      >
                        <Icon name="submit" className="m-tool-btn-icon"></Icon>
                        发布
                      </Button>
                    </Form.Item>
                  </Form>
                ) : null}
              </div>
            </Drawer>
          </>
          //#endregion
        }
      </>
    )
  }

  return {
    isFollow,
    followCount,
    behaviorFollow: handleFollow,
    behaviorGetDom: getDom,
  }
}
