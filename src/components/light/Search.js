import React, { useState } from 'react'
import { Form, Row, Col, Button } from 'antd'
import Icon from './Icon'

function Search(props) {
  const { isExpandCustom = false } = props
  const [isExpand, setExpand] = useState(isExpandCustom)
  //operateSpan控制搜索、导出、重置、展开组件加在一起的宽度占总宽度的比例 operateSpan / 24
  //gutter={24}
  const {
    operateSpan = 11,
    searchForm,
    initialValues = {},
    isExport = false,
    isReset = false,
    isRefresh = true,
    isFoldable = false,
    className = ''
  } = props
  const [tempForm] = Form.useForm()
  const form = searchForm || tempForm

  const operate = (
    <>
      <Col
        span={isExpand ? 24 : operateSpan}
        className={`m-search-operate ${isExpand ? 'active' : ''}`}
      >
        <Button type="primary" className="m-space" htmlType="submit">
          <Icon name="search" className="m-tool-btn-icon"></Icon>
          搜索
        </Button>
        {isExport && (
          <Button
            type="primary"
            className="m-space"
            onClick={() => {
              props.onExport()
            }}
          >
            <Icon name="export" className="m-tool-btn-icon"></Icon>
            导出
          </Button>
        )}
        {isReset && (
          <Button
            className="m-space"
            onClick={() => {
              form.resetFields()
              props.onSearch({ page: 1, searchParams: initialValues })
            }}
          >
            <Icon name="reset" className="m-tool-btn-icon"></Icon>
            重置
          </Button>
        )}
        {isRefresh && (
          <Button
            className="m-space"
            onClick={() => {
              props.onSearch({ searchParams: initialValues })
            }}
          >
            <Icon name="reset" className="m-tool-btn-icon"></Icon>
            刷新
          </Button>
        )}
        {isFoldable && (
          <Button
            className="m-space"
            type="link"
            onClick={() => {
              setExpand(!isExpand)
            }}
          >
            {
              <Icon
                name="arrow"
                className={`m-tool-btn-icon ${
                  isExpand ? 'rotate90' : 'rotate_90'
                }`}
              ></Icon>
            }
            {isExpand ? '收起' : '展开'}
          </Button>
        )}
      </Col>
    </>
  )

  return (
    <div className={`m-content-search ${isExpand ? '' : 'fold'} ${className ? className : ''}`}>
      <Form
        form={form}
        className="ant-advanced-search-form"
        onFinish={(values) =>
          props.onSearch({ page: 1, searchParams: values, type: 'searchForm' })
        }
        initialValues={initialValues}
      >
        <Row gutter={24}>
          {props.getSearchFields(isExpand)}
          {!isExpand && operate}
        </Row>
        {isExpand && <Row>{operate}</Row>}
      </Form>
    </div>
  )
}

export default Search
