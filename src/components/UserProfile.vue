<template>
  <div class="user-profile-component">
    <div class="d-flex align-items-center">
      <img
        :src="column?.avatar?.url"
        class="rounded-circle img-thumbnail columnImg"
      />
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{ post && post.nickName }}</h6>
        <span class="text-truncate text-muted d-block">{{
          column?.description
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import appStore from '@/store'
import { storeToRefs } from 'pinia'
import { authorProps } from '@/store/column'
export default defineComponent({
  props: {
    post: {
      required: true,
      type: Object as PropType<authorProps>
    },
    columnId: {
      required: true,
      type: String
    }
  },
  setup(props) {
    const { getColumn } = appStore.useUserStore
    getColumn(props.columnId)
    const { column } = storeToRefs(appStore.useUserStore)

    return { column }
  }
})
</script>

<style lang="less" scoped>
.columnImg {
  height: 50px;
  width: 50px;
}
</style>
