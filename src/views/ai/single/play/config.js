import { Button  } from 'antd'
import moment from 'moment'
import { renderImage } from '../../../../utils/tools'


//表格列字段
const getColumns = (props) => {
  return [
    {
      title: 'ID',
      dataIndex: 'uid',
      ellipsis: true,
    },
    {
      title: '课程ID',
      dataIndex: 'courseId',
      ellipsis: true,
    },
    {
      title: '课节名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '课节顺序号',
      dataIndex: 'orderNo',
      ellipsis: true,
    },
    {
      title: '封面图',
      dataIndex: 'coverImageCnd',
      ellipsis: true,
      render: renderImage,
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      ellipsis: true,
    },
    {
      title: '视频链接',
      dataIndex: 'urlCnd',
      ellipsis: true,
      render: (text, record) => (
        <div className='m-add-ellipsis' style={{ width: '120px' }}>
          <a href={text} target="_blank" rel="noreferrer">{text}</a>
        </div>
      ),
    },
    {
      title: '播放数',
      dataIndex: 'playCount',
      ellipsis: true,
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      ellipsis: true,
    },
    {
      title: '课程类型',
      dataIndex: 'lessonType',
      ellipsis: true,
      render: (text) => {
        let hook = {
          1: {
            title: '试看',
            className: 'grey',
          },
          2: {
            title: '付费',
            className: 'green',
          },
        }
        return (
          <span
            className={`m-tag-status ${hook[text] && hook[text].className}`}
          >
            {hook[text] && hook[text].title}
          </span>
        )
      },
    },
    {
      title: '课程状态',
      dataIndex: 'lessonStatus',
      ellipsis: true,
      render: (text) => {
        let hook = {
          1: {
            title: '未上线',
            className: 'grey',
          },
          2: {
            title: '已上线',
            className: 'green',
          },
        }
        return (
          <span
            className={`m-tag-status ${hook[text] && hook[text].className}`}
          >
            {hook[text] && hook[text].title}
          </span>
        )
      },
    },
    {
      title: '是否解锁',
      dataIndex: 'lock',
      ellipsis: true,
      render: (text) => {
        let hook = {
          1: {
            title: '未解锁',
            className: 'grey',
          },
          2: {
            title: '已解锁',
            className: 'green',
          },
        }
        return (
          <span
            className={`m-tag-status ${hook[text] && hook[text].className}`}
          >
            {hook[text] && hook[text].title}
          </span>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      ellipsis: true,
      render: (text) => {
        return moment(text - 0).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      ellipsis: true,
      render: (text) => {
        return moment(text - 0).format('YYYY-MM-DD HH:mm:ss')
      },
    },   
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true,
    },
    {
      title: '操作',
      //width: 220,
      ellipsis: true,
      fixed: 'right',
      render: (record) => {
        return (
          <div className="m-action">
            <Button
              className="m-action-btn"
              size="small"
              danger
              onClick={() => props.onDelete(record)}
            >
              删除
            </Button>
            <Button
              className="m-action-btn"
              size="small"
              onClick={() => props.onCheck(record)}
            >
              查看
            </Button>
            <Button
              className="m-action-btn"
              size="small"
              onClick={() => props.onEdit(record)}
            >
              编辑
            </Button>
          </div>
        )
      },
    },
  ]
}

export { getColumns }
