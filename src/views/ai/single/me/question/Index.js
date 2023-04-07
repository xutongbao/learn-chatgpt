import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Collapse, Image } from 'antd'
import useList from './useList'
import './index.css'

const { Panel } = Collapse

function Index(props) {
  // eslint-disable-next-line
  const { handleReload } = useList(props)
  return (
    <>
      <div className="m-single-page-space">
        <Collapse>
          <Panel header="我的GPT-4 API 接入之旅" key="0">
            <div>
              {/* eslint-disable-next-line */}
              <a
                href={`https://blog.csdn.net/xutongbao/article/details/129851721?spm=1001.2014.3001.5501`}
                target="_blank"
              >
                {`https://blog.csdn.net/xutongbao`}
              </a>
            </div>
          </Panel>
          <Panel header="AI回答的问题不完整" key="1">
            <div>
              <div>解决方案：请说“继续”</div>
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-question-01.jpg?time=20230311"
                />
              </div>
            </div>
          </Panel>
          <Panel header="网页样式错乱，无法提问等" key="chrome">
            <div>
              <div>解决方案：下载chrome浏览器</div>
              <div>
              {/* eslint-disable-next-line */}
              <a
                href={`https://llq.ywswge.cn`}
                target="_blank"
              >
                {`https://llq.ywswge.cn`}
              </a>
            </div>
            </div>
          </Panel>          
          <Panel header="提示【无权限】" key="2">
            <div>
              <div>解决方案：重新登录一下</div>
            </div>
          </Panel>
          <Panel header="失败：今日提问数已经达到上限，休息一下" key="3">
            <div>
              <div>
                解决方案：联系管理员，免费索取【次卡】。次数限制是为了防止有人恶意刷接口
              </div>
            </div>
          </Panel>
          <Panel header="机器人无应答" key="4">
            <div>
              <div>解决方案：等会再试试。如果还不行，请联系管理员。</div>
            </div>
          </Panel>
          <Panel header="提问后一直【转圈】" key="5">
            <div>
              <div>解决方案：多等会，再试试。如果还不行，请联系管理员。</div>
            </div>
          </Panel>
          <Panel header="和OpenAI官网的GPT-4有什么区别？" key="6">
            <div>
              <div>
                解答：本网站基于gpt-3.5-turbo和gpt-4开发的，是官方提供的付费API接口。没有官方的AI版本新，但已经是第三方能接入的最新版本。
              </div>
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-invited.png?time=20230330"
                />
              </div>   
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-gpt-4.png?time=20230330"
                />
              </div>   
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-question-02.jpg?time=20230311"
                />
              </div>              
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-question-02.jpg?time=20230311"
                />
              </div>
              <div className="m-single-question-img-wrap">
                <Image
                  className="m-single-question-img"
                  src="http://static.xutongbao.top/img/m-question-03.jpg?time=20230311"
                />
              </div>
            </div>
          </Panel>
          <Panel header="聊天记录为什么会同步到群聊？" key="7">
            <div>
              <div>解答：默认同步到群聊，可以联系管理员隐身。</div>
            </div>
          </Panel>
          {/* <Panel header="注册账号后可以免费提问几次？" key="8">
            <div>
              <div>
                解答：三次
              </div>
            </div>
          </Panel> */}
          <Panel header="游客无法提问" key="9">
            <div>
              <div>解答：请注册账号</div>
            </div>
          </Panel>
          <Panel header="可以免费使用吗？" key="10">
            <div>
              <div>
                解答：可以。不过你需要帮忙推广一下。请在分享页获取分享链接和二维码。
              </div>
            </div>
          </Panel>
          <Panel header="我可以通过这个项目挣钱吗？" key="11">
            <div>
              <div>
                解答：可以。请在分享页获取分享链接和二维码，可以得到推广提成。
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    collapsed: state.getIn(['light', 'collapsed']),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetState(key, value) {
      dispatch({ type: 'SET_LIGHT_STATE', key, value })
    },
    onDispatch(action) {
      dispatch(action)
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index))
