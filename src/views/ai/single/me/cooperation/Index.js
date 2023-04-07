import React from 'react'
import { withRouter } from 'react-router-dom'

import './index.css'

function Index(props) {
  return (
    <div className="m-single-page-space m-form-bottom">
      <div className="m-single-join-group-intro">
        <div>
          1.
          可以在我的主域名下新增子域名，子域名的联系方式都改成你的，包括微信、微信群等。你可以独立运营，我提供兑换码。示例项目
          {/* eslint-disable-next-line */}
          <a href={`http://demo.xutongbao.top`} target="_blank">
            http://demo.xutongbao.top
          </a>
        </div>
        <div>
          2.
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
