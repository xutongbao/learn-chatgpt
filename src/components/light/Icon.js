import React from "react"

export default function Icon(props) {
  let { name, className, title } = props
  return (
    <span
      className={`icon iconfont icon-${name} ${className ? className : ""}`}
      onClick={props.onClick}
      title={title}
    ></span>
  )
}
