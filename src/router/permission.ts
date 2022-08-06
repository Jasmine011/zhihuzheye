// 路由守卫
import router from './index'
import { storeToRefs } from 'pinia'
import appStore from '@/store'
import { delItem } from '@/utils/storage'

router.beforeEach((to, from, next) => {
  const { user, token } = storeToRefs(appStore.useUserStore)
  const { getUserData } = appStore.useUserStore
  // 先判断是否登录
  if (user.value.isLogin) {
    // 已登录，不可以再去登录界面了
    if (to.path === '/login') {
      // console.log('已登录，不可以')
      next('/')
    } else {
      next()
    }
  } else {
    // 没有登录，如果有token，根据token获取用户信息，修改为已登录状态。
    // 获取用户信息失败，去往登录页面。
    // 没有token，判断去往的页面是否必须登录，是的话跳转到登录页面，不是的话放行
    if (token.value) {
      getUserData().then(() => {
        next()
      }).catch(() => {
        // 把过期的token删除，并且跳转到login
        delItem('TOKEN')
        next('/login')
      })
    } else {
      if (to.meta.requiredLogin) {
        // console.log('未登录，不可以')
        next('/login')
      } else {
        next()
      }
    }
  }
})
