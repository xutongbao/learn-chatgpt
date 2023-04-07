import React, { useState, useEffect } from 'react'
import ProTable from '@ant-design/pro-table'

//高级表格：https://procomponents.ant.design/components/table#protable
// https://procomponents.ant.design/components/table#protable
let timer
let isCanSearch = true
function MyProTable(props) {
  const {
    dataSource,
    total,
    current,
    pageSize,
    getColumns,
    pageSizeOptions = [10, 20, 50, 300],
    onRowSelect = () => {},
    rowSelection = true,
    tableType = '',
    bordered = false,
    isLimitHeight = false,
    className = '',
  } = props
  const [columnsStateMap, setColumnsStateMap] = useState()
  const [height, setHeight] = useState()
  const {
    location: { pathname, search },
  } = window.reactRouter

  const handleColumnsStateChange = (value) => {
    localStorage.setItem(
      `${pathname + search + tableType}`,
      JSON.stringify(value)
    )

    setColumnsStateMap(value)
  }

  const handleSearch = () => {
    if (isCanSearch) {
      props.onSearch()
      isCanSearch = false
      clearTimeout(timer)
      timer = setTimeout(() => {
        isCanSearch = true
      }, 200)
    }
  }

  useEffect(() => {
    const tempValue = localStorage.getItem(`${pathname + search + tableType}`)
    const columnsStateMap = tempValue ? JSON.parse(tempValue) : {}
    setColumnsStateMap(columnsStateMap)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const handleHeight = () => {
      const clientHeight = document.body.clientHeight
      const isFullScreen = document.body.clientHeight === window.screen.height
      let myHeight = 300
      if (clientHeight > 700) {
        if (isFullScreen) {
          myHeight = clientHeight - 150
        } else {
          myHeight = clientHeight - 250
        }
      }
      //console.log(myHeight)
      setHeight(myHeight)
    }
    handleHeight()
    window.onresize = () => {
      handleHeight()
    }
    return () => {
      window.onresize = null
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="m-content-table">
      <ProTable
        className={`m-my-pro-table ${className}`}
        search={false}
        bordered={bordered}
        options={{
          density: false,
          fullScreen: false,
          reload: false,
          setting: true,
        }}
        columns={getColumns(props)}
        dataSource={dataSource}
        rowKey="id"
        scroll={{
          scrollToFirstRowOnChange: true,
          x: true,
          y: isLimitHeight ? height : undefined,
        }}
        // columnState={{
        //   value: columnsStateMap,
        //   onChange: function (value) {
        //     console.log(666)
        //   },
        //   persistenceKey: 'pro-table-singe-demos',
        //   persistenceType: 'localStorage',
        // }}
        columnsStateMap={columnsStateMap}
        onColumnsStateChange={handleColumnsStateChange}
        // 与 antd 相同，批量操作需要设置 rowSelection 来开启，与 antd 不同的是，pro-table
        //提供了一个 alert 用于承载一些信息。你可以通过 tableAlertRender和 tableAlertOptionRender
        //来对它进行自定义。设置或者返回 false 即可关闭。
        tableAlertRender={false}
        rowSelection={
          rowSelection
            ? {
                //selections: true,
                onChange: (selectedRowKeys, selectedRows) =>
                  onRowSelect(selectedRowKeys, selectedRows),
              }
            : false
        }
        pagination={{
          current,
          total,
          pageSize,
          onChange: handleSearch,
          showSizeChanger: true,
          pageSizeOptions,
          onShowSizeChange: handleSearch,
          showTotal: (total) => (
            <span>
              共有数据： <span className="m-total-text">{total}</span> 条
            </span>
          ),
        }}
      ></ProTable>
    </div>
  )
}

export default MyProTable
