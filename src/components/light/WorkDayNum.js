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
        <Option value="1">周一</Option>
        <Option value="2">周二</Option>
        <Option value="3">周三</Option>
        <Option value="4">周四</Option>
        <Option value="5">周五</Option>
        <Option value="6">周六</Option>
        <Option value="7">周日</Option>
      </Select>
      <span className="m-wrok-day-text">至</span>
      <Select
        value={value.end || end}
        onChange={handleEnd}
        placeholder="请选择"
        className="m-wrok-day-select"
        getPopupContainer={getPopupContainer}
      >
        <Option value="1">周一</Option>
        <Option value="2">周二</Option>
        <Option value="3">周三</Option>
        <Option value="4">周四</Option>
        <Option value="5">周五</Option>
        <Option value="6">周六</Option>
        <Option value="7">周日</Option>
      </Select>
    </span>
  )
}
