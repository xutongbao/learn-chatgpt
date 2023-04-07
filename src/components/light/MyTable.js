import React from 'react'
import { Table } from 'antd'
import MyBackTop from './MyBackTop'

function MyTable(props) {
  const {
    dataSource,
    rowKey = 'id',
    total,
    current,
    pageSize,
    getColumns,
    pageSizeOptions = [10, 20, 50, 300],
    onRowSelect = () => {},
    defaultExpandAllRows = false,
  } = props

  return (
    <div className="m-content-table">
      <Table
        className="m-my-table"
        columns={getColumns(props)}
        dataSource={dataSource}
        rowKey={rowKey}
        defaultExpandAllRows={defaultExpandAllRows}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) =>
            onRowSelect(selectedRowKeys, selectedRows),
        }}
        pagination={{
          current,
          total,
          pageSize,
          onChange: (page, pageSize) =>
            props.onSearch({ page, pageSize, type: 'pagination' }),
          showSizeChanger: true,
          pageSizeOptions,
          onShowSizeChange: (page, pageSize) =>
            props.onSearch({ page, pageSize, type: 'pagination' }),
          showTotal: (total) => (
            <span>
              共有数据： <span className="m-total-text">{total}</span> 条
            </span>
          ),
        }}
      ></Table>

      <MyBackTop></MyBackTop>
    </div>
  )
}

export default MyTable
