import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router/index'
import { setupStore } from "@/stores";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/assets/css/layout.css";
import "@/assets/css/form.css";

const app = createApp(App)

app.use(ElementPlus)
setupStore(app)
setupRouter(app)
app.mount('#app')
