import {createApp} from "vue";
import App from "./App.vue";
import {createPinia} from "pinia";
import {router} from "@/router/index.js";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import ElementPlus from "element-plus";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'virtual:windi.css'
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "nprogress/nprogress.css"
import "./permission.js" //导入路由权限
//导入自定义指令
import permission from "@/directives/permission.js"

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
//使用路由
app.use(router);
//使用pinia
app.use(pinia);
//全局导入icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(ElementPlus, {
    locale: zhCn,
});
//使用自定义指令
app.use(permission)
app.mount("#app");

