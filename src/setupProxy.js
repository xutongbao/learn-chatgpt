const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  //通过代理解决跨域
  app.use(
    '/zlhx',
    createProxyMiddleware({
      //target: 'http://test-zhiliao.gongzuoshouji.cn',
      target: 'http://api-zlhx.gongzuoshouji.cn',
      changeOrigin: true,
    })
  )
  //通过代理解决跨域
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:85',
      changeOrigin: true,
    })
  )
}
