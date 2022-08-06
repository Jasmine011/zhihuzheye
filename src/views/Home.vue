<template>
  <div class="home-page">
    <h1 v-if="error.status">{{ error.message }}</h1>
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/CreatePost" class="btn btn-primary my-2"
              >开始写文章</router-link
            >
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list v-if="columnList" :list="columnList"></column-list>
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
      @click="loadMorePage"
      v-if="!isLastPage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import ColumnList from '../components/ColumnList.vue'
import useLoadMore from '@/hooks/useLoadMore'
import appStore from '@/store'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'Home',
  components: { ColumnList },
  setup() {
    const { getColumnList } = appStore.useUserStore
    const { columnPage, loading, error, columnTotal, columns } = storeToRefs(
      appStore.useUserStore
    )

    onMounted(() => {
      getColumnList({ size: 3 })
    })
    const { loadMorePage, isLastPage } = useLoadMore(
      getColumnList,
      columnTotal,
      { page: columnPage.value ? columnPage.value + 1 : 2, size: 3 }
    )

    return {
      columnList: columns,
      loading,
      error,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
