// import { ImageProps } from '@/store/column'
// 这里的data是专栏column的avatar属性
/* export function generateFitUrl(data:ImageProps, width:number, height:number, format = ['m_pad']) {
  // 判断所属专栏是否有头像图片
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr},h_${height},w_${width}`
  }
} */
interface CheckCondition{
  format?:string[];
  size?:number;
}
interface beforeUploadCheckProp{
  passed:boolean,
  error:string|null
}
// 检查文件后返回的错误类型
type ErrorType='size'|'format'|null
// 参数：要检查的文件、检查条件
export function beforeUploadCheck(file:File, condition:CheckCondition):beforeUploadCheckProp {
  const { format, size } = condition
  // 文件类型是否合法
  const isValidFormat = format ? format.includes(file.type) : true
  // 文件大小是否合法(file文件是以字节为单位的，我们要把它转化成M)
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error:ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize, // 是否通过
    error // 错误类型
  }
}
