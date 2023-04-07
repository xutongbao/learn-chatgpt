import React, { useState, useEffect } from 'react'
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js'
import { Input, message } from 'antd'
// https://jpuri.github.io/react-draft-wysiwyg/#/docs
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import urls from '../../api/urls'
import axios from 'axios'
import {
  htmlFormat,
  addUploadToken,
  addUploadExtraData,
} from '../../utils/tools'
const { TextArea } = Input

//image position is lost when converting from html to EditorState
//参考链接：https://github.com/jpuri/html-to-draftjs/issues/101
// https://github.com/jpuri/html-to-draftjs/blob/master/src/library/index.js
export default function MyEditor(props) {
  const { value = {}, onChange } = props

  //把html字符传转换成富文本要求的格式
  const formatEditorState = (text) => {
    //解决image位置无法保存的bug
    let html = ''
    if (text) {
      html = htmlFormat(text)
    }
    const contentBlock = htmlToDraft(html)
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    )
    const result = EditorState.createWithContent(contentState)
    return result
  }
  const [editorState, setEditorState] = useState(formatEditorState(value.text))

  const handleChange = (value) => {
    setEditorState(value)
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    html = htmlForJava(html)
    //console.log(html)
    //提交给后端的是html字符串
    onChange({
      isChange: false,
      text: html,
    })
  }

  //图片上传
  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      let formData = new FormData()
      formData.append('file', file)
      formData.append('ctype', 'course')
      formData.append('loginUserId', addUploadExtraData().loginUserId)
      axios(urls.light.uploadFile, {
        method: 'POST',
        data: formData,
        headers: {
          ...addUploadToken(),
        },
      })
        .then((res) => {
          if (res.data.state === 1) {
            resolve({ data: { link: res.data.data.fileImg } })
          } else {
            message.error('图片上传失败', 2)
            reject(res)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  useEffect(() => {
    //课程图片列表上传的图片尾部有一个加号，点击加号会自动把图片插入到富文本框光标所在的位置
    if (value.isChange) {
      const contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        value.text
      )
      const temp = EditorState.push(
        editorState,
        contentState,
        'insert-characters'
      )
      let html = draftToHtml(convertToRaw(temp.getCurrentContent()))
      html = html
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/div/g, 'p')
      html = htmlForJava(html)
      setEditorState(formatEditorState(html))

      //提交给后端的是html字符串
      onChange({
        isChange: false,
        text: html,
      })
    }
    // eslint-disable-next-line
  }, [value])

  const htmlForJava = (html) => {
    const newHtml = html
      .replace(/div/g, 'p')
      .replace(/h1/g, 'p')
      .replace(/h2/g, 'p')
      .replace(/h3/g, 'p')
      .replace(/h4/g, 'p')
      .replace(/h5/g, 'p')
      //.replace(/span/g, 'p')
      .replace(/&nbsp;/g, '')
      .replace(/<img.*>/g, (word) => {
        if (typeof word === 'string') {
          if (typeof word === 'string' && word.includes('data-done="true"')) {
            return word
          } else {
            word = word.split('')
            word.splice(5, 0, 'data-done="true" ')
            word = word.join('')
            return `<p>${word}</p>`
          }
        } else {
          return word
        }
      })
    //.replace(/<p><\/p>/g, '')
    //.replace(/<p><p/g, '<p')
    //.replace(/<\/p><\/p>/g, '</p>')

    return newHtml
  }

  return (
    <div>
      <Editor
        editorState={editorState}
        wrapperClassName="m-my-editor-wrapper"
        editorClassName="demo-editor"
        localization={{
          locale: 'zh',
        }}
        onEditorStateChange={handleChange}
        toolbar={{
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: false, // 是否显示排列按钮 相当于text-align
            uploadCallback: uploadImageCallBack,
            previewImage: true,
            inputAccept: 'image/*',
            alt: { present: false, mandatory: false, previewImage: true },
          },
        }}
      />
      <TextArea
        disabled
        value={htmlForJava(
          draftToHtml(convertToRaw(editorState.getCurrentContent()))
        )}
        autoSize={{ minRows: 5, maxRows: 10 }}
      ></TextArea>
      {/* <div className="m-input-footer-msg">
        不能直接复制word里的文字到富文本框里，先把word里的文字复制到文本文档里，然后再从文本文档复制到富文本框里
      </div> */}
    </div>
  )
}
