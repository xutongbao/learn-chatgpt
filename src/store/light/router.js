import { lazy } from 'react'
import AIIndex from '../../views/ai/index/Index'

const extraRouter = [
]

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
]

const router = []

export {
  extraRouter,
  h5Router,
}

export default router
