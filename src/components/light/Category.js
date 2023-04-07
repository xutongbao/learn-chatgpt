import React, { useState, useEffect } from 'react'
import { Cascader } from 'antd'
import Icon from './Icon'
import { deepClone } from '../../utils/tools'

export default function Category({
  value = [],
  onChange,
  categoryOptions,
  getPopupContainer,
}) {
  const [categoryList, setCategoryList] = useState([])

  const handleAdd = () => {
    const temp = {
      id: Date.now(),
      value: [],
    }
    categoryList.push(temp)
    setCategoryList([...categoryList])
    onChange(deepClone(categoryList))
  }

  const handleDelete = (id) => {
    const newCategoryList = categoryList.filter((item) => item.id !== id)
    setCategoryList(newCategoryList)
    onChange(deepClone(newCategoryList))
  }

  const handleChange = (value, selectedOptions, id) => {
    const index = categoryList.findIndex((item) => item.id === id)
    categoryList[index].value = value
    categoryList[index].label = selectedOptions.map(item => item.label)
    setCategoryList(categoryList)
    onChange(deepClone(categoryList))
  }

  
  useEffect(() => {
    setCategoryList(value)
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      {categoryList.map((item, index) => (
        <div className="m-category-item" key={item.id}>
          <Cascader
            value={item.value}
            options={categoryOptions}
            placeholder="选择所属分类"
            style={{ width: 300 }}
            getPopupContainer={getPopupContainer}
            onChange={(value, selectedOptions) => handleChange(value, selectedOptions, item.id)}
          ></Cascader>
          {index === 0 ? (
            <Icon
              name="add"
              className="m-category-icon"
              onClick={handleAdd}
            ></Icon>
          ) : (
            <Icon
              name="delete"
              className="m-category-icon"
              onClick={() => handleDelete(item.id)}
            ></Icon>
          )}
        </div>
      ))}
    </div>
  )
}
