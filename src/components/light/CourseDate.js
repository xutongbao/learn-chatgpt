import React, { useState } from 'react'
import { Select, DatePicker } from 'antd'

const { Option } = Select
const { RangePicker } = DatePicker

export default function CourseDate({
  value = {},
  onChange,
  getPopupContainer,
}) {
  const [text, setText] = useState()
  const [dateRange, setDateRange] = useState([])

  const triggerChange = (changedValue) => {
    const temp = {
      text,
      ...value,
      ...changedValue,
    }

    if (temp.text) {
      onChange(temp)
    }
  }

  const handleText = (newText) => {
    setText(newText)
    triggerChange({
      text: newText,
    })
  }

  const handleDateRange = (dates) => {
    setDateRange(dates)
    triggerChange({
      dateRange: dates
    })
  }

  return (
    <span>
      <Select
        value={value.text || text}
        onChange={handleText}
        placeholder="请选择"
        className="m-select-middle m-space"
        getPopupContainer={getPopupContainer}
      >
        <Option value="自主约课">自主约课</Option>
        <Option value="录播课无限制">录播课无限制</Option>
        <Option value="随到随学">随到随学</Option>
        <Option value="具体日期">具体日期</Option>
      </Select>
      <span>
        {(value.text === '具体日期' || text === '具体日期') && (
          <RangePicker value={value.dateRange || dateRange } onChange={handleDateRange} getPopupContainer={getPopupContainer} />
        )}
      </span>
    </span>
  )
}
