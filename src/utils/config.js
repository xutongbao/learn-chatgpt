const baseURL = {
  // 使用反向代理解决跨域时，dev应为空字符串
  //dev: '',
  dev: 'http://localhost:85', //192.168.0.137 localhost 192.168.1.107 172.20.10.4
  //dev: 'http://yuying-api.xutongbao.top',
  test: '',
  //prod: 'http://yuying-api.xutongbao.top',
  prod: '' //使用nginx代理解决https请求转发到http
}[process.env.REACT_APP_MODE]

const socketBaseURL = {
  // 使用反向代理解决跨域时，dev应为空字符串
  //dev: '',
  dev: 'http://localhost:84', //192.168.0.137 localhost 192.168.1.107 172.20.10.4:84
  //dev: 'http://yuying-api.xutongbao.top',
  test: '',
  //prod: 'http://yuying-api.xutongbao.top',
  prod: '' //使用nginx代理解决https请求转发到http
}[process.env.REACT_APP_MODE]

console.log(process.env, process.env.REACT_APP_MODE)

const imageBaseUrl = {
  dev: 'http://localhost:85/',
  test: 'hhttp://yuying-api.xutongbao.top/',
  prod: 'http://yuying-api.xutongbao.top/',
}[process.env.REACT_APP_MODE]

const nodeBaseURL = {
  dev: 'http://localhost:81',
  test: 'https://efficacious-tiny-infinity.glitch.me',
  prod: 'https://efficacious-tiny-infinity.glitch.me',
}[process.env.REACT_APP_MODE]

export { baseURL, socketBaseURL, imageBaseUrl, nodeBaseURL }
