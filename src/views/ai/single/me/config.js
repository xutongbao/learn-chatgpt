import { lazy } from 'react'

const getRouteArr = () => {
  return [
    {
      title: '编辑资料',
      path: '/ai/single/me/editUserInfo',
      component: lazy(() => import('../../single/me/editUserInfo/Index')),
    },    
    {
      title: '兑换',
      path: '/ai/single/me/exchange',
      component: lazy(() => import('../../single/me/exchange/Index')),
    },
    // {
    //   title: '配置机器人',
    //   path: '/ai/single/me/editRobot',
    //   component: lazy(() => import('../../single/me/editRobot/Index')),
    // },
    {
      title: '微信群',
      path: '/ai/single/me/joinGroup',
      component: lazy(() => import('../../single/me/joinGroup/Index')),
    },
    {
      title: '联系我们',
      path: '/ai/single/me/contactUs',
      component: lazy(() => import('../../single/me/contactUs/Index')),
    },
    {
      title: '分享',
      path: '/ai/single/me/share',
      component: lazy(() => import('../../single/me/share/Index')),
    },   
    {
      title: '受邀用户',
      path: '/ai/single/me/inviter',
      component: lazy(() => import('../../single/me/inviter/Index')),
    },   
    {
      title: 'IOS下载',
      path: '/ai/single/me/ios',
      component: lazy(() => import('../../single/me/ios/Index')),
    },  
    {
      title: '文字教程',
      path: '/ai/single/me/question',
      component: lazy(() => import('../../single/me/question/Index')),
    },   
    {
      title: '视频教程',
      path: '/ai/single/me/videoQuestion',
      component: lazy(() => import('../../single/me/videoQuestion/Index')),
    },     
    {
      title: '群聊隐身',
      path: '/ai/single/me/invisible',
      component: lazy(() => import('../../single/me/invisible/Index')),
    },    
    {
      title: 'GPT-4',
      path: '/ai/single/me/gptFour',
      component: lazy(() => import('../../single/me/gptFour/Index')),
    },  
    {
      title: '合作',
      path: '/ai/single/me/cooperation',
      component: lazy(() => import('../../single/me/cooperation/Index')),
    },  
    {
      title: 'github',
      path: '/ai/single/me/github',
      component: lazy(() => import('../../single/me/github/Index')),
    },  
    {
      title: '设置',
      path: '/ai/single/me/set',
      component: lazy(() => import('../../single/me/set/Index')),
    },     
    {
      title: '工具',
      path: '/ai/single/me/tools',
      component: lazy(() => import('../../single/me/tools/Index')),
    },  
  ]
}

export { getRouteArr }
