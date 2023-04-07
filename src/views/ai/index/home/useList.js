import { useState, useEffect, lazy } from 'react'
import { Route, Redirect } from 'react-router-dom'

export default function useList(props) {
  const [tabsValue, setTabsValue] = useState()
  // eslint-disable-next-line
  const [tabsArr, setTabsArr] = useState([])

  const {
    location: { pathname },
  } = props

  const handleTabsChange = (event, newValue) => {
    setTabsValue(newValue)
    document
      .getElementById(`m-tab-${newValue}`)
      .scrollIntoView({ behavior: 'smooth', inline: 'center' })
  }

  const handleJumpPage = (item) => {
    props.history.push(item.path)
  }

  const getRoute = () => {
    const routeArr = [
      {
        title: '推荐',
        path: '/ai/index/home/chatList',
        component: lazy(() => import('./chatList/Index')),
      },
      {
        title: '分类',
        path: '/h5/index/home/category',
        component: lazy(() => import('./category/Index')),
      },
      {
        title: '关注',
        path: '/h5/index/home/follow',
        component: lazy(() => import('./follow/Index')),
      },
    ]
    const routeDom = routeArr.map((item) => (
      <Route
        key={item.path}
        path={item.path}
        component={item.component}
      ></Route>
    ))
    if (routeDom.length > 0) {
      routeDom.push(
        <Redirect key={'redirect'} from="*" to="/404" exact></Redirect>
      )
    }
    return {
      routeDom,
    }
  }

  useEffect(() => {
    const resultTabIndex = tabsArr.findIndex((item) =>
      pathname.includes(item.path)
    )
    setTabsValue(resultTabIndex > 0 ? resultTabIndex : 0)
    // eslint-disable-next-line
  }, [pathname, tabsArr])

  return {
    tabsValue,
    tabsArr,
    handleTabsChange,
    handleJumpPage,
    getRoute,
  }
}
