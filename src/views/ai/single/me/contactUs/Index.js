import React from 'react'
import { Table } from 'antd'
import { getAdminInfo } from '../../../../../utils/tools'


export default function Index() {

  const { wechatCode, email } = getAdminInfo()

  const columns = [
    {
      title: '属性',
      dataIndex: 'prop',
    },
    {
      title: '值',
      dataIndex: 'value',
      render: (text) => {
        if (text.includes('http')) {
          return (
            <>
              {/* eslint-disable-next-line */}
              <a href={text} target="_blank">
                {text}
              </a>
            </>
          )
        } else {
          return text
        }
      },
    },
  ]
  const data = [
    {
      prop: '微信',
      value: wechatCode,
    },
    {
      prop: '邮箱',
      value: email,
    },
    {
      prop: '博客',
      value: 'https://blog.csdn.net/xutongbao',
    },
  ]
  return (
    <div style={{margin: '5px'}}>
      <Table
        bordered
        showHeader={false}
        rowKey="prop"
        pagination={false}
        columns={columns}
        dataSource={data}
      />
    </div>
  )
}
