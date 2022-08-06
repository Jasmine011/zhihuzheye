<template>
  <div class="dropdown" ref="dropdownRef">
    <a class="btn btn-outline-light my-2 dropdown-toggle" @click="toggleOpen">{{
      title
    }}</a>
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutside'
import mitt from 'mitt'
type Events = {
  foo: boolean
}
export const emitter = mitt<Events>()
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup() {
    // 控制下拉显示隐藏
    const isOpen = ref(false)
    // 点击切换显示隐藏
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    const dropdownRef = ref<null | HTMLElement>(null)
    // 点击除dropdown以外的其他位置，下来菜单隐藏
    const isClickOutside = useClickOutside(dropdownRef)
    watch(isClickOutside, () => {
      if (isClickOutside.value && isOpen.value) {
        isOpen.value = false
      }
    })
    emitter.on('foo', function (val) {
      isOpen.value = val
    })
    return { isOpen, toggleOpen, dropdownRef }
  }
})
</script>

<style lang="less" scoped></style>
