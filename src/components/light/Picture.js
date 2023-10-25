import { Image } from 'antd'

export default function Picture({ value = {}, onChange }) {
  return <div>{value ? <Image src={value} width={80}></Image> : null}</div>
}
