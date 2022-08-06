<template>
  <div class="signup-page mx-auto p-3 w-330">
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rules="emailRules"
          v-model="emailVal"
          placeholder="请输入邮箱地址"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          :rules="nameRules"
          v-model="nameVal"
          placeholder="请输入昵称"
          type="text"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          :rules="passwordRules"
          v-model="passwordVal"
          placeholder="请输入密码"
          type="password"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          :rules="repeatPasswordRules"
          v-model="repeatPasswordVal"
          placeholder="请再次输入密码"
          type="password"
        ></validate-input>
      </div>
      <template #submit>
        <span type="submit" class="w-100 btn btn-primary btn-block btn-large"
          >注册新用户</span
        >
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import ValidateInput, { RuleProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/validateForm.vue'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import appStore from '@/store'
export default defineComponent({
  components: {
    ValidateForm,
    ValidateInput
  },
  setup() {
    const router = useRouter()
    const emailVal = ref('')
    const nameVal = ref('')
    const passwordVal = ref('')
    const repeatPasswordVal = ref('')
    const emailRules: RuleProp[] = [
      { type: 'required', message: '电子邮箱不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RuleProp[] = [
      { type: 'required', message: '昵称不能为空' },
      { type: 'range', message: '昵称长度要在1-7位之间', min: 1, max: 7 }
    ]
    const passwordRules: RuleProp[] = [
      { type: 'required', message: '密码不能为空' },
      { type: 'range', message: '密码长度要在6-15位之间', min: 6, max: 15 }
    ]
    const repeatPasswordRules: RuleProp[] = [
      { type: 'required', message: '重复密码不能为空' },
      { type: 'range', message: '重复密码长度要在6-15位之间', min: 6, max: 15 },
      {
        type: 'custom',
        message: '密码不相同',
        validator: () => {
          return passwordVal.value === repeatPasswordVal.value
        }
      }
    ]
    const { toSetUsers } = appStore.useUserStore
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const signupData = {
          email: emailVal.value,
          nickName: nameVal.value,
          password: passwordVal.value
        }
        toSetUsers(signupData)
          .then(() => {
            router.push({ name: 'login' })
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
    return {
      onFormSubmit,
      emailVal,
      nameVal,
      passwordVal,
      repeatPasswordVal,
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules
    }
  }
})
</script>

<style lang="less" scoped>
.w-330 {
  max-width: 330px;
}
.w-100 {
  width: 100%;
}
</style>
