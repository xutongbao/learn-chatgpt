import React, { useEffect, useState, useMemo } from 'react'
import { Menu } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { Icon } from '../../../components/light'

const { SubMenu } = Menu

function Sidebar(props) {
  const {
    router,
    location: { pathname },
    theme,
    selectedKeys,
    collapsed,
  } = props

  const [openKeys, setOpenKeys] = useState([])

  const defaultOpenKeysFn = () => {
    const arr = []
    let myPathname = pathname.replace(/(\/+$)/g, '')
    let arrTemp = myPathname.split('/')
    if (arrTemp.length > 4) {
      for (let i = 4; i < arrTemp.length; i++) {
        arr.push(arrTemp.slice(0, i).join('/'))
      }
    }
    return arr
  }

  const handleNav = (path) => {
    //props.onSetState(['selectedKeys'], path)
    props.history.push(path)
  }

  const isFirstLevel = (item) => {
    const pathLength = item.key.split('/').length
    if (pathname.includes('edu/index')) {
      return pathLength === 5
    } else {
      return pathLength === 4
    }
  }

  // 只有router、collapsed变化时才会重新渲染sidebarDom，useMemo函数可以起到性能优化的作用
  const sidebarDom = useMemo(() => {
    const sidebarRender = (arr) => {
      return arr.map((item) => {
        if (item.children) {
          if (item.isVisible) {
            // 一级子菜单折叠时使用大图标
            return (
              <SubMenu
                key={item.key}
                title={item.title}
                className={item.className ? item.className : ''}
                icon={
                  item.icon ? (
                    <span className="anticon anticon-appstore m-sidebar-icon-wrap">
                      <Icon
                        name={item.icon}
                        className={`m-sidebar-icon ${
                          collapsed && isFirstLevel(item) ? 'big' : ''
                        }`}
                        title={collapsed && isFirstLevel(item) ? item.title : ''}
                      ></Icon>
                    </span>
                  ) : null
                }
              >
                {sidebarRender(item.children)}
              </SubMenu>
            )
          } else {
            return null
          }
        } else {
          // 使用span包裹Icon组件，并添加antd的className才能正确使用Menu的icon属性
          // 折叠时使用大图标
          if (item.isVisible) {
            // 有些菜单只在开发环境展示
            if (!item.isDevMenu || process.env.REACT_APP_MODE === 'dev') {
              if (item.hiddenMenu !== false) {
                return (
                  <Menu.Item
                    key={item.path}
                    className={item.className ? item.className : ''}
                    onClick={() => handleNav(item.path)}
                    icon={
                      item.icon ? (
                        <span className="anticon anticon-appstore m-sidebar-icon-wrap">
                          <Icon
                            name={item.icon}
                            className={`m-sidebar-icon ${
                              collapsed ? 'big' : ''
                            }`}
                          ></Icon>
                        </span>
                      ) : null
                    }
                  >
                    <span title={item.title}>{item.title}</span>
                  </Menu.Item>
                )
              } else {
                return null
              }
            } else {
              return null
            }
          } else {
            return null
          }
        }
      })
    }

    return sidebarRender(router.toJS())
    // eslint-disable-next-line
  }, [router, collapsed])

  const handleOpenChange = (openKeys) => {
    setOpenKeys(openKeys)
  }

  useEffect(() => {
    props.onSetState(['selectedKeys'], pathname)
    // eslint-disable-next-line
  }, [pathname])

  useEffect(() => {
    if (!collapsed) {
      setOpenKeys(defaultOpenKeysFn())
    }
    // eslint-disable-next-line
  }, [collapsed])

  const handleNav1 = (key) => {
    props.history.push(key)
  }

  return (
    <div>
      <NavLink to="/h5/index/home" className="m-h5-footer-item">
        <Icon name="home" className="m-h5-footer-icon"></Icon>
        <div className="m-h5-footer-text">首页</div>
      </NavLink>
      <NavLink to="/h5/index/me" className="m-h5-footer-item">
        <Icon name="username" className="m-h5-footer-icon"></Icon>
        <div className="m-h5-footer-text">我的</div>
      </NavLink>
      <button onClick={() => handleNav1('/h5/index')}>1</button>
      <button onClick={() => handleNav1('/h5/index')}>1</button>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    router: state.getIn(['light', 'router']),
    theme: state.getIn(['light', 'theme']),
    selectedKeys: state.getIn(['light', 'selectedKeys']),
    collapsed: state.getIn(['light', 'collapsed']),
    userInfo: state.getIn(['light', 'userInfo']).toJS(),
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Sidebar))
