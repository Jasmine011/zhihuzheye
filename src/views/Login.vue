<template>
  <div class="login-page">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">密码</label>
        <validate-input
          :rules="passwordRules"
          v-model="passwordVal"
          placeholder="请输入登录密码"
          type="password"
        ></validate-input>
      </div>
      <template #submit>
        <span class="btn btn-info">登录</span>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ValidateInput, { RuleProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/validateForm.vue'
import appStore from '../store/index'
import { useRouter } from 'vue-router'
import createMessage from '@/components/createMessage'

export default defineComponent({
  name: 'App',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const router = useRouter()
    const { login } = appStore.useUserStore
    // 邮箱值
    const emailVal = ref('111@test.com')
    // 密码
    const passwordVal = ref('111111')
    const emailRules: RuleProp[] = [
      { type: 'required', message: '电子邮箱不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordRules: RuleProp[] = [
      { type: 'required', message: '密码不能为空' },
      { type: 'range', message: '密码长度要在6-15位之间', min: 6, max: 15 }
    ]
    // 监听submit提交结果
    const onFormSubmit = (result: boolean) => {
      if (result) {
        // 如果验证通过，清空所有input，并且跳转路由
        // 清空input已经在validateForm中做好了，这里跳转路由就好了
        const loginData = {
          email: emailVal.value,
          password: passwordVal.value
        }

        login(loginData)
          .then(() => {
            router.push({ name: 'home' })
            createMessage('登录成功', 'success')
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
    return {
      emailRules,
      emailVal,
      passwordRules,
      passwordVal,
      onFormSubmit
    }
  }
})
</script>
