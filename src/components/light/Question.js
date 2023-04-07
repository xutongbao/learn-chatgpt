import React, { useState, useEffect } from 'react'
import { Input } from 'antd'
import Icon from './Icon'
import { deepClone } from '../../utils/tools'

const { TextArea } = Input

export default function Question({ value = [], onChange }) {
  const [questionList, setQuestionList] = useState([])

  const handleAdd = () => {
    if (questionList.length >= 10) {
      return
    }
    const temp = {
      id: Date.now(),
      question: '',
      answer: '',
    }
    questionList.push(temp)
    setQuestionList([...questionList])
    onChange(deepClone(questionList))
  }

  const handleDelete = (id) => {
    const newQuestionList = questionList.filter((item) => item.id !== id)
    setQuestionList(newQuestionList)
    onChange(deepClone(newQuestionList))
  }

  const handleChange = (e, field, id) => {
    const index = questionList.findIndex((item) => item.id === id)
    questionList[index][field] = e.target.value
    setQuestionList(questionList)
    onChange(deepClone(questionList))
  }

  useEffect(() => {
    setQuestionList(value)
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      {questionList.map((item, index) => (
        <div className="m-question-item" key={item.id}>
          <div className="m-question-item-row">
            <span className="m-question-label">问题名称:</span>
            <Input
              value={item.question}
              onChange={(e) => handleChange(e, 'question', item.id)}
              className="m-question-input"
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
          <div className="m-question-item-row">
            <span className="m-question-label">问题答案:</span>
            <TextArea
              value={item.answer}
              onChange={(e) => handleChange(e, 'answer', item.id)}
              className="m-question-input"
            ></TextArea>
          </div>
        </div>
      ))}
    </div>
  )
}
