<template>
  <teleport to="#message">
    <div
      v-if="isShow"
      class="alert message-info"
      :class="classObj"
      role="alert"
    >
      <span>{{ message }}</span>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="hide"
      ></button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export type MessageType = 'success' | 'error' | 'default'
export default defineComponent({
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup(props, context) {
    useDOMCreate('message')
    const isShow = ref(true)
    const hide = () => {
      isShow.value = false
      context.emit('close-message', false)
    }
    const classObj = reactive({
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    })
    return { isShow, hide, classObj }
  }
})
</script>

<style lang="less" scoped>
.message-info {
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  .btn-close {
    margin-left: 40px;
  }
}
</style>
