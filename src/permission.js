import {addRoutes, router} from "@/router/index.js";
import {hideFullLoading, showFullLoading} from "@/utils/loading.js";
import {userStore} from "@/store/user/index.js";

let userInfoLoaded = false;//防重复获取用户信息
//路由前置守卫
router.beforeEach(async (to, from, next) => {
    //加载全局loading
    showFullLoading();
    const uStore = userStore()
    const token = uStore.getToken
    //如果没有登录，强制跳转到登录页
    if (!token && to.path !== "/login") {
        return next({path: "/login"})
    }
    //防止重复登录
    if (token && to.path === "/login") {
        return next({path: from.path ? from.path : "/login"})
    }
    //获取用户信息并且动态添加路由
    let hasNewRoutes = false; //防止重复添加路由
    if (token && !userInfoLoaded) {
        const {menus} = await uStore.fetchUserInfo()
        hasNewRoutes = addRoutes(menus)
        userInfoLoaded = true;//加载后设为已加载状态
    }
    //设置页面标题
    document.title = (to?.meta.title || "") + "-wild后台管理系统";
    //使用动态路由需要指定
    hasNewRoutes ? next(to.fullPath) : next();
})

//路由后置守卫
router.afterEach((to, from) => {
    //关闭全局loading
    hideFullLoading()
})
