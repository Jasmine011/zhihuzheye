import { columnDataProps, getColumns, getColumn, getArticles, toLogin, getUserInfo, setUsers, setUsersProps, createPost, createPostArticle, getArticleInfo, delArticle } from '@/api'
import { defineStore } from 'pinia'
import { setItem, getItem, delItem } from '@/utils/storage'
// 上传文件成功后返回的数据类型
interface responseDatType{
  _id: string,
  url: string, // 图片地址
  createdAt:string, // 创建时间
  filename:string, // 文件名
  extname:string // 文件格式
}
export interface responseType{
  code:number;
  msg:string,
  data:responseDatType
}
export interface ImageProps {
  _id?: string;
  url?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
  createdAt:string;
  __v:number;
  featured:boolean;
  author:string;
  key:number
}
export interface PostProps{
    _id: string,
    key:number
    title: string,
    column: string,
    image?: ImageProps,
    createdAt: string,
    excerpt: string,
    author?:string
}
export interface UserProps{
  isLogin:boolean;
  _id?:string;
  email?:string;
  nickName?:string;
  column?:string;
  description?:string;
  avatar?:ImageProps;
}
export interface loginDataProps{
  password:string,
  email:string
}
export interface GlobalErrorProps{
  status:boolean;
  message?:string;
}
export interface createPostDataProps{
  url:string,
  data:unknown
}
// 上传文章的格式
export interface UploadArticle{
  title: string, // 标题
  content: string, // 内容（支持markdown）
  image?: string, // 文章图片的id，之前上传图片会获得id
  column: string, // 专栏信息
  author: string // 作者
}
// 编辑文章的格式
export interface updataArticlePlus{
  id:string,
  payload:UploadArticle
}
export interface authorProps{
 email:string,
 nickName:string,
 _id:string
}
// 文章信息
export interface ArticleProps{
  column:string,
  content:string,
  createdAt:string,
  title:string,
  updatedAt:string,
  _id:string,
  image:ImageProps,
  author:authorProps
}
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      columns: <ColumnProps[]>[], // 专栏列表
      column: <ColumnProps|null>null, // 点击某个专栏的那个专栏信息
      columnTotal: <number>0,
      columnPage: <number>1,
      posts: <PostProps[]>[], // 专栏内文章列表信息
      // <UserProps>
      user: <UserProps>{ isLogin: false }, // 作者信息
      loading: <boolean>false, // 加载状态
      token: <string>getItem('TOKEN'),
      error: <GlobalErrorProps>{ status: false, message: '请求错误,请稍后再试' },
      article: <ArticleProps>{}
    }
  },
  actions: {
    // 登录
    async login(loginData:loginDataProps) {
      const { data } = await toLogin(loginData)
      if (data.code === 0) {
        setItem('TOKEN', data.data.token)
        this.getUserData()
      }
      // this.user = { ...this.user, isLogin: true, name: 'bob', id: 1 }
    },
    // 退出登录
    logout() {
      this.user.isLogin = false
      delItem('TOKEN')
    },
    // 获取用户信息
    async getUserData() {
      try {
        const { data } = await getUserInfo()
        this.user = { ...this.user, isLogin: true, ...data.data }
        return 'ok'
      } catch (err) {
        // return Promise.reject(new Error(err))
        return err
      }
    },
    // 错误处理
    setError(e:GlobalErrorProps) {
      this.error = e
    },
    // 注册新用户
    async toSetUsers(data:setUsersProps) {
      const result = await setUsers(data)
      return result
    },
    // 上传文件（文章图片）
    async createPost(createPostData:createPostDataProps) {
      // 向后台发送请求，并把新增文章push到末尾
      // console.log('向后台发送请求，并把新增文章push到末尾')
      const { url, data } = createPostData
      const result = await createPost(url, data)
      if (result.data.code === 0) {
        return result.data
      } else {
        return Promise.reject(new Error('file'))
      }
    },
    // 上传文章
    async createArticle(argument:UploadArticle|updataArticlePlus, actionName:string) {
      // 如果是编辑文章
      if (actionName === 'updataPost') {
        // console.log(actionName)
        // console.log((argument as updataArticlePlus).payload)
        const { data } = await createPostArticle((argument as updataArticlePlus).payload, (argument as updataArticlePlus).id)

        if (data.code === 0) {
          return data
        } else {
          return Promise.reject(new Error('file'))
        }
      } else {
        // 新增文章
        // console.log('set', argument)

        const { data } = await createPostArticle(argument)
        if (data.code === 0) {
          return data
        } else {
          return Promise.reject(new Error('file'))
        }
      }
    },
    // 删除文章
    async delPost(id:string) {
      return await delArticle(id)
    },
    // 获取专栏列表
    async getColumnList(columnsData:columnDataProps = {}) {
      const { page = 1, size = 3 } = columnsData
      const { data } = await getColumns({ page, size })
      if ((data.code) === 0) {
        this.columns = this.columns.concat(data.data.list)
        this.columnTotal = data.data.count
        this.columnPage = data.data.currentPage
      }
    },
    // 获取被点击的那个专栏信息
    async getColumn(cid:string) {
      // 先判断之前columns列表中有没有需要的data
      if (this.columns?.length) {
        const currentColumn = this.columns.filter(item => {
          return item._id === cid
        })
        if (!currentColumn.length) {
          // 没有就发请求
          const { data } = await getColumn(cid)
          if (data.code === 0) {
            if (!data.data.avatar) {
              data.data.avatar = { url: require('@/assets/column.png') }
            }
            this.column = data.data
          }
        } else {
          this.column = currentColumn[0]
        }
      }
    },
    // 点击文章，获取文章详情
    async getArticle(id:string) {
      const { data } = await getArticleInfo(id)
      if (data.code === 0) {
        this.article = data.data
        return data.data
      } else {
        return Promise.reject(new Error('err'))
      }
    },
    // 获取被点击专栏的文章列表
    async getArticleList(cid:string) {
      const { data } = await getArticles(cid)
      if (data.code === 0) {
        this.posts = data.data.list
      }
    }
  },
  getters: {
    columnList(state) {
      if (state.columns.length) {
        return state.columns.filter(column => {
          if (!column.avatar) {
            column.avatar = { url: require('@/assets/column.png') }
          }
        })
      }
    }
  }
})
