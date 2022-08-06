import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { registerStore } from '@/store'
import router from './router'

import 'easymde/dist/easymde.min.css'
import './router/permission'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
registerStore()
app.use(router).mount('#app')
