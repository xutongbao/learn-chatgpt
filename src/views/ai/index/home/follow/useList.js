import { useState, useEffect } from 'react'
import Api from '../../../../../api'

export default function useList(props) {
  const [activeKey, setActiveKey] = useState('1')
  const [tabsArr, setTabsArr] = useState([])

  const handleChangeActiveKey = (key) => {
    setActiveKey(key)
  }

  // 挂载完请求第一页数据，路由里有查询条件会自动带上。再次点击菜单时，查询条件会消失，会再次请求数据
  useEffect(() => {
    Api.h5.configGetHomeTabs().then(res => {
      if (res.code === 200) {
        setTabsArr(res.data.homeTabs)
      }
    })
    // eslint-disable-next-line
  }, [])

  return {
    activeKey,
    tabsArr,
    handleChangeActiveKey,
  }
}
