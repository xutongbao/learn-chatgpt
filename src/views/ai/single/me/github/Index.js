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
        <div>
          2.
          ChatGPT资料汇总学习，持续更新…<br/>
          ChatGPT再一次掀起了AI的热潮，是否还会像BERT一样成为AI进程上的里程碑事件，还是噱头炒作，持续关注，让时间流淌~仓库地址：<br/>
          {/* eslint-disable-next-line */}
          <a
            href={`https://github.com/dalinvip/Awesome-ChatGPT`}
            target="_blank"
          >
            https://github.com/dalinvip/Awesome-ChatGPT
          </a>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Index)
