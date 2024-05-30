import '@/styles/main.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
