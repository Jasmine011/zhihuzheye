// 基于axios封装的请求模块
import axios, { AxiosRequestConfig } from 'axios'
// 引入nprogress进度条插件
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
import { storeToRefs } from 'pinia'
import appStore from '@/store'
import { getItem } from '@/utils/storage'

// 创建实例时配置默认值
const request = axios.create({
  baseURL: 'https://apis.imooc.com/api',
  timeout: 5000
})
// 添加请求拦截器
request.interceptors.request.use(function (config:AxiosRequestConfig) {
  const { loading, error, token } = storeToRefs(appStore.useUserStore)
  // 开始之前

  error.value = { status: false, message: '' }
  if (config.headers && token) {
    config.headers.Authorization = `Bearer ${getItem('TOKEN')}`
  }
  // 开启loading
  loading.value = true
  // nprogress加载进度条样式
  nprogress.start()
  // 在发送请求之前做些什么
  // 本项目后端要求要加icode才可以有权限访问
  // 如果是get请求，直接添加到url即可
  config.params = { ...config.params, icode: '4AD9AF0DD6561AA1' }
  // 如果是其他请求类型，添加到body中
  // 如果是上传文件，添加到FormData中
  if (config.data instanceof FormData) {
    config.data.append('icode', '4AD9AF0DD6561AA1')
    // 如果是普通的body对象，添加到data中
  } else {
    config.data = { ...config.data, icode: '4AD9AF0DD6561AA1' }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  const { loading } = storeToRefs(appStore.useUserStore)
  loading.value = false
  // 在这里对返回的数据进行处理
  nprogress.done()
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, function (err) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  const { error, loading } = storeToRefs(appStore.useUserStore)
  error.value = { status: true, message: err.response.data.error }
  loading.value = false

  return Promise.reject(err)
})
export default request
