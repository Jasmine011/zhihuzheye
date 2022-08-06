<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      @click.prevent="triggerUpload"
      v-bind="$attrs"
    >
      <!-- 外面就可以通过插槽自定义上传样式了 -->
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary">正在上传</button>
      </slot>
      <slot
        v-else-if="fileStatus === 'success'"
        name="uploaded"
        :uploadedData="uploadedData"
      >
        <button class="btn btn-primary">成功上传</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>

<script lang="ts">
// 思路我们把input text='file'隐藏，我们点击一个我们自定义的btn按钮，给按钮绑定一个点击事件，点击按钮就给file一个点击事件。
import { defineComponent, ref, PropType, watch } from 'vue'
import appStore from '@/store'
// 上传状态
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type checkFunction = (file: File) => boolean
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<checkFunction>
    },
    // 用于编辑状态，把内容填充到页面
    uploaded: {
      type: Object
    }
  },
  emits: ['fileUploaded', 'uploadedError'], // 执行结果
  inheritAttrs: false,
  setup(props, context) {
    const { createPost } = appStore.useUserStore
    // ref元素
    const fileInput = ref<null | HTMLInputElement>(null)
    // 状态信息
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    const uploadedData = ref(props.uploaded) // 存储上传成功之后文件名
    // 点击我们自定义的btn，触发隐藏的file的点击事件
    watch(
      () => props.uploaded,
      (newValue) => {
        if (newValue) {
          fileStatus.value = 'success'
          uploadedData.value = newValue.data
        }
      }
    )
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    // file触发change时
    const handleFileChange = (e: Event) => {
      const currenTarget = e.target as HTMLInputElement
      if (currenTarget.files) {
        // 进入到这里说明已经选择了文件要开始上传了
        const files = Array.from(currenTarget.files)
        if (props.beforeUpload) {
          if (!props.beforeUpload(files[0])) {
            // 不符合条件，阻止程序向下执行
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        const requestData = { url: props.action, data: formData }
        createPost(requestData)
          .then((resp) => {
            fileStatus.value = 'success'
            context.emit('fileUploaded', resp)
            uploadedData.value = resp.data
          })
          .catch((error: string) => {
            fileStatus.value = 'error'
            context.emit('uploadedError', error)
          })
          .finally(() => {
            // 不管成功还是失败，把上传元素恢复成空值
            if (fileInput.value) {
              fileInput.value.value = ''
            }
          })
      }
    }
    return {
      uploadedData,
      fileStatus,
      fileInput,
      triggerUpload,
      handleFileChange
    }
  }
})
</script>

<style lang="less" scoped>
.file-upload-container {
  height: 200px;
  cursor: pointer;
}
</style>
