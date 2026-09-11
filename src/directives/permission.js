import {userStore} from "@/store/user/index.js";

//检查是否有权限
function hasPermission(value, el = false) {
    if (!Array.isArray(value)) {
        throw new Error(`需要配置权限，例如 v-permission="['sys:user:edit']"`)
    }
    const uStore = userStore()
    const permissions = uStore.getPermissions
    const hasAuth = value.findIndex(v => permissions.includes(v)) !== -1
    if (el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}


export default {
    install(app) {
        app.directive('permission', {
            mounted(el, binding) {
                hasPermission(binding.value, el)
            }
        })
    }
}