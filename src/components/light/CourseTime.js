import React, { useState } from 'react'
import { Select, TimePicker } from 'antd'

const { Option } = Select
const { RangePicker } = TimePicker

export default function CourseTime({
  value = {},
  onChange,
  getPopupContainer,
}) {
  const [text, setText] = useState()
  const [timeRange, setTimeRange] = useState([])

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

  const handleTimeRange = (dates) => {
    setTimeRange(dates)
    triggerChange({
      timeRange: dates,
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
        <Option value="按课表时间上课">按课表时间上课</Option>
        <Option value="具体时间">具体时间</Option>
      </Select>
      <span>
        {(value.text === '具体时间' || text === '具体时间') && (
          <RangePicker
            value={value.timeRange || timeRange}
            format={'HH:mm'}
            onChange={handleTimeRange}
            getPopupContainer={getPopupContainer}
          />
        )}
      </span>
    </span>
  )
}
