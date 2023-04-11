const urls = {
  //#region 用户
  userUserlist: '/api/light/user/userlist',
  userAppLogin: '/api/light/user/appLogin',
  userAiLogin: '/api/light/user/aiLogin',
  userAiAdd: '/api/light/user/aiAdd',
  userAiGuestAdd: '/api/light/user/aiGuestAdd',
  userLogout: '/api/light/user/logout',
  userGetInfo: '/api/light/user/getInfo',
  userGetUserInfoById: '/api/light/user/getUserInfoById',
  userAppEdit: '/api/light/user/appEdit',
  userCaptcha: '/api/light/user/captcha',
  userSendEmailCode: '/api/light/user/sendEmailCode',
  userEditPassword: '/api/light/user/editPassword',
  //#endregion

  //#region 兑换
  exchangeCodeAppUse: '/api/light/exchangeCode/appUse',
  //#endregion   
  
  //#region 课节
  lessonSearch: '/api/light/lesson/search',
  lessonSearchForVideoQuestion: '/api/light/lesson/searchForVideoQuestion',
  lessonAppGetById: '/api/light/lesson/appGetById',
  lessonAppGetByIdForSelect: '/api/light/lesson/appGetByIdForSelect',
  //#endregion    

  //#region 配置
  configGetHomeTabs: '/api/light/config/getHomeTabs',
  configGetMeData: '/api/light/config/getMeData',
  //#endregion

  //#region 推荐
  recommendGetNormalList: '/api/light/home/recommend/getNormalList',
  //#endregion     

  //#region 分类
  categoryGetData: '/api/light/home/category/getData',
  //#endregion   
  
  //#region 行为
  behaviorLessonAction: '/api/light/behavior/lessonAction',
  behaviorLessonHistoryAction: '/api/light/behavior/lessonHistoryAction',
  behaviorLessonStatus: '/api/light/behavior/lessonStatus',
  behaviorLessonSearch: '/api/light/behavior/lessonSearch',
  behaviorFollowAction: '/api/light/behavior/followAction',
  behaviorCourseUserStatus: '/api/light/behavior/courseUserStatus',
  behaviorUserSearch: '/api/light/behavior/userSearch',
  behaviorFansSearch: '/api/light/behavior/fansSearch',  
  behaviorAppInviterExchangeHistorySearch: '/api/light/behavior/appInviterExchangeHistorySearch',      

  //#endregion     
  
  //#region 上传
  uploadGetTokenForH5: '/api/light/upload/getTokenForH5',
  //#endregion    

  //#region 评论
  commentSearch: '/api/light/comment/search',
  commentGetReplyListById: '/api/light/comment/getReplyListById',
  commentAdd: '/api/light/comment/add',
  commentLike: '/api/light/comment/like',
  commentSoftDelete: '/api/light/comment/softDelete',
  //#endregion     

  //#region 对话
  talkAppSearch: '/api/light/talk/appSearch',
  talkAdminSearch: '/api/light/talk/adminSearch',
  talkDelete: '/api/light/talk/delete',
  talkEdit: '/api/light/talk/edit',
  //#endregion  
  
  //#region 聊天记录
  chatSearch: '/api/light/chat/search',
  chatAdd: '/api/light/chat/add',
  chatSearchForRealPeople: '/api/light/chat/searchForRealPeople',
  chatAddForRealPeople: '/api/light/chat/addForRealPeople',
  chatListSearch: '/api/light/chat/listSearch',
  chatDelete: '/api/light/chat/delete',
  chatEdit: '/api/light/chat/edit',
  chatAddAudio: '/api/light/chat/addAudio',

  //#endregion 
}

export default urls
