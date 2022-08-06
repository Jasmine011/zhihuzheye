// 一个加载更多的函数//ComputedRef
import { ref, computed, Ref } from 'vue'
export interface LoadParams{
  page?:number;// 加载第几页的数据
  size?:number;// 一次性加载多少页
}
type storeActionProps=(i:LoadParams)=>Promise<void>
// actionName:要传入pinia中action函数
// total：总页数
// params：请求需要的数据====currentPage：请求第几页的数据、pageSize：每次请求多少页
const useLoadMore = (actionName:storeActionProps, total:Ref<number>, params:LoadParams = { page: 1, size: 5 }) => {
  // 当前页码数
  const currentPage = ref(params.page)
  const requestParams = computed(() => ({
    page: currentPage.value,
    size: params.size
  }))

  // 点击加载更多的方法，页数加一
  const loadMorePage = () => {
    actionName(requestParams.value).then(() => {
      // 每次加载完，把下页数更新
      if (currentPage.value) {
        currentPage.value++
      }
    })
  }
  // 判断是否还有没有加载完的数据，全部加载完了就不显示加载更多按钮了，这里返回一个布尔值
  const isLastPage = computed(() => {
    // 最大页码数已经等于当前页码数了
    if (total.value && params.size && currentPage.value) {
      return Math.ceil(total.value / params.size) < currentPage.value
    } else {
      return false
    }
  })
  return {
    loadMorePage, isLastPage, currentPage
  }
}
export default useLoadMore
