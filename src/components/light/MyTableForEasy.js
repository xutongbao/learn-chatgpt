import React from 'react'
import { Table } from 'antd'
import MyBackTop from './MyBackTop'

function MyTableForEasy(props) {
  const { dataSource, getColumns, defaultExpandAllRows = true } = props

  return (
    <div className="m-content-table">
      <Table
        className="m-my-table"
        columns={getColumns(props)}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        defaultExpandAllRows={defaultExpandAllRows}
        pagination={{
          total: 1,
          pageSize: 1000,
          showTotal: (total) => (
            <span>
              共有数据： <span className="m-total-text">{total}</span> 条
            </span>
          ),
        }}
        //pagination={false}
      ></Table>
      <MyBackTop></MyBackTop>
    </div>
  )
}

export default MyTableForEasy
