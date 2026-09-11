import {createRouter, createWebHashHistory} from "vue-router";
import NotFound from "@/views/404.vue"
import BasicLayout from "@/layouts/BasicLayout.vue";

//静态路由 基础路由 所有用户共享
const routes = [
    {
        name: "dashboard",
        path: "/",
        component: BasicLayout,
    },
    {
        name: "Login",
        path: "/login",
        meta: {
            title: "用户登录",
        },
        component: () => import("@/views/Login.vue"),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        meta: {
            title: "404",
        },
        component: NotFound
    },
    {
        name: "About",
        path: "/about",
        meta: {
            title: "关于",
        },
        component: () => import("@/views/About.vue")
    }
];

//动态路由 用于匹配菜单动态添加路由 (利用 Vite 自动扫描所有 vue 文件)
const modules = import.meta.glob('/src/views/**/*.vue');

//创建路由 并导出
export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

//动态添加路由方法
export const addRoutes = (menus) => {
    //是否有新路由有标志
    let hasNewRoutes = false;

    //递归查找匹配的路由
    const findAddRoutesByMenus = (arr) => {
        arr.forEach(e => {
            //去动态路由中查找匹配的路由项 (仅针对 type === 1 的菜单页面)
            if (e.type === 1 && e.component) {
                // 修复原代码 Bug：hasRoute 必须判断 name，不能判断 path
                if (e.name && !router.hasRoute(e.name)) {
                    const viewPath = `/src/views/${e.component}.vue`;
                    const componentFn = modules[viewPath];
                    if (componentFn) {
                        router.addRoute("dashboard", {
                            path: e.path,
                            name: e.name,
                            component: componentFn,
                            meta: {title: e.name, icon: e.icon}
                        });
                        hasNewRoutes = true;
                    } else {
                        console.error(`未找到组件文件: ${viewPath}，请检查数据库 component 配置！`);
                    }
                }
            }

            //如果有子路由 递归查找
            if (e.children && e.children.length > 0) {
                findAddRoutesByMenus(e.children);
            }
        })
    }

    //调用递归查找方法
    findAddRoutesByMenus(menus);

    return hasNewRoutes;
}