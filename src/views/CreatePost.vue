<template>
  <div class="create-post-page">
    <h4>{{ isEditMode ? '编辑文章' : '新建文章' }}</h4>
    <uploader
      action="/upload"
      :beforeUpload="uploadCheck"
      @fileUploaded="fileUploaded"
      @uploadedError="uploadedError"
      :uploaded="uploadData"
      class="d-flex justify-content-center align-items-center bg-light text-secondary w-100 my-4"
    >
      <h2>点击上传图片</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="uploadedMsg">
        <img
          :src="uploadedMsg.uploadedData.url"
          :alt="
            uploadedMsg.uploadedData.filename &&
            uploadedMsg.uploadedData.filename
          "
          class="uploadImg"
        />
      </template>
    </uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <editor
          v-model="contentVal"
          :options="editorOptions"
          @blur="checkEditor"
          ref="editorRef"
          :class="{ 'is-invalid': !editorStatus.isValid }"
        ></editor>
        <span v-if="!editorStatus.isValid" class="invalid-feedback mt-1">{{
          editorStatus.message
        }}</span>
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">
          {{ isEditMode ? '保存更改' : '发布文章' }}
        </button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import ValidateInput, { RuleProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/validateForm.vue'
import Uploader from '@/components/uploader.vue'
import { responseType, UploadArticle } from '@/store/column'
import createMessage from '@/components/createMessage'
import { beforeUploadCheck } from '@/utils/helper'
import { storeToRefs } from 'pinia'
import appStore from '@/store'
import { useRouter, useRoute } from 'vue-router'
// import EasyMDE from 'easymde'
import EasyMDE, { Options } from 'easymde'
import Editor from '@/components/Editor.vue'
interface EditorInterface {
  clear: () => void
  getMDEInstance: () => EasyMDE | null
}
export default defineComponent({
  components: {
    ValidateInput,
    ValidateForm,
    Uploader,
    Editor
  },
  setup() {
    // deitor组件的状态
    const editorStatus = reactive({
      isValid: true,
      message: ''
    })
    const uploadData = ref() // 存储编辑文章前，发起获取文章请求，获得的文章信息
    const route = useRoute()
    const router = useRouter()
    const titleVal = ref('')
    const contentVal = ref('')
    // 上传完图片获得的图片id
    const imgId = ref('')
    // 是否是编辑状态
    const isEditMode = !!route.query.id
    const editorOptions: Options = {
      spellChecker: false // 关闭拼写检查（它会把中文认作错误标红）
    }
    // markdown编辑器的容器节点
    const textArea = ref<null | HTMLTextAreaElement>(null)
    // editor组件节点
    const editorRef = ref<EditorInterface | null>()
    // 完成editor的检查
    const checkEditor = () => {
      if (contentVal.value.trim() === '') {
        editorStatus.isValid = false
        editorStatus.message = '文章详情不能为空'
      } else {
        editorStatus.isValid = true
        editorStatus.message = ''
      }
    }
    onMounted(() => {
      // 如果这个节点存在
      // if (textArea.value) {
      //   const easyMDE = new EasyMDE({ element: textArea.value })
      // }
      if (isEditMode) {
        const { getArticle } = appStore.useUserStore
        const articleId = route.query.id as string
        getArticle(articleId).then((data) => {
          if (data.image) {
            uploadData.value = { data: data.image }
          }
          titleVal.value = data.title
          contentVal.value = data.content || ''
        })
      }
    })
    // 检查上传文件
    /*  const beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPG) {
        createMessage('上传图片只能是JPG、PNG格式！', 'error')
      }
      return isJPG
    } */
    // 验证图片文件格式、大小
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是JPG/PNG格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片不能大于1M', 'error')
      }
      return passed
    }
    // 上传成功的回调
    const fileUploaded = (rawData: responseType) => {
      // 上传成功后把图片id保存下来，上传文章的时候要用
      if (rawData.data._id) {
        imgId.value = rawData.data._id
      }
      createMessage(`上传${rawData.data.filename}图片成功`, 'success')
    }
    // 上传错误的回调
    const uploadedError = (err: string) => {
      createMessage(`${err}上传图片失败，请重新尝试`, 'error')
    }
    const titleRules: RuleProp[] = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      checkEditor()
      if (result && editorStatus.isValid) {
        const { user } = storeToRefs(appStore.useUserStore)
        const { createArticle } = appStore.useUserStore
        if (user.value.column && user.value._id) {
          const newPost: UploadArticle = {
            title: titleVal.value, // 标题
            content: contentVal.value, // 内容（支持markdown）
            column: user.value.column, // 专栏信息
            author: user.value._id // 作者
          }
          // 可以允许没有图片的存在
          if (imgId.value) {
            newPost.image = imgId.value // 文章图片的id，之前上传图片会获得id
          }
          const actionName = isEditMode ? 'updataPost' : 'createPost'
          const sendData = isEditMode
            ? { id: route.query.id as string, payload: newPost }
            : newPost
          createArticle(sendData, actionName).then(() => {
            createMessage('文章发布成功,2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              // 跳转到文章列表页面
              router.push({ name: 'column', params: { id: user.value.column } })
            }, 2000)
          })
        }
      }
    }

    return {
      onFormSubmit,
      titleVal,
      contentVal,
      titleRules,
      uploadCheck,
      fileUploaded,
      uploadedError,
      uploadData,
      isEditMode,
      textArea,
      editorOptions,
      editorRef,
      checkEditor,
      editorStatus
    }
  }
})
</script>

<style lang="less" scoped>
.uploadImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
