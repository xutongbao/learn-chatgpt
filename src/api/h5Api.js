import urls from './urls'
import { common } from './common'

//common函数传递的参数添加 contentType: 'application/x-www-form-urlencoded' 即可改变post请求参数传递的格式
const Api = {
  //#region 用户
  userUserlist: (data) => common({ url: urls.h5.userUserlist, data, method: 'post', isLoading: false }),
  userAppLogin: (data) => common({ url: urls.h5.userAppLogin, data, method: 'post', assignParam: false, isNotNeedToken: true}),
  userAiLogin: (data, isLoading = true) => common({ url: urls.h5.userAiLogin, data, method: 'post', assignParam: false, isNotNeedToken: true, isLoading}),
  userAiAdd: (data) => common({ url: urls.h5.userAiAdd, data, method: 'post' }),
  userAiGuestAdd: (data, isLoading = true) => common({ url: urls.h5.userAiGuestAdd, data, method: 'post', isLoading }),
  userLogout: (data) => common({ url: urls.h5.userLogout, data, method: 'post' }),
  userGetInfo: ({ isLoading = true }) => common({ url: urls.h5.userGetInfo, data: {}, method: 'post', isLoading }),
  userGetUserInfoById: (data) => common({ url: urls.h5.userGetUserInfoById, data, method: 'post' }),
  userAppEdit: (data) => common({ url: urls.h5.userAppEdit, data, method: 'post' }),
  userCaptcha: (data) => common({ url: urls.h5.userCaptcha, data, method: 'post' }),
  userSendEmailCode: (data) => common({ url: urls.h5.userSendEmailCode, data, method: 'post' }),
  userEditPassword: (data) => common({ url: urls.h5.userEditPassword, data, method: 'post' }),

  //#endregion

  //#region 兑换
  exchangeCodeAppUse: (data) => common({ url: urls.h5.exchangeCodeAppUse, data, method: 'post' }),
  //#endregion    
  
  //#region 课节
  lessonSearch: (data) => common({ url: urls.h5.lessonSearch, data, method: 'post' }),
  lessonSearchForVideoQuestion: (data) => common({ url: urls.h5.lessonSearchForVideoQuestion, data, method: 'post' }),
  lessonAppGetById: (data) => common({ url: urls.h5.lessonAppGetById, data, method: 'post' }),
  lessonAppGetByIdForSelect: (data) => common({ url: urls.h5.lessonAppGetByIdForSelect, data, method: 'post' }),
  //#endregion     

  //#region 配置
  configGetHomeTabs: (data) => common({ url: urls.h5.configGetHomeTabs, data, method: 'post', isLoading: false  }),
  configGetMeData: (data) => common({ url: urls.h5.configGetMeData, data, method: 'post' }),

  //#endregion  

  //#region 推荐
  recommendGetNormalList: (data) => common({ url: urls.h5.recommendGetNormalList, data, method: 'post', isLoading: false, source: 'h5' }),
  //#endregion   

  //#region 分类
  categoryGetData: (data) => common({ url: urls.h5.categoryGetData, data, method: 'post' }),
  //#endregion  

  //#region 行为
  behaviorLessonAction: (data) => common({ url: urls.h5.behaviorLessonAction, data, method: 'post', isLoading: false }),
  behaviorLessonHistoryAction: (data) => common({ url: urls.h5.behaviorLessonHistoryAction, data, method: 'post', isLoading: false }),
  behaviorLessonStatus: (data) => common({ url: urls.h5.behaviorLessonStatus, data, method: 'post', isLoading: false }),
  behaviorLessonSearch: (data) => common({ url: urls.h5.behaviorLessonSearch, data, method: 'post', isLoading: false }),
  behaviorFollowAction: (data) => common({ url: urls.h5.behaviorFollowAction, data, method: 'post', isLoading: false }),
  behaviorCourseUserStatus: (data) => common({ url: urls.h5.behaviorCourseUserStatus, data, method: 'post', isLoading: false }),
  behaviorUserSearch: (data) => common({ url: urls.h5.behaviorUserSearch, data, method: 'post' }),
  behaviorFansSearch: (data) => common({ url: urls.h5.behaviorFansSearch, data, method: 'post' }),
  behaviorAppInviterExchangeHistorySearch: (data) => common({ url: urls.h5.behaviorAppInviterExchangeHistorySearch, data, method: 'post' }),   

  //#endregion     
  
  //#region 上传
  uploadGetTokenForH5: (data) => common({ url: urls.h5.uploadGetTokenForH5, data, method: 'post' }),
  //#endregion   
  
  //#region 评论
  commentSearch: (data) => common({ url: urls.h5.commentSearch, data, method: 'post', isLoading: false }),
  commentGetReplyListById: (data) => common({ url: urls.h5.commentGetReplyListById, data, method: 'post' }),
  commentAdd: (data) => common({ url: urls.h5.commentAdd, data, method: 'post' }),
  commentLike: (data) => common({ url: urls.h5.commentLike, data, method: 'post' }),
  commentSoftDelete: (data) => common({ url: urls.h5.commentSoftDelete, data, method: 'post' }),  
  //#endregion    

  //#region 对话
  talkAppSearch: (data) => common({ url: urls.h5.talkAppSearch, data, method: 'post' }),
  talkAdminSearch: (data) => common({ url: urls.h5.talkAdminSearch, data, method: 'post' }),
  talkDelete: (data) => common({ url: urls.h5.talkDelete, data, method: 'post' }),
  talkEdit: (data) => common({ url: urls.h5.talkEdit, data, method: 'post' }),
  //#endregion   

  //#region 聊天记录
  chatSearch: (data, isLoading = true) => common({ url: urls.h5.chatSearch, data, method: 'post', isLoading }),
  chatAdd: (data) => common({ url: urls.h5.chatAdd, data, method: 'post', isLoading: false  }),
  chatSearchForRealPeople: (data) => common({ url: urls.h5.chatSearchForRealPeople, data, method: 'post' }),
  chatAddForRealPeople: (data) => common({ url: urls.h5.chatAddForRealPeople, data, method: 'post' }),
  chatListSearch: (data) => common({ url: urls.h5.chatListSearch, data, method: 'post', isLoading: false }),
  chatDelete: (data) => common({ url: urls.h5.chatDelete, data, method: 'post' }),
  chatEdit: (data) => common({ url: urls.h5.chatEdit, data, method: 'post' }),
  chatAddAudio: (data) => common({ url: urls.h5.chatAddAudio, data, method: 'post', isLoading: false }),
  chatGoogleSearch: (data) => common({ url: urls.h5.chatGoogleSearch, data, method: 'post' }),

  //#endregion   
  
  //#region words
  wordsAppSearch: (data) => common({ url: urls.h5.wordsAppSearch, data, method: 'post' }),
  wordsGetById: (data) => common({ url: urls.h5.wordsGetById, data, method: 'post' }),

  //#endregion   
}

export default Api
