import React, { useState, useEffect } from 'react'
import { TreeSelect } from 'antd'
import { deepClone } from '../../utils/tools'
const { SHOW_PARENT } = TreeSelect

export default function CategoryPlus({
  value = {},
  onChange,
  categoryOptions,
  getPopupContainer,
}) {
  const [myValue, setMyValue] = useState([])

  const handleChange = (value, label, extra) => {
    console.log('onChange ', value)
    setMyValue(value)
    onChange(deepClone({value, label}))
  }

  useEffect(() => {
    setMyValue(value.value)
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      <TreeSelect
        treeData={categoryOptions}
        value={myValue}
        onChange={handleChange}
        placeholder="选择所属分类"
        style={{ width: '100%' }}
        getPopupContainer={getPopupContainer}
        treeCheckable={true}
        showCheckedStrategy={SHOW_PARENT}
      />
      <div className="m-input-footer-msg">只能选择叶子节点</div>
    </div>
  )
}
