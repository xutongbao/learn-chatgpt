import React from 'react'
import moment from 'moment'

export default function CompanyState({ value = {}, onChange }) {
  let hook = {
    0: {
      title: '未提交',
      className: 'no-pass',
    },
    1: {
      title: '待审核',
      className: 'checking',
    },
    2: {
      title: '已通过',
      className: 'pass',
    },
    3: {
      title: '被拒绝',
      className: 'no-pass',
    },
    5: {
      title: '待审核',
      className: 'checking',
    },
  }
  return (
    <div
      className={`m-modal-check-msg ${
        value.bdAuditStatus !== undefined &&
        hook[value.bdAuditStatus] &&
        hook[value.bdAuditStatus].className
      }`}
    >
      商户状态（
      {value.bdAuditStatus !== undefined &&
        hook[value.bdAuditStatus] &&
        hook[value.bdAuditStatus].title}
      {value.bdAuditStatus === 0 && (
        <span>
          ，百度审核时间：
          {  value.bdAuditTime ? moment(value.bdAuditTime).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
      )}
      ）
    </div>
  )
}
