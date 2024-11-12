import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './utils/router';
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from './store';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

// createApp(App).mount('#app')
const app = createApp(App)

/* 注册导航守卫 */
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Hackers Note'; // 设置网页标题
    next(); // 继续路由导航
});
app.use(router)

/* 注册 element-plus 所有图标 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(ElementPlus)

app.use(store);

/* 注册 v-md-editor */
VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});
app.use(VueMarkdownEditor);

app.mount('#app')