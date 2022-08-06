<template>
  <div class="column-detail-page w-75 mx-auto">
    <div
      class="column-info row mb-4 border-bottom pb-4 align-items-center"
      v-if="column"
    >
      <div class="col-3 text-center">
        <img
          :src="column.avatar && column.avatar.url"
          :alt="column.title"
          class="rounded-circle border w-100 img-class"
        />
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list v-if="list" :list="list"></post-list>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { defineComponent } from 'vue'
import PostList from '../components/PostList.vue'
import appStore from '@/store'
import { storeToRefs } from 'pinia'

export default defineComponent({
  components: { PostList },
  setup() {
    const { getColumn, getArticleList } = appStore.useUserStore
    const { column, posts } = storeToRefs(appStore.useUserStore)

    // 获取专栏文章列表
    const route = useRoute()
    const currentId = route.params.id

    getColumn(currentId.toString())
    getArticleList(currentId.toString())

    return { column, list: posts }
  }
})
</script>

<style lang="less" scoped>
.img-class {
  width: 100px !important;
  aspect-ratio: 1/1;
}
</style>
