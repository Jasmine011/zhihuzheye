<template>
  <div class="post-detail-page">
    <modal
      title="删除文章"
      :visible="modalIsShow"
      @modal-on-close="modalIsShow = false"
      @modal-on-confirm="deletePost"
    >
      <p>确定要删除文章吗？</p>
    </modal>
    <article class="w-75 mx-auto mb-5 pb-3">
      <div class="imgBox">
        <!-- <img :src="article.image && article.image.url" class="postImg" /> -->
        <img
          :src="article.image && article.image.url"
          class="rounded-lg img-fluid my-4 postImg"
        />
      </div>
      <h2 class="mb-4 mt-60">{{ article.title }}</h2>
      <div
        class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0"
      >
        <div class="col">
          <user-profile
            :post="article.author"
            :columnId="article.column"
            v-if="typeof article.author === 'object'"
          ></user-profile>
        </div>
        <span class="text-muted col text-right font-italic createdAT"
          >发表于：{{ article.createdAt }}</span
        >
      </div>
      <div v-html="contenHTML"></div>
      <div class="btn-group mt-5" v-if="showEditArea">
        <router-link
          type="button"
          class="btn btn-success"
          :to="{ name: 'CreatePost', query: { id: article._id } }"
          >编辑</router-link
        >
        <button
          type="button"
          class="btn btn-danger"
          @click="modalIsShow = true"
        >
          删除
        </button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import appStore from '@/store'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import UserProfile from '@/components/UserProfile.vue'
import { marked } from 'marked'
import Modal from '@/components/modal.vue'
import createMessage from '@/components/createMessage'
export default defineComponent({
  components: { UserProfile, Modal },
  setup() {
    // 点击删除按钮，切换显示删除确认框
    const modalIsShow = ref(false)
    const route = useRoute()
    const router = useRouter()
    const { getArticle, delPost } = appStore.useUserStore
    // 获取文章详情
    const articleId = route.params.id.toString()
    getArticle(articleId)
    const { article } = storeToRefs(appStore.useUserStore)
    // 通过正则表达式判断content是否是html标签，如果不是，就把markdown格式转化为HTML格式
    const reg = /<[^>]+>/g
    const contenHTML = computed(() => {
      if (article.value && article.value.content) {
        if (!reg.test(article.value.content)) {
          return marked.parse(article.value.content)
        } else {
          return article.value.content
        }
      }
      return true
    })
    // 编辑和删除的权限
    const showEditArea = computed(() => {
      const { isLogin, _id } = storeToRefs(appStore.useUserStore).user.value
      if (article.value && article.value.author && isLogin) {
        return article.value.author._id === _id
      }
      return false
    })
    // 点击删除按钮
    const deletePost = () => {
      delPost(articleId).then(() => {
        modalIsShow.value = false
        createMessage('删除成功，2秒钟之后跳转到专栏列表页', 'success', 2000)
        setTimeout(() => {
          router.push({ path: `/column/${article.value.column}` })
        }, 2000)
      })
    }
    return { modalIsShow, article, contenHTML, showEditArea, deletePost }
  }
})
</script>

<style lang="less" scoped>
.user-profile-component {
  display: flex;
  justify-content: space-between;
  .createdAT {
    margin-left: 150px;
  }
}
.mt-60 {
  margin-top: 60px;
}
.imgBox {
  height: 200px;
  cursor: pointer;
}
.postImg {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
