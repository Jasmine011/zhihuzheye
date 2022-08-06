<template>
  <teleport to="#back"
    ><div
      class="loading-container"
      :style="{ backgroundColor: background || '' }"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ text || 'Loading...' }}</span>
      </div>
      <p v-if="text" class="text-primary small">{{ text }}</p>
    </div></teleport
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup() {
    useDOMCreate('back')
  }
})
</script>

<style lang="less" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
