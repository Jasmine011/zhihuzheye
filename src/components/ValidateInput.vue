<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== 'textarea'"
      class="form-control"
      @blur="validateInput"
      v-model="inputRef.val"
      :class="{ 'is-invalid': inputRef.error }"
      v-bind="$attrs"
    />
    <textarea
      v-else
      class="form-control"
      @blur="validateInput"
      v-model="inputRef.val"
      :class="{ 'is-invalid': inputRef.error }"
      v-bind="$attrs"
    />
    <div class="invalid-feedback" v-if="inputRef.error">
      {{ inputRef.message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, computed } from 'vue'
import { emitter } from './validateForm.vue'
// 验证邮箱的规则
const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
export interface RuleProp {
  type: 'required' | 'email' | 'range' | 'custom'
  message: string
  max?: number
  min?: number
  validator?: () => boolean
}
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RuleProp[]>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  inheritAttrs: false,
  setup(props, context) {
    // 要验证的表单相关
    const inputRef = reactive({
      val: computed({
        get: () => props.modelValue || '',
        set: (val) => {
          context.emit('update:modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    // 回调，执行验证
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every((rule) => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'range':
              passed =
                (rule.max as number) >= inputRef.val.length &&
                inputRef.val.length >= (rule.min as number)
              break
            case 'custom':
              // 自定义
              passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      // 如果没有rule，那么直接返回true
      return true
    }
    // 清空input的方法
    const clearInput = () => {
      inputRef.val = ''
    }
    onMounted(() => {
      emitter.emit('form-item-create', validateInput)
      emitter.emit('form-item-clear', clearInput)
    })
    return { inputRef, validateInput }
  }
})
</script>
