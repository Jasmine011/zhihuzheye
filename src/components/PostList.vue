<template>
  <div class="post-list">
    <article
      v-for="post in newList"
      :key="post._id"
      class="card mb-3 shadow-sm"
      @click="toArticle(post._id)"
    >
      <div class="card-body">
        <h4>
          <router-link to="/">{{ post.title }}</router-link>
        </h4>
        <div class="row my-3 align-items-center">
          <div v-if="post.image" class="col-4">
            <img
              :src="post.image && post.image.url"
              :alt="post.title"
              class="rounded-lg w-100 img-class"
            />
          </div>
          <p :class="{ 'col-8': post.image }" class="text-muted">
            {{ post.excerpt }}
          </p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { PostProps } from '../store/column'
import { useRouter } from 'vue-router'
// import appStore from '@/store'
export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  },
  setup(props) {
    const router = useRouter()
    // const { getArticle } = appStore.useUserStore
    // 有的文章没有图片，加一个默认图
    const newList = computed(() => {
      return props.list.filter((item) => {
        if (!item.image) {
          item.image = { url: require('@/assets/default.png') }
        }
        return item
      })
    })
    const toArticle = (id: string) => {
      // getArticle(id)
      router.push({ path: `/PostDetail/${id}` })
    }
    return { newList, toArticle }
  }
})
</script>
<style lang="less">
.post-list {
  h4 {
    a {
      text-decoration: none;
      color: #1a1a1a;
    }
    a:hover {
      color: #0d6efd;
    }
  }
}

.img-class {
  width: 100px !important;
  aspect-ratio: 1/1;
}
</style>
