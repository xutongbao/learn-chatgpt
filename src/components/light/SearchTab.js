import React from 'react'
import { Tabs } from 'antd'

const { TabPane } = Tabs

export default function SearchTab({ searchTabActiveKey,  handleSearchTabActiveKey, getTabSearchFields, className }) {
  return (
    <div className={`m-tabs-wrap ${className}`}>
      <Tabs activeKey={searchTabActiveKey} onChange={handleSearchTabActiveKey} className="m-tabs">
        {getTabSearchFields().map((item) => (
          <TabPane tab={item.title} key={item.value}></TabPane>
        ))}
      </Tabs>
    </div>
  )
}
