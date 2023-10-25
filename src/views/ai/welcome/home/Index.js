import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { SinglePageHeader } from '../../../../components/light'
import { Button, Skeleton } from 'antd'
import LazyLoad from 'react-lazy-load'

import 'swiper/css'
import 'swiper/css/pagination'
import './index.css'

function Index(props) {
  const {
    config,
    models,
    userInfo,
    routerSearchObj,
    imgList,
    handleJumpPage,
    handleTagClick,
    handleModelClick,
    handleImgDrawSameStyleClick,
  } = useList(props)
  return (
    <div className="m-welcome-wrap-box">
      <div className={`m-welcome-wrap-box-inner`}>
        <div className="m-welcome-wrap">
          {typeof routerSearchObj.type === 'undefined' ||
          routerSearchObj.type === '0' ? (
            <div className="m-welcome-header">
              <div className="m-welcome-header-title">学习</div>
              <div className="m-welcome-header-info"></div>
              <div className="m-welcome-header-right">
                {userInfo.avatarCdn ? (
                  <img
                    src={userInfo.avatarCdn}
                    className="m-welcome-avatar"
                    onClick={() => handleJumpPage('/ai/index/home/chatList')}
                    alt="头像"
                  ></img>
                ) : (
                  <>
                    <Button
                      type="link"
                      className="m-welcome-btn-text"
                      onClick={() => handleJumpPage('/ai/login')}
                    >
                      登录
                    </Button>
                    <Button
                      type="link"
                      className="m-welcome-btn-text"
                      onClick={() => handleJumpPage('/ai/register')}
                    >
                      注册
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <SinglePageHeader
              // goBackPath="/ai/index/home/chatList"
              title={'首页&AI绘画'}
            ></SinglePageHeader>
          )}

          <Swiper
            slidesPerView={1.1}
            spaceBetween={10}
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            initialSlide={1}
            className="mySwiper"
          >
            {Array.isArray(config.carousel) && config.carousel.length > 0 ? (
              config.carousel.map((item) => (
                <SwiperSlide
                  key={item.id}
                  className={`m-welcome-carousel-item ${
                    typeof routerSearchObj.type === 'undefined' ||
                    routerSearchObj.type === '0'
                      ? 'withBorder'
                      : ''
                  }`}
                >
                  <div className="m-welcome-carousel-item-info">
                    <div
                      className="m-welcome-carouse-item-tag"
                      onClick={() => handleTagClick(item)}
                    >
                      {item.tag}
                    </div>
                    <div className="m-welcome-carouse-item-title">
                      {item.title}
                    </div>
                    <div className="m-welcome-carouse-item-sub-title">
                      {item.subTitle}
                    </div>
                  </div>
                  <div className="m-welcome-carousel-item-img-wrap">
                    <div
                      className="m-welcome-carousel-item-img"
                      style={{ backgroundImage: `url(${item.imgUrl})` }}
                    ></div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <Skeleton
                  avatar
                  paragraph={{
                    rows: 7,
                  }}
                  active
                  className="m-h5-lesson-play-skeleton"
                />
              </SwiperSlide>
            )}
          </Swiper>
          {/* models */}
          <div className="m-welcome-card-wrap">
            <div className="m-welcome-card-header-wrap">
              <div className="m-welcome-card-title-wrap">
                <div className="m-welcome-card-title">绘图大模型</div>
                <div
                  className="m-welcome-card-more"
                  onClick={() => handleJumpPage('/welcome/home/modelList')}
                >
                  查看全部
                </div>
              </div>
              <div className="m-welcome-card-sub-title">向左滑动 查看更多</div>
            </div>
            <Swiper
              slidesPerView={1.1}
              spaceBetween={10}
              centeredSlides={true}
              pagination={false}
              modules={[Pagination]}
              className="mySwiper"
            >
              {Array.isArray(models) && models.length > 0 ? (
                models.map((item) => (
                  <SwiperSlide
                    key={item.first.id}
                    className={`m-welcome-card-item`}
                  >
                    <div className={`m-welcome-card-item-row`}>
                      <LazyLoad className="m-welcome-card-item-img-wrap">
                        <img
                          src={item.first.avatar}
                          className="m-welcome-card-item-img"
                          alt="头像"
                        ></img>
                      </LazyLoad>
                      <div className="m-welcome-card-item-info-wrap withBorder">
                        <div className="m-welcome-card-item-info">
                          <div
                            className="m-welcome-card-item-title m-ellipsis"
                            title={item.first.name}
                          >
                            {item.first.name}
                          </div>
                          <div className="m-welcome-card-item-sub-title">
                            {item.first.id}
                          </div>
                        </div>
                        <div
                          className="m-welcome-card-item-btn"
                          onClick={() => handleModelClick(item.first)}
                        >
                          画同款
                        </div>
                      </div>
                    </div>
                    {item.second ? (
                      <div className={`m-welcome-card-item-row`}>
                        <LazyLoad className="m-welcome-card-item-img-wrap">
                          <img
                            src={item.second.avatar}
                            className="m-welcome-card-item-img"
                            alt="头像"
                          ></img>
                        </LazyLoad>
                        <div className="m-welcome-card-item-info-wrap withBorder">
                          <div className="m-welcome-card-item-info">
                            <div
                              className="m-welcome-card-item-title m-ellipsis"
                              title={item.second.name}
                            >
                              {item.second.name}
                            </div>
                            <div className="m-welcome-card-item-sub-title">
                              {item.second.id}
                            </div>
                          </div>
                          <div
                            className="m-welcome-card-item-btn"
                            onClick={() => handleModelClick(item.second)}
                          >
                            画同款
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {item.third ? (
                      <div className={`m-welcome-card-item-row`}>
                        <LazyLoad className="m-welcome-card-item-img-wrap">
                          <img
                            src={item.third.avatar}
                            className="m-welcome-card-item-img"
                            alt="头像"
                          ></img>
                        </LazyLoad>
                        <div className="m-welcome-card-item-info-wrap">
                          <div className="m-welcome-card-item-info">
                            <div
                              className="m-welcome-card-item-title m-ellipsis"
                              title={item.third.name}
                            >
                              {item.third.name}
                            </div>
                            <div className="m-welcome-card-item-sub-title">
                              {item.third.id}
                            </div>
                          </div>
                          <div
                            className="m-welcome-card-item-btn"
                            onClick={() => handleModelClick(item.third)}
                          >
                            画同款
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <Skeleton
                    avatar
                    paragraph={{
                      rows: 7,
                    }}
                    active
                    className="m-h5-lesson-play-skeleton"
                  />
                </SwiperSlide>
              )}
            </Swiper>
          </div>
          <div className="m-welcome-card-wrap">
            <div className="m-welcome-card-header-wrap">
              <div className="m-welcome-card-title-wrap">
                <div className="m-welcome-card-title">AI绘画作品展示</div>
                <div
                  className="m-welcome-card-more"
                  onClick={() => handleJumpPage('/welcome/home/imgList')}
                >
                  查看全部
                </div>
              </div>
              <div className="m-welcome-card-sub-title">向左滑动 查看更多</div>
            </div>
            <Swiper
              slidesPerView={1.1}
              spaceBetween={10}
              centeredSlides={true}
              pagination={false}
              modules={[Pagination]}
              className="mySwiper"
            >
              {Array.isArray(imgList) && imgList.length > 0 ? (
                imgList.map((item) => (
                  <SwiperSlide
                    key={item.first.imgUid}
                    className={`m-welcome-card-item`}
                  >
                    <div className='m-welcome-img-row-wrap'>
                      <div className={`m-welcome-img-row`}>
                        <LazyLoad className="m-welcome-img-lazy-load first">
                          <div className="m-welcome-img-warp">
                            <img
                              src={item.first.imgUrlCdn}
                              className="m-welcome-img"
                              alt="图片"
                              onClick={() =>
                                handleImgDrawSameStyleClick(item.first)
                              }
                            ></img>
                          </div>
                        </LazyLoad>
                        <LazyLoad className="m-welcome-img-lazy-load">
                          <div className="m-welcome-img-warp">
                            <img
                              src={item.second.imgUrlCdn}
                              className="m-welcome-img"
                              alt="图片"
                              onClick={() =>
                                handleImgDrawSameStyleClick(item.second)
                              }
                            ></img>
                          </div>
                        </LazyLoad>
                      </div>
                      {/* <div className={`m-welcome-img-row`}>
                        <LazyLoad className="m-welcome-img-lazy-load">
                          <div className="m-welcome-img-warp">
                            <img
                              src={item.third.imgUrlCdn}
                              className="m-welcome-img"
                              alt="图片"
                              onClick={() =>
                                handleImgDrawSameStyleClick(item.third)
                              }
                            ></img>
                          </div>
                        </LazyLoad>
                        <LazyLoad className="m-welcome-img-lazy-load">
                          <div className="m-welcome-img-warp">
                            <img
                              src={item.fourth.imgUrlCdn}
                              className="m-welcome-img"
                              alt="图片"
                              onClick={() =>
                                handleImgDrawSameStyleClick(item.fourth)
                              }
                            ></img>
                          </div>
                        </LazyLoad>
                      </div> */}
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <Skeleton
                    avatar
                    paragraph={{
                      rows: 7,
                    }}
                    active
                    className="m-h5-lesson-play-skeleton"
                  />
                </SwiperSlide>
              )}
            </Swiper>
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
