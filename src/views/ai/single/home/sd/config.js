import { Form, Input } from 'antd'
import { UploadVideoToCND } from '../../../../../components/light'

let codeArr = [
  'actionscript3',
  'apache',
  'applescript',
  'asp',
  'brainfuck',
  'c',
  'cfm',
  'clojure',
  'cmake',
  'coffee',
  'coffeescript',
  'coffee',
  'cpp',
  'cs',
  'csharp',
  'c#',
  'css',
  'csv',
  'bash',
  'diff',
  'elixir',
  'erb',
  'go',
  'html',
  'http',
  'java',
  'javascript',
  'json',
  'jsx',
  'less',
  'lolcode',
  'make',
  'markdown',
  'matlab',
  'nginx',
  'objectivec',
  'pascal',
  'PHP',
  'Perl',
  'python',
  'profile',
  'rust',
  'salt',
  'saltstate',
  'shell',
  'sh',
  'zsh',
  'bash',
  'sql',
  'scss',
  'sql',
  'svg',
  'swift',
  'rb',
  'jruby',
  'ruby',
  'smalltalk',
  'vim',
  'viml',
  'volt',
  'vhdl',
  'vue',
  'xml',
  'yaml',
  'using',
]

codeArr.sort((a, b) => {
  return b.length - a.length
})

//添加编辑查看对话框表单字段
const getModalFields = ({ type, initValues, handleChangeFile }) => {
  return (
    <>
      <Form.Item
        label="上传文件"
        name="url"
        rules={[
          {
            required: true,
            message: '请上传文件！',
          },
        ]}
      >
        <UploadVideoToCND
          type={type}
          accept={'*.*'}
          videoDir={`ai/file`}
          imgUrlCnd={initValues.urlCdn}
          filePrefix={''}
          handleChangeFile={handleChangeFile}
        ></UploadVideoToCND>
      </Form.Item>
      <Form.Item
        label="文件名"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入文件名！',
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  )
}

const handleGetData = () => {
}

export { codeArr, getModalFields, handleGetData }
