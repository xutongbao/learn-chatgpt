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
  //匹配api开头的请求，实际转发的请求保api这三个字母
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:85',
      changeOrigin: true,
    })
  )
  //匹配sslCnd开头的请求，实际转发的请求去掉多余的sslCnd这六个字母
  app.use(
    '/sslCnd',
    createProxyMiddleware({
      target: 'http://cdn.xutongbao.top',
      changeOrigin: true,
      pathRewrite: {
        "^/sslCnd": ""
      }
    })
  )
}
