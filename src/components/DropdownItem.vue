<template>
  <li
    class="dropdown-option"
    :class="{ 'is-disabled': disabled }"
    @click.prevent="offDropdown"
  >
    <slot></slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { emitter } from './Dropdown.vue'
export default defineComponent({
  name: 'DropdownItem',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    // 点击完菜单栏就关闭菜单栏
    const offDropdown = () => {
      emitter.emit('foo', false)
    }
    return { offDropdown }
  }
})
</script>

<style lang="less" scoped>
.dropdown-option {
  &.is-disabled {
    color: #6c757d;
    pointer-events: none;
    background-color: transparent;
  }
}
</style>
