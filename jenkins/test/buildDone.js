const axios = require('axios')
const { getBaseURL, getJenkinsProjectName } = require('../util/tools')

const { baseURL } = getBaseURL()

//项目名称
const name = '知了好客'

const getRemarks = () => {
  const remarks = {
    'origin/release/ui20210720': '和线上代码同步',
    'origin/feature/login': '开发中',
    'origin/feature/newName': '知了好客改为知了好学'
  }[process.env.branch]

  if (remarks) {
    return remarks
  } else {
    return '自动'
  }
}

// 发邮件
const email = async () => {
  const emailData = {
    type: 'jenkins',
    title: '构建成功-测试环境',
    name,
    gitRepositorieName: process.env.gitRepositorieName,
    jenkinsProjectName: getJenkinsProjectName({ cd: process.env.cd }),
    branch: process.env.branch,
    url: `${baseURL}/${process.env.pipeline}/${process.env.gitRepositorieName}/${process.env.branch}`,
    remarks: getRemarks(),
  }
  await axios
    .post(`${baseURL}/api/log/email`, {
      ...emailData,
    })
    .then((res) => {
      console.log('E-Mail sent successfully!')
    })
    .catch((error) => {
      console.error(error)
    })
}

// 添加构建记录
const handleAddRecord = async () => {
  const dataItem = {
    id: Date.now(),
    name,
    gitRepositorieName: process.env.gitRepositorieName,
    jenkinsProjectName: getJenkinsProjectName({ cd: process.env.cd }),
    branch: process.env.branch,
    projectType: 'web',
    url: `${baseURL}/${process.env.pipeline}/${process.env.gitRepositorieName}/${process.env.branch}`,
    remarks: getRemarks(),
  }
  await axios
    .post(`${baseURL}/api/jenkins/add`, {
      dataItem,
    })
    .then((res) => {
      console.log('Record added successfully!')
    })
    .catch((error) => {
      console.error(error)
    })
}

(async () => {
  await email()
  await handleAddRecord()
})()

