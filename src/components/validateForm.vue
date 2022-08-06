<template>
  <form class="validate-form-container">
    <slot name="default"></slot>
    <div class="submit-area" @click="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt, { Emitter } from 'mitt'
type validateFunc = () => boolean
type clearInputFunc = () => void
type Events = {
  'form-item-create': validateFunc
  'form-item-clear': clearInputFunc
}
export const emitter: Emitter<Events> = mitt<Events>()
export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    let funcArr: Array<validateFunc> = []
    let clearFunArr: Array<clearInputFunc> = []
    const submitForm = () => {
      // 执行所有input的验证，并且返回all结果
      const result = funcArr.map((func) => func()).every((result) => result)
      // 如果验证通过，清空所有input，并且跳转路由
      /* if (!result) {
        clearFunArr.map((fun) => fun())
      } */
      context.emit('form-submit', result)
    }
    const callback = (func: validateFunc) => {
      // 这样我们点击提交按钮会获得每个input的验证函数，我们把验证函数放一起
      funcArr.push(func)
    }
    emitter.on('form-item-create', callback)
    const clearCallback = (func: clearInputFunc) => {
      clearFunArr.push(func)
    }
    emitter.on('form-item-clear', clearCallback)
    onUnmounted(() => {
      emitter.off('form-item-create', callback)
      // emitter.off('form-item-clear', clearCallback)
      funcArr = []
      clearFunArr = []
    })
    return { submitForm }
  }
})
</script>
