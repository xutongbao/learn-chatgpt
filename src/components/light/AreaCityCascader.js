import React, { useState } from 'react'
import { Cascader } from 'antd'
import options from '../../utils/cities'
import { getCityData } from '../../utils/tools'
const newOptions = getCityData(options)

export default function AreaCascader({ value = [], onChange, getPopupContainer }) {
  const [cascader, setCascader] = useState([])
  
  const handleChange = (value, list) => {
    onChange(value)
    console.log(value)
    setCascader(value)
    console.log(list)
  }

  return (
    <div>
      <Cascader
        value={value || cascader}
        options={newOptions}
        fieldNames={{value: 'code'}}
        onChange={handleChange}
        placeholder="选择所属城市"
        style={{ width: 300 }}
        getPopupContainer={getPopupContainer}
      />
    </div>
  )
}
