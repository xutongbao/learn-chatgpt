import React, { useState } from 'react'
import { Input, Select } from 'antd'
const { Option } = Select

export default function PriceInput({ value = {}, onChange }) {
  const [number, setNumber] = useState(0)
  const [currency, setCurrency] = useState('rmb')

  const triggerChange = (changedValue) => {
    onChange?.({
      number,
      currency,
      ...value,
      ...changedValue,
    })
  }

  const onNumberChange = (e) => {
    const newNumber = parseInt(e.target.value || '0', 10)

    if (Number.isNaN(number)) {
      return
    }

    if (!('number' in value)) {
      setNumber(newNumber)
    }

    triggerChange({
      number: newNumber,
    })
  }

  const onCurrencyChange = (newCurrency) => {
    if (!('currency' in value)) {
      setCurrency(newCurrency)
    }

    triggerChange({
      currency: newCurrency,
    })
  }

  return (
    <span>
      <Input
        type="text"
        value={value.number || number}
        onChange={onNumberChange}
        style={{
          width: 100,
        }}
      />
      <Select
        value={value.currency || currency}
        style={{
          width: 80,
          margin: '0 8px',
        }}
        onChange={onCurrencyChange}
      >
        <Option value="rmb">RMB</Option>
        <Option value="dollar">Dollar</Option>
      </Select>
    </span>
  )
}
