import React, { useState } from 'react'
import { Tree } from 'antd'
//import { DownOutlined } from '@ant-design/icons'
import Icon from './Icon'

const { DirectoryTree } = Tree

export default function MenuListSidebar(props) {
  const { title, workspacesSelectKeys, onSelect } = props
  const [isOpen, setIsOpen] = useState(localStorage.getItem('workspacesIsOpen') === 'false' ? false : true)

  const handleClick = () => {
    let temp = !isOpen
    setIsOpen(temp)
    console.log(temp)
    localStorage.setItem('workspacesIsOpen', temp)
    
  }

  return (
    <div className={`m-menu-list-sidebar ${isOpen ? '' : 'close'}`}>
      <Icon
        title={isOpen ? '隐藏工作空间' : '打开工作空间'}
        name="arrow"
        className={`m-menu-list-sidebar-arrow ${isOpen ? '' : 'rotate'}`}
        onClick={handleClick}
      ></Icon>
      <div className={`${isOpen ? '' : 'm-hide'}`}>
        <div className="m-menu-list-title">{title}</div>
        <div className="m-directory-tree-wrap">
          <DirectoryTree
            className="m-directory-tree"
            defaultExpandedKeys={['0']}
            selectedKeys={workspacesSelectKeys}
            onSelect={onSelect}
            treeData={[
              {
                title: '筛选',
                key: '0-0',
                children: [
                  {
                    title: '全部',
                    key: '0',
                    isLeaf: true
                  },
                  {
                    title: '我的',
                    key: '1',
                    isLeaf: true
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
