import { lazy } from 'react'
import AIIndex from '../../views/ai/index/Index'

const extraRouter = []

const h5Router = [
  {
    title: 'AI课节播放',
    path: '/ai/single/play',
    component: lazy(() => import('../../views/ai/single/play/Index')),
  },
  {
    title: '二级路由',
    path: '/ai/index',
    component: AIIndex,
  },
  {
    title: '登录',
    path: '/ai/login',
    component: lazy(() => import('../../views/ai/login/Login')),
  },
  {
    title: '注册',
    path: '/ai/register',
    component: lazy(() => import('../../views/ai/register/Register')),
  },
  {
    title: '忘记密码',
    path: '/ai/forgetPassword',
    component: lazy(() => import('../../views/ai/forgetPassword/Index')),
  },
  {
    title: '单聊',
    path: '/ai/chat',
    component: lazy(() => import('../../views/ai/chat/Index')),
  },
  {
    title: 'gpt-4',
    path: '/ai/chat-gpt-4',
    component: lazy(() => import('../../views/ai/chat/Index')),
  },
  {
    title: '画图',
    path: '/single/home/sd',
    component: lazy(() => import('../../views/ai/single/home/sd/Index')),
  },
  {
    title: '画图',
    path: '/single/home/sdSimple',
    component: lazy(() => import('../../views/ai/single/home/sdSimple/Index')),
  },
  {
    title: '我的',
    path: '/ai/single/me',
    component: lazy(() => import('../../views/ai/single/me/Index')),
  },
  {
    title: '群聊',
    path: '/ai/groupChat',
    component: lazy(() => import('../../views/ai/chat/Index')),
  },
  {
    title: '真人群聊',
    path: '/ai/realPeopleGroupChat',
    component: lazy(() => import('../../views/ai/realPeopleGroupChat/Index')),
  },
  {
    title: '课程',
    path: '/ai/course',
    component: lazy(() => import('../../views/ai/course/Index')),
  },
  {
    title: '识字',
    path: '/ai/words',
    component: lazy(() => import('../../views/ai/words/Index')),
  },
  {
    title: '识字-详情',
    path: '/ai/wordsDetail',
    component: lazy(() => import('../../views/ai/wordsDetail/Index')),
  },
  {
    title: '入群',
    path: '/ai/joinGroup',
    component: lazy(() => import('../../views/ai/joinGroup/Index')),
  },
  {
    title: '联系我们',
    path: '/ai/contactUs',
    component: lazy(() => import('../../views/ai/contactUs/Index')),
  },
  {
    title: '兑换',
    path: '/ai/exchange',
    component: lazy(() => import('../../views/ai/exchange/Index')),
  },
  {
    title: 'Google',
    path: '/single/home/google',
    component: lazy(() => import('../../views/ai/single/home/google/Index')),
  },
  {
    title: '文件列表',
    path: '/single/home/fileList',
    component: lazy(() => import('../../views/ai/single/home/fileList/Index')),
  },
  {
    title: '真人私聊',
    path: '/single/home/realChat',
    component: lazy(() => import('../../views/ai/single/home/realChat/Index')),
  },
  {
    title: '下载',
    path: '/single/download',
    component: lazy(() => import('../../views/ai/single/download/Index')),
  },
  {
    title: '监控',
    path: '/single/monitor',
    component: lazy(() => import('../../views/ai/single/monitor/Index')),
  },
  {
    title: '测试1',
    path: '/single/demo/test1',
    component: lazy(() => import('../../views/ai/single/demo/test1/Index')),
  },
  {
    title: '测试socket',
    path: '/single/demo/socket',
    component: lazy(() => import('../../views/ai/single/demo/socket/Index')),
  },
  //#region 用户列表
  {
    title: '用户信息',
    path: '/single/userList/userInfo',
    component: lazy(() =>
      import('../../views/ai/single/useList/userInfo/Index')
    ),
  },
  //#endregion
  //#region 首页
  {
    title: '首页',
    path: '/welcome/home',
    exact: true,
    component: lazy(() => import('../../views/ai/welcome/home/Index')),
  },
  {
    title: '大模型列表',
    path: '/welcome/home/modelList',
    component: lazy(() => import('../../views/ai/welcome/home/modelList/Index')),
  },
  {
    title: 'AI绘画作品展示',
    path: '/welcome/home/imgList',
    component: lazy(() => import('../../views/ai/welcome/home/imgList/Index')),
  },
  //#endregion
]

const router = []

export { extraRouter, h5Router }

export default router
