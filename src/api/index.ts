import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { loginDataProps } from '@/store/column'
export interface setUsersProps {
  email: string
  nickName: string
  password: string
}
// column请求数据
export interface columnDataProps{
  page?:number,
  size?:number
}
// 获取专栏列表
export const getColumns = (data:columnDataProps):AxiosPromise => {
  const { page, size } = data
  return request({
    url: `/columns?currentPage=${page}&pageSize=${size}`,
    method: 'GET'
  })
}
// 获取被点击的专栏信息
export const getColumn = (cid:string):AxiosPromise => {
  return request({
    url: `/columns/${cid}`,
    method: 'GET'
  })
}

// 发送请求, 获得属于专栏的文章列表
export const getArticles = (id:string):AxiosPromise => {
  return request({
    url: `/columns/${id}/posts`,
    method: 'GET'
  })
}
// 登录
export const toLogin = (data:loginDataProps):AxiosPromise => {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}
// 获取登录用户的信息
export const getUserInfo = ():AxiosPromise => {
  return request({
    url: '/user/current',
    method: 'GET'
  })
}

// 注册新用户
export const setUsers = (data:setUsersProps):AxiosPromise => {
  return request({
    url: '/users',
    method: 'POST',
    data
  })
}

// 上传文件(文章图片)
export const createPost = (url:string, data:unknown):AxiosPromise => {
  return request({
    url,
    method: 'POSt',
    data
  })
}

// 上传文章(分上传文章和编辑文章两种情况)
export const createPostArticle = (data:unknown, id?:string):AxiosPromise => {
  if (id) {
    return request({
      url: `/posts/${id}`,
      method: 'PATCH',
      data
    })
  } else {
    return request({
      url: '/posts',
      method: 'POSt',
      data
    })
  }
}
export const delArticle = (id:string):AxiosPromise => {
  return request({
    url: `/posts/${id}`,
    method: 'DELETE'
  })
}

// /posts/{id}
// 获取文章详情
export const getArticleInfo = (id:string):AxiosPromise => {
  return request({
    url: `/posts/${id}`,
    method: 'GET'
  })
}
