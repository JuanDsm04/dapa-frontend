import './assets/styles/base.css'
import router from "./router";
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(Vue3Toastify, {
  autoClose: 2000,
} as ToastContainerOptions,
)

app.mount('#app')
