import React, { useState, useEffect } from 'react'
import { Input } from 'antd'
import Icon from './Icon'
import { deepClone } from '../../utils/tools'

export default function Gift({ value = [], onChange }) {
  const [giftList, setGiftList] = useState([])

  const handleAdd = () => {
    if (giftList.length >= 3) {
      return
    }
    const temp = {
      id: Date.now(),
      name: '',
      text: ''
    }
    giftList.push(temp)
    setGiftList([...giftList])
    onChange(deepClone(giftList))
  }

  const handleDelete = (id) => {
    const newGiftList = giftList.filter((item) => item.id !== id)
    setGiftList(newGiftList)
    onChange(deepClone(newGiftList))
  }

  const handleChange = (e, field, id) => {
    const index = giftList.findIndex((item) => item.id === id)
    giftList[index][field] = e.target.value
    setGiftList(giftList)
    onChange(deepClone(giftList))
  }

  useEffect(() => {
    setGiftList(value)
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      {giftList.map((item, index) => (
        <div className="m-gift-item" key={item.id}>
          <span className="m-gift-label">优惠类型:</span>
          <Input
            value={item.name}
            onChange={(e) => handleChange(e, 'name', item.id)}
            className="m-gift-input"
            placeholder="例如：到店礼品 长度3-4个汉字"
          ></Input>
          <span className="m-gift-label end">优惠描述:</span>
          <Input
            value={item.text}
            onChange={(e) => handleChange(e, 'text', item.id)}
            className="m-gift-input"
            placeholder="例如：教材免费赠送 长度4个以上汉字"
          ></Input>
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
      <div className="m-input-footer-msg-form-item">最多填写3组</div>
    </div>
  )
}
