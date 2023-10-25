import React, { useState } from 'react'
import { Button, Input, Select, message } from 'antd'
import axios from 'axios'
import './index.css'

const { Option } = Select
const service = axios.create()

export default function Index() {
  const [domain, setDomain] = useState('http://yuying-api.xutongbao.top')
  const [response, setResponse] = useState('')

  const handleDomainChange = (value) => {
    setDomain(value)
  }

  const handleOpenMonitor = () => {
    service({
      url: `${domain}/api/light/tools/openMonitor`,
      method: 'post',
    }).then((res) => {
      if (res.data) {
        setResponse(JSON.stringify(res.data, null, 2))
      }
    })
  }
  const handleCloseMonitor = () => {
    service({
      url: `${domain}/api/light/tools/closeMonitor`,
      method: 'post',
    }).then((res) => {
      if (res.data) {
        setResponse(JSON.stringify(res.data, null, 2))
      }
    })
  }

  const handleRestartLearn = () => {
    if (domain.includes('81')) {
      service({
        url: `${domain}/api/light/tools/autoRestartLearn`,
        method: 'post',
      }).then((res) => {
        if (res.data) {
          setResponse(JSON.stringify(res.data, null, 2))
        }
      })
    } else {
      message.warning('请选择81端口domain，81的node服务可以重启85的node服务')
    }
  }

  return (
    <div>
      <div className="m-monitor-domain-wrap">
        domain:
        <Select
          placeholder="请选择"
          value={domain}
          onChange={handleDomainChange}
          style={{ minWidth: 300 }}
        >
          <Option value="http://localhost:81">localhost:81</Option>
          <Option value="http://localhost:85">localhost:85</Option>
          <Option value="http://yuying-api.xutongbao.top">
            http://yuying-api.xutongbao.top
          </Option>
          <Option value="http://39.97.238.175:81">
            http://39.97.238.175:81
          </Option>
          <Option value="http://172.174.171.83:81">
            http://172.174.171.83:81
          </Option>
          <Option value="http://172.174.171.83:85">
            http://172.174.171.83:85
          </Option>
        </Select>
      </div>
      <div className="m-monitor-btn-wrap">
        <Button type="primary" onClick={handleOpenMonitor}>
          开启监控
        </Button>
        <Button type="primary" onClick={handleCloseMonitor}>
          关闭监控
        </Button>

        <Button type="primary" onClick={handleRestartLearn}>
          重启【学习】项目后台
        </Button>
      </div>
      <div className="m-monitor-response-wrap">
        <div>response:</div>
        <Input.TextArea value={response} rows={10}></Input.TextArea>
      </div>
    </div>
  )
}
