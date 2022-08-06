<template>
  <div class="vue-easymde-editor">
    <textarea ref="textArea"></textarea>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
  onUnmounted,
  defineExpose,
  watch
} from 'vue'
// 一个类型，里面包含很多属性
import EasyMDE, { Options } from 'easymde'
// 属性类型
interface EditorProps {
  modelValue?: string
  options?: Options // 功能
}
// 事件类型
interface EditorEvents {
  (type: 'update:modelValue', value: string): void // v-model
  (type: 'change', value: string): void // 值发生变化时触发
  (type: 'blur'): void // 编辑器失去焦点时
}
const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEvents>()
// 有了模板，我们还需要一些初始数据
const textArea = ref<null | HTMLTextAreaElement>(null)
let easyMDEInstance: EasyMDE | null = null
const innerValue = ref(props.modelValue || '')
watch(
  () => props.modelValue,
  (newVal) => {
    if (easyMDEInstance) {
      if (newVal !== innerValue.value) {
        easyMDEInstance.value(newVal || '')
      }
    }
  }
)
onMounted(() => {
  if (textArea.value) {
    // 组装options
    const config: Options = {
      ...(props.options || {}), // 把默认的options加进去
      element: textArea.value,
      initialValue: innerValue.value
    }
    easyMDEInstance = new EasyMDE(config)
    // 监控对应的事件
    easyMDEInstance.codemirror.on('change', () => {
      if (easyMDEInstance) {
        // easyMDEInstance.value()可以得到当前编辑器输入框里的值
        const updatedValue = easyMDEInstance.value()
        innerValue.value = updatedValue
        emit('update:modelValue', updatedValue)
        emit('change', updatedValue)
      }
    })
    easyMDEInstance.codemirror.on('blur', () => {
      if (easyMDEInstance) {
        emit('blur')
      }
    })
  }
})
onUnmounted(() => {
  // 销毁对应实例
  // EasyMDE提供的销毁方法
  if (easyMDEInstance) {
    easyMDEInstance.cleanup()
  }
  easyMDEInstance = null
})
// 定义一些方法
// 清空编辑器
const clear = () => {
  if (easyMDEInstance) {
    easyMDEInstance.value('')
  }
}
// 可以返回对应的实例
const getMDEInstance = () => {
  return easyMDEInstance
}
// 在setup语法糖中，是封闭的，想要把属性和方法暴露出去需要用defineExpose编译器宏
defineExpose({
  clear,
  getMDEInstance
})
</script>

<style lang="less" scoped>
.vue-easymde-editor.is-invalid {
  border: 1px solid #dc3545;
}
</style>
