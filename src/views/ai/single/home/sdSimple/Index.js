import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import useList from './useList'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { SinglePageHeader, Icon } from '../../../../../components/light'
import useUserInfo from '../../../../../utils/hooks/useUserInfo/Index'
import {
  Image,
  Tag,
  Skeleton,
  Divider,
  Descriptions,
  Button,
  Checkbox,
} from 'antd'
import useInfoDialog from './useInfoDialog'
import InfiniteScroll from 'react-infinite-scroll-component'
import moment from 'moment'
import LazyLoad from 'react-lazy-load'

import 'swiper/css'
import 'swiper/css/pagination'
import './index.css'
import './indexSd.css'

function Index(props) {
  const {
    slidesPerView,
    modelImgList,
    swiperEl,
    previewCurrent,
    routerSearchObj,
    dataSource,
    isHasMore,
    isSending,
    isUpscaleLoading,
    isOnlySeeMe,
    handleImgClick,
    handlePreviewChange,
    handleSearch,
    handleSend,
    handleUpscale,
    handleUpscaleImgVisible,
    handleIsOnlySeeMeCheck,
  } = useList(props)

  const { dialogInfoDom, dialogInfoDrawTheSameStyle } = useInfoDialog({
    ...props,
    isSending,
    handleSend,
  })
  const { userInfoShowModel, userInfoGetDom } = useUserInfo()

  return (
    <div className="m-sd-simple-wrap-box">
      <div className={`m-sd-simple-wrap-box-inner`}>
        <div className="m-sd-simple-wrap">
          <SinglePageHeader
            // goBackPath="/ai/index/home/chatList"
            title={'画同款'}
          ></SinglePageHeader>
          <div className="m-sd-simple-main" id="scrollableDiv">
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
              <div>
                <div className="m-sd-simple-header">
                  <div className="m-sd-simple-header-title-wrap">
                    <div className="m-sd-simple-header-title">
                      {decodeURIComponent(routerSearchObj.name)}
                    </div>
                    <Tag color="#2db7f5">大模型</Tag>
                  </div>
                  <div className="m-sd-simple-header-sub-title-wrap">
                    点击图片右下角的
                    <Icon
                      name="info2"
                      title="画同款"
                      className="m-sd-simple-sub-title-icon"
                    ></Icon>
                    图标画同款
                  </div>
                </div>
                <Swiper
                  slidesPerView={slidesPerView}
                  spaceBetween={10}
                  centeredSlides={true}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className="m-sd-simple-swiper"
                  ref={swiperEl}
                >
                  {Array.isArray(modelImgList) && modelImgList.length > 0 ? (
                    modelImgList.map((item) => (
                      <SwiperSlide
                        key={item.imgUid}
                        className={`m-sd-simple-carousel-item`}
                      >
                        <div className="m-sd-simple-carousel-item-img-wrap">
                          <img
                            src={item.imgUrlCdn}
                            className="m-sd-simple-carousel-item-img"
                            alt="轮播图"
                          ></img>
                        </div>
                        <div className="m-sd-simple-carousel-item-pre-img-wrap">
                          <Image.PreviewGroup
                            items={modelImgList.map((item) => item.imgUrlCdn)}
                            preview={{
                              current: previewCurrent,
                              onChange: (current, prevCurrent) =>
                                handlePreviewChange(current, prevCurrent),
                            }}
                          >
                            <Image
                              width={30}
                              src={item.imgUrlCdn}
                              alt="图片"
                              onClick={() =>
                                handleImgClick({
                                  pictureList: modelImgList,
                                  picItem: item,
                                })
                              }
                            />
                          </Image.PreviewGroup>
                        </div>
                        <Icon
                          name="info2"
                          title="画同款"
                          className="m-sd-simple-info-icon"
                          onClick={() => dialogInfoDrawTheSameStyle(item)}
                        ></Icon>
                      </SwiperSlide>
                    ))
                  ) : (
                    <>
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
                    </>
                  )}
                </Swiper>
                <div className="m-sd-simple-base-box">
                  <div className="m-sd-simple-model-more-info">
                    更多关于【{decodeURIComponent(routerSearchObj.name)}
                    】大模型的信息请访问:
                  </div>

                  {/* eslint-disable-next-line */}
                  <a
                    href={decodeURIComponent(routerSearchObj.link)}
                    target="_blank"
                  >
                    {decodeURIComponent(routerSearchObj.link)}
                  </a>
                </div>
                <div className="m-sd-simple-base-box">
                  {dialogInfoDom()}
                  <Divider></Divider>
                  <div className="m-sd-simple-list-filter">
                    <Checkbox
                      checked={isOnlySeeMe}
                      onChange={(event) => handleIsOnlySeeMeCheck(event)}
                    >
                      只看自己
                    </Checkbox>
                  </div>
                </div>

                <div className="m-sd-simple-base-box">
                  {dataSource.map((item, index) => (
                    <div key={item.uid}>
                      <div>
                        {item.pictureList.map(
                          (pictureListItem, pictureListItemIndex) => {
                            let resultIndex
                            if (
                              Array.isArray(item.info.upscaleImgList) &&
                              item.info.upscaleImgList.length >= 0
                            ) {
                              resultIndex = item.info.upscaleImgList.findIndex(
                                (upscaleImgListItem) =>
                                  upscaleImgListItem.originalUrl ===
                                  item.info.response.output[
                                    pictureListItemIndex
                                  ]
                              )
                            }

                            return (
                              <div key={pictureListItemIndex}>
                                <div className="m-sd-simple-ai-img-wrap-wrap">
                                  <LazyLoad className="m-sd-simple-ai-img-wrap">
                                    <Image
                                      width={
                                        window.innerWidth > 450 ? 200 : 150
                                      }
                                      src={pictureListItem}
                                    />
                                  </LazyLoad>

                                  {Array.isArray(item.info.upscaleImgList) &&
                                  item.info.upscaleImgList.length >= 0 &&
                                  resultIndex >= 0 ? (
                                    <div
                                      className={`m-sd-simple-upscale-img-wrap ${
                                        item.info.upscaleImgList[resultIndex]
                                          ?.checked === true
                                          ? 'active'
                                          : 'none'
                                      }`}
                                    >
                                      <LazyLoad
                                        className={`m-sd-simple-ai-img-wrap`}
                                      >
                                        <Image
                                          width={
                                            window.innerWidth > 450 ? 200 : 150
                                          }
                                          src={
                                            item.info.upscaleImgList[
                                              resultIndex
                                            ].upscaleImgUrl
                                          }
                                        />
                                      </LazyLoad>
                                    </div>
                                  ) : null}
                                </div>
                                <div className="m-sd-simple-img-toolbar">
                                  {Array.isArray(item.info.upscaleImgList) &&
                                  item.info.upscaleImgList.length >= 0 &&
                                  resultIndex >= 0 ? (
                                    <div>
                                      {localStorage.getItem('username') ===
                                      '1183391880@qq.com' ? (
                                        <Button
                                          type="primary"
                                          className="m-space"
                                          loading={isUpscaleLoading}
                                          onClick={() =>
                                            handleUpscale({
                                              item,
                                              pictureListItemIndex,
                                              index,
                                              resultIndex: pictureListItemIndex,
                                              originalUrl:
                                                item.info.response.output[
                                                  pictureListItemIndex
                                                ],
                                            })
                                          }
                                        >
                                          转高清
                                        </Button>
                                      ) : null}
                                      <Checkbox
                                        checked={
                                          item.info.upscaleImgList[resultIndex]
                                            ?.checked === true
                                            ? true
                                            : false
                                        }
                                        onChange={(event) =>
                                          handleUpscaleImgVisible({
                                            index,
                                            resultIndex,
                                            event,
                                          })
                                        }
                                      >
                                        显示高清图
                                      </Checkbox>
                                    </div>
                                  ) : (
                                    <Button
                                      type="primary"
                                      className="m-space"
                                      loading={isUpscaleLoading}
                                      onClick={() =>
                                        handleUpscale({
                                          item,
                                          pictureListItemIndex,
                                          index,
                                          resultIndex: pictureListItemIndex,
                                          originalUrl:
                                            item.info.response.output[
                                              pictureListItemIndex
                                            ],
                                        })
                                      }
                                    >
                                      转高清
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          }
                        )}
                        {item.pictureList.length === 0 ? (
                          <div className="m-sd-simple-ai-img-wrap"></div>
                        ) : null}
                      </div>
                      <Descriptions
                        title={null}
                        column={3}
                        items={[
                          {
                            key: '1',
                            label: '提示词',
                            children: item.info.prompt,
                            span: 3,
                          },
                          {
                            key: '2',
                            label: '反向提示词',
                            children: item.info.negative_prompt,
                            span: 3,
                          },
                          {
                            key: '3',
                            label: '大模型ID',
                            children: item.info.model_id,
                            span: 3,
                          },
                          {
                            key: 'modelName',
                            label: '大模型名称',
                            children: item.info.modelName,
                            span: 3,
                          },
                          {
                            key: 'lora_model',
                            label: 'Lora ID',
                            children: item.info.lora_model,
                            span: 3,
                          },
                          {
                            key: 'loraName',
                            label: 'Lora名称',
                            children: item.info.loraName,
                            span: 3,
                          },
                          {
                            key: 'lora_scale',
                            label: 'lora权重',
                            children: item.info.lora_scale,
                            span: 1,
                          },
                          {
                            key: 'width',
                            label: '宽度',
                            children: item.info.width,
                            span: 1,
                          },
                          {
                            key: 'height',
                            label: '高度',
                            children: item.info.height,
                            span: 1,
                          },
                          {
                            key: 'num_inference_steps',
                            label: '噪声优化的次数',
                            children: item.info.num_inference_steps,
                            span: 2,
                          },
                          {
                            key: 'guidance_scale',
                            label: 'guidance_scale',
                            children: item.info.guidance_scale,
                            span: 1,
                          },
                          {
                            key: 'scheduler',
                            label: 'scheduler',
                            children: item.info.scheduler,
                            span: 3,
                          },
                          {
                            key: 'nickname',
                            label: '作者',
                            children: (
                              <div className="m-sd-simple-nickname-wrap">
                                <img
                                  className="m-sd-simple-user-avatar"
                                  src={item.user.avatarCdn}
                                  alt="头像"
                                  onClick={() =>
                                    userInfoShowModel({
                                      uid: item.user.uid,
                                    })
                                  }
                                ></img>
                                <div
                                  onClick={() =>
                                    userInfoShowModel({
                                      uid: item.user.uid,
                                    })
                                  }
                                >
                                  {item.user.nickname}
                                </div>
                              </div>
                            ),
                            span: 3,
                          },
                          {
                            key: 'createTime',
                            label: '创建时间',
                            children: moment(item.createTime - 0).format(
                              'YYYY-MM-DD HH:mm:ss'
                            ),
                            span: 3,
                          },
                        ]}
                      />
                      <Divider></Divider>
                    </div>
                  ))}
                </div>
              </div>
            </InfiniteScroll>
          </div>
          {userInfoGetDom()}
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
