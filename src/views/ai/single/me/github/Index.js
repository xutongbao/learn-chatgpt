import React from 'react'
import { withRouter } from 'react-router-dom'

import './index.css'

function Index(props) {
  return (
    <div className="m-single-page-space m-form-bottom">
      <div className="m-single-join-group-intro">
        <div>
          1.
          本项目前端代码开源，欢迎二次开发，商业化部署，调用我的后台接口，售卖兑换码，仓库地址：
          {/* eslint-disable-next-line */}
          <a
            href={`https://github.com/xutongbao/learn-chatgpt`}
            target="_blank"
          >
            https://github.com/xutongbao/learn-chatgpt
          </a>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Index)
