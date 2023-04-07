import React, { useState } from 'react'
import { Cascader } from 'antd'
import options from '../../utils/cities'

export default function AreaCascader({ value = [], onChange, getPopupContainer }) {
  const [cascader, setCascader] = useState([])
  
  const handleChange = (value, list) => {
    onChange(value)
    console.log(value)
    setCascader(value)
    console.log(list)
  }

  // const test = () => {
  //   options.forEach(item => {
  //     let count = 1
  //     if (item.children) {
  //       count++
  //       if (item.children[0] && item.children[0].children) {
  //         count++
  //       }
  //       if (count === 2) {
  //         console.log(item.label)
  //       }
  //     } else {
  //       console.log(item.label)
  //     }
  //   })
  // }
  // test()

  return (
    <div>
      <Cascader
        value={value || cascader}
        options={options}
        fieldNames={{value: 'code'}}
        onChange={handleChange}
        placeholder="选择所属城市"
        style={{ width: 300 }}
        getPopupContainer={getPopupContainer}
      />
    </div>
  )
}
