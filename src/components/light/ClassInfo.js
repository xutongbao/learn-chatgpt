import React, { useState, useEffect } from 'react'
import { Input, InputNumber } from 'antd'
import Icon from './Icon'
import { deepClone } from '../../utils/tools'

export default function Gift({ value = [], onChange }) {
  const [giftList, setGiftList] = useState([])

  // const handleAdd = () => {
  //   if (giftList.length >= 10) {
  //     return
  //   }
  //   const temp = {
  //     cid: Date.now(),
  //     name: '',
  //     classTime: '',
  //     startTime: '',
  //     lessonCount: '',
  //   }
  //   giftList.push(temp)
  //   setGiftList([...giftList])
  //   onChange(deepClone(giftList))
  // }

  const handleDelete = (cid) => {
    const newGiftList = giftList.filter((item) => item.cid !== cid)
    setGiftList(newGiftList)
    onChange(deepClone(newGiftList))
  }

  const handleChange = (e, field, cid) => {
    const index = giftList.findIndex((item) => item.cid === cid)
    giftList[index][field] = e && e.target ? e.target.value : e
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
        <div className="m-gift-item" key={item.cid}>
          <span className="m-gift-label">班级名称:</span>
          <Input
            value={item.name}
            onChange={(e) => handleChange(e, 'name', item.cid)}
            className="m-gift-input"
          ></Input>
          <span className="m-gift-label end">上课时间:</span>
          <Input
            value={item.classTime}
            onChange={(e) => handleChange(e, 'classTime', item.cid)}
            className="m-gift-input"
          ></Input>
          <div style={{ margin: '5px 0 0' }}>
            <span className="m-gift-label">开班时间:</span>
            <Input
              value={item.startTime}
              onChange={(e) => handleChange(e, 'startTime', item.cid)}
              className="m-gift-input"
            ></Input>
            <span className="m-gift-label end">课时数量:</span>
            <InputNumber
              value={item.lessonCount}
              min={0}
              onChange={(e) => handleChange(e, 'lessonCount', item.cid)}
              className="m-gift-input"
            ></InputNumber>
            {index === 0 ? (
              null
            ) : (
              <Icon
                name="delete"
                className="m-category-icon"
                onClick={() => handleDelete(item.cid)}
              ></Icon>
            )}
          </div>
        </div>
      ))}
      <div className="m-input-footer-msg-form-item">
        可支付课程类型为在线课程时，课时数量为必填项
      </div>
    </div>
  )
}
