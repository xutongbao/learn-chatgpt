import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Skeleton, Divider } from 'antd'
import useList from './useList'
import useBehavior from './useBehavior'
import LazyLoad from 'react-lazy-load'
import { Icon } from '../../../../components/light'
import './index.css'

function Index(props) {
  const {
    isLoading,
    isPlaying,
    courseDetail,
    lessonList,
    currentLesson,
    userStatus,
    isCategoryMoreVisible,
    handleSelectLesson,
    handleBack,
    formatLessonTime,
    handleCategoryMoreVisible,
  } = useList(props)

  const { isFollow, followCount, behaviorFollow, behaviorGetDom } = useBehavior({
    courseDetail,
    currentLesson,
    ...props,
  })

  return (
    <div className="m-single-wrap">
      <div className="m-single-inner">
        {isLoading ? (
          <Skeleton
            avatar
            paragraph={{
              rows: 4,
            }}
            active
            className="m-h5-lesson-play-skeleton"
          />
        ) : (
          <>
            <div className="m-single-play-player-wrap">
              <div
                id="mse"
                className={`m-single-play-player ${
                  process.env.REACT_APP_MODE === 'dev' ? 'm-hide' : ''
                }`}
              ></div>
              {userStatus.isHasPlayAuth !== true &&
              currentLesson.lessonType === '2' ? (
                <div
                  className="m-single-play-player-img"
                  style={{
                    backgroundImage: `url(${currentLesson.coverImageCnd})`,
                  }}
                ></div>
              ) : null}
              <Icon
                name="arrow"
                className="m-single-play-back"
                onClick={handleBack}
              ></Icon>
              {currentLesson.lessonType === '2' ? (
                <div className="m-single-play-list-item-vip">
                  <Icon
                    name="vip"
                    className="m-single-play-list-item-vip-icon"
                  ></Icon>
                </div>
              ) : null}
              {isPlaying === false ? (
                <div className="m-single-play-info-lesson-time">
                  {formatLessonTime(currentLesson.lessonTime)}
                </div>
              ) : null}
            </div>
            <div className="m-single-play-info-wrap-wrap">
              <div className={`m-single-play-info-wrap`}>
                <div className="m-single-play-info">
                  <div className="m-single-play-info-course-wrap">
                    <img
                      className="m-single-play-info-avatar"
                      src={courseDetail.userAvatarCnd}
                      alt="头像"
                    ></img>
                    <div className="m-single-play-info-course-user-wrap">
                      <div className='m-single-play-info-course-user-name m-ellipsis'> {courseDetail.nickname}</div>
                      <div className='m-single-play-info-course-user-fans-count'>{followCount}粉丝</div>
                    </div>
                    <div className="m-single-play-info-course-btn-wrap">
                      {typeof isFollow === 'number' ? (
                        <span
                          className={`m-single-play-info-course-btn ${
                            isFollow === 1 ? 'followed' : 'unfollow'
                          } `}
                          onClick={behaviorFollow}
                        >
                          {isFollow === 1 ? '已关注' : '关注'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className="m-single-play-info-lesson-name"
                    title={currentLesson.name}
                  >
                    {currentLesson.name}
                  </div>
                  {behaviorGetDom()}
                  <Divider style={{ margin: '10px 0 0' }}></Divider>
                </div>
                <div className="m-single-play-category-wrap">
                  <div className="m-single-play-category-header">
                    <div className="m-single-play-category-header-course-name">
                      {courseDetail.name}
                    </div>
                    <div
                      className="m-single-play-category-header-text"
                      onClick={handleCategoryMoreVisible}
                    >
                      共{lessonList.length}个视频
                      <Icon
                        name="arrow"
                        className="m-single-play-category-more-icon"
                      ></Icon>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="m-single-play-list-h">
                    {lessonList.map((item) => (
                      <div
                        key={item.uid}
                        id={`${item.uid}-h`}
                        className={`m-single-play-list-item-h ${
                          currentLesson.uid === item.uid ? 'active' : ''
                        }`}
                        onClick={() => handleSelectLesson(item)}
                      >
                        <LazyLoad className="m-single-play-list-item-img-wrap">
                          <>
                            <img
                              src={item.coverImageCnd}
                              className="m-single-play-list-item-img"
                              alt="课节"
                            ></img>
                            <div className="m-single-play-info-order-no">
                              {item.orderNo}
                            </div>
                            {item.lessonType === '2' ? (
                              <div className="m-single-play-list-item-vip">
                                <Icon
                                  name="vip"
                                  className="m-single-play-list-item-vip-icon"
                                ></Icon>
                              </div>
                            ) : null}
                            {currentLesson.uid === item.uid ? (
                              <div className="m-single-play-info-playing"></div>
                            ) : null}
                            <div className="m-single-play-info-lesson-time">
                              {formatLessonTime(item.lessonTime)}
                            </div>
                          </>
                        </LazyLoad>
                        <div className="m-single-play-list-item-info-h">
                          <div
                            className="m-single-play-list-name-h"
                            title={item.name}
                          >
                            <div className="m-single-play-list-name-inner-h">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {isCategoryMoreVisible ? (
                <div className="m-single-play-list-wrap">
                  <div className="m-single-play-list-header">
                    <Icon
                      name="delete"
                      onClick={handleCategoryMoreVisible}
                      className="m-single-play-list-header-name-icon"
                    ></Icon>
                    <div className="m-single-play-list-header-name m-ellipsis">
                      {courseDetail.name}
                    </div>
                  </div>
                  <Divider style={{ margin: '5px 0 0px' }}></Divider>
                  <div className="m-single-play-list">
                    {lessonList.map((item) => (
                      <div
                        key={item.uid}
                        id={item.uid}
                        className={`m-single-play-list-item ${
                          currentLesson.uid === item.uid ? 'active' : ''
                        }`}
                        onClick={() => handleSelectLesson(item)}
                      >
                        <LazyLoad className="m-single-play-list-item-img-wrap">
                          <>
                            <img
                              src={item.coverImageCnd}
                              className="m-single-play-list-item-img"
                              alt="课节"
                            ></img>
                            <div className="m-single-play-info-order-no">
                              {item.orderNo}
                            </div>
                            {item.lessonType === '2' ? (
                              <div className="m-single-play-list-item-vip">
                                <Icon
                                  name="vip"
                                  className="m-single-play-list-item-vip-icon"
                                ></Icon>
                              </div>
                            ) : null}
                            {currentLesson.uid === item.uid ? (
                              <div className="m-single-play-info-playing"></div>
                            ) : null}
                            <div className="m-single-play-info-lesson-time">
                              {formatLessonTime(item.lessonTime)}
                            </div>
                          </>
                        </LazyLoad>
                        <div className="m-single-play-list-item-info">
                          <div
                            className="m-single-play-list-name"
                            title={item.name}
                          >
                            <div className="m-single-play-list-name-inner">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {}
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
