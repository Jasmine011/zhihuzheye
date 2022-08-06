<template>
  <loader
    text="正在努力加载中"
    background="rgba(0,0,0,.6)"
    v-if="loading"
  ></loader>
  <div class="container">
    <global-header :user="user"></global-header>
    <!-- <home></home>
    <login></login> -->
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-linght mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2022 知乎者也</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from '@/components/Loader.vue'
import createMessage from '@/components/createMessage'
import { storeToRefs } from 'pinia'
import appStore from '@/store'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup() {
    const { user, loading, error } = storeToRefs(appStore.useUserStore)
    const hide = (e: boolean) => {
      error.value = { ...error.value, status: e }
    }

    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value
        if (status && message) {
          createMessage(message, 'error')
        }
      }
    )
    return {
      user,
      loading,
      error,
      hide
    }
  }
})
</script>

<style lang="less"></style>
