import { useState, useEffect } from 'react'
import { Modal, Button, Select, message } from 'antd'
import Api from '../../../../../api'
import * as clipboard from 'clipboard-polyfill/text'

const { Option } = Select

let topArr = []
let isRealScroll = true
let timer
let timer2
let isOpen = true
export default function useSelectAvatar(props) {
  const [language, setLanguage] = useState('cn')
  // eslint-disable-next-line
  const [total, setTotal] = useState()
  const [current, setCurrent] = useState(1)
  //把dataSource和pageSize单独放在一起是为了避免切换pageSize时的bug
  const [state, setState] = useState({
    dataSource: [],
    pageSize: 500,
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isHasMore, setIsHasMore] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const [currentSidebarId, setCurrentSidebarId] = useState('9')

  const {
    // eslint-disable-next-line
    location: { search },
    handleSelectPrompt,
  } = props

  //搜索
  const handleSearch = ({
    page = current,
    pageSize = state.pageSize,
    isRefresh = false,
  } = {}) => {
    const searchParams = {}

    if (isRefresh) {
      setState({
        dataSource: [],
        pageSize: 500,
      })
    }

    Api.h5
      .sdPromptSearch({ pageNum: page, pageSize, ...searchParams })
      .then((res) => {
        if (res.code === 200) {
          const { pageNum, pageSize, total } = res.data

          let list = res.data.list
          if (isRefresh) {
            setState({
              dataSource: [...list],
              pageSize: res.data.pageSize,
            })
          } else {
            setState({
              dataSource: [...state.dataSource, ...list],
              pageSize: res.data.pageSize,
            })
          }
          setTotal(res.data.total)
          const currentTemp = res.data.pageNum + 1
          setCurrent(currentTemp)
          setIsHasMore(pageNum < Math.ceil(total / pageSize))
        }
      })
  }

  //显示对话框
  const handleModalVisible = () => {
    setSelectedIds([])
    setIsModalVisible(true)
  }

  const handleSelect = (item) => {
    let selectIdsNew = []
    if (selectedIds.includes(item.id)) {
      selectIdsNew = selectedIds.filter(
        (selectIdsItem) => selectIdsItem !== item.id
      )
    } else {
      selectIdsNew = [...selectedIds, item.id]
    }
    setSelectedIds(selectIdsNew)
  }

  const handleClear = () => {
    setSelectedIds([])
  }

  const handleCopy = (text) => {
    if (selectedIds.length === 0) {
      message.warning('请至少选择一项')
    } else {
      let promptArr = []
      state.dataSource.forEach((item) => {
        if (selectedIds.includes(item.id)) {
          promptArr.push(item[language])
        }
      })
      clipboard.writeText(promptArr.join(',')).then(() => {
        message.success('复制成功')
      })
      setIsModalVisible(false)
    }
  }

  const handleSubmit = () => {
    if (selectedIds.length === 0) {
      message.warning('请至少选择一项')
    } else {
      let promptArr = []
      state.dataSource.forEach((item) => {
        if (selectedIds.includes(item.id)) {
          promptArr.push(item[language])
        }
      })
      handleSelectPrompt(promptArr)
      setIsModalVisible(false)
    }
  }

  const handleLanguageChange = (value) => {
    setLanguage(value)
  }

  const handleSidebarClick = (item) => {
    setCurrentSidebarId(item.id)
    isRealScroll = false
    clearTimeout(timer)
    timer = setTimeout(() => {
      isRealScroll = true
    }, 1000)
    console.log(document.getElementById(`m-sd-chat-prompt-category-${item.id}`))
    document
      .getElementById(`m-sd-chat-prompt-category-${item.id}`)
      .scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const handleScroll = (e) => {
    let scrollTop = e.target.scrollTop + 60
    let { scrollHeight, clientHeight } = e.target
    // console.log(scrollHeight, scrollTop, clientHeight )
    if (isRealScroll) {
      for (let i = 0; i < topArr.length - 1; i++) {
        if (topArr[i] <= scrollTop && scrollTop < topArr[i + 1]) {
          let id = state.dataSource.filter((item) => item.type === 'category')[
            i
          ].id
          setCurrentSidebarId(id)
        }
      }
    }
    if (scrollHeight - scrollTop - clientHeight < 200) {
      if (isOpen) {
        isOpen = false
        console.log('到底')
        if (isHasMore) {
          handleSearch()
        }
        clearTimeout(timer2)
        setTimeout(() => {
          isOpen = true
        }, 1000)
      }
    }
  }

  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        topArr = Array.from(document.getElementsByClassName('js-category')).map(
          (item) => item.offsetTop
        )
        topArr.push(Infinity)
      }, 1000)
    }
    // eslint-disable-next-line
  }, [state, isModalVisible])

  //Dom
  const getDom = (type = '1') => {
    return (
      <>
        <Modal
          title="关键词词典"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="m-modal-full-screen m-sd-chat-modal"
          forceRender
        >
          {isModalVisible ? (
            <div className="m-sd-chat-prompt-info">
              <div className="m-sd-chat-prompt-toolbar">
                <Select
                  placeholder="请选择"
                  value={language}
                  onChange={handleLanguageChange}
                  style={{ minWidth: 100 }}
                >
                  <Option value="cn">中文</Option>
                  <Option value="en">English</Option>
                </Select>
              </div>
              <div className="m-sd-chat-prompt-content">
                <div className="m-sd-chat-prompt-sidebar">
                  {state.dataSource
                    .filter((item) => item.type === 'category')
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`m-sd-chat-prompt-sidebar-item ${
                          currentSidebarId === item.id ? 'active' : ''
                        }`}
                        onClick={() => handleSidebarClick(item)}
                      >
                        {item.cn}/{item.en}
                      </div>
                    ))}
                </div>
                <div
                  className="m-sd-chat-prompt-list"
                  onScroll={(e) => handleScroll(e)}
                  id={`scrollableDivPrompt${type}`}
                >
                  {state.dataSource.map((item, index) => {
                    if (item.type === 'category') {
                      return (
                        <div
                          key={item.id}
                          className="js-category m-sd-chat-prompt-category"
                        >
                          {item.cn}/{item.en}
                        </div>
                      )
                    } else {
                      return (
                        <div
                          key={item.id}
                          className={`m-sd-chat-prompt-list-item ${
                            selectedIds.includes(item.id) ? 'active' : ''
                          }`}
                        >
                          {index > 0 &&
                          state.dataSource[index - 1].type === 'category' ? (
                            <div
                              id={`m-sd-chat-prompt-category-${
                                state.dataSource[index - 1].id
                              }`}
                              className='m-sd-chat-prompt-category-anchor'
                            ></div>
                          ) : null}
                          <div onClick={() => handleSelect(item)}>
                            {language === 'cn' ? (
                              <>
                                <div className="m-sd-chat-prompt-text-active">
                                  {item.cn}
                                </div>
                                <div className="m-sd-chat-prompt-text">
                                  {item.en}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="m-sd-chat-prompt-text-active">
                                  {item.en}
                                </div>
                                <div className="m-sd-chat-prompt-text">
                                  {item.cn}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
            </div>
          ) : null}

          <div className="m-sd-chat-select-footer">
            <Button
              className="m-space"
              onClick={() => setIsModalVisible(false)}
            >
              取消
            </Button>
            <Button onClick={() => handleClear()} className="m-space">
              清空
            </Button>
            <Button onClick={() => handleCopy()} className="m-space">
              复制
            </Button>
            <Button
              type="primary"
              onClick={() => handleSubmit()}
              className="m-space"
            >
              确定
            </Button>
          </div>
        </Modal>
      </>
    )
  }

  // 挂载完请求第一页数据，路由里有查询条件会自动带上。再次点击菜单时，查询条件会消失，会再次请求数据
  useEffect(() => {
    handleSearch({ isRefresh: true, page: 1 })
    // eslint-disable-next-line
  }, [props.location.search])

  return {
    promptHandleModalVisible: handleModalVisible,
    promptGetDom: getDom,
  }
}
