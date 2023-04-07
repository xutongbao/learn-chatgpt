import React, { useState } from 'react'
import { Select } from 'antd'
const { Option } = Select

export default function WorkDay({ value = {}, onChange, getPopupContainer }) {
  const [start, setStart] = useState()
  const [end, setEnd] = useState()

  const triggerChange = (changedValue) => {
    const temp = {
      start,
      end,
      ...value,
      ...changedValue,
    }

    if (temp.start && temp.end) {
      onChange(temp)
    }
  }

  const handleStart = (newStart) => {
    setStart(newStart)
    triggerChange({
      start: newStart,
    })
  }

  const handleEnd = (newEnd) => {
    setEnd(newEnd)
    triggerChange({
      end: newEnd,
    })
  }

  return (
    <span>
      <Select
        value={value.start || start}
        onChange={handleStart}
        placeholder="请选择"
        className="m-wrok-day-select"
        getPopupContainer={getPopupContainer}
      >
        <Option value="周一">周一</Option>
        <Option value="周二">周二</Option>
        <Option value="周三">周三</Option>
        <Option value="周四">周四</Option>
        <Option value="周五">周五</Option>
        <Option value="周六">周六</Option>
        <Option value="周日">周日</Option>
      </Select>
      <span className="m-wrok-day-text">至</span>
      <Select
        value={value.end || end}
        onChange={handleEnd}
        placeholder="请选择"
        className="m-wrok-day-select"
        getPopupContainer={getPopupContainer}
      >
        <Option value="周一">周一</Option>
        <Option value="周二">周二</Option>
        <Option value="周三">周三</Option>
        <Option value="周四">周四</Option>
        <Option value="周五">周五</Option>
        <Option value="周六">周六</Option>
        <Option value="周日">周日</Option>
      </Select>
    </span>
  )
}
