import request from "@/utils/request.js";

/**
 * 用户登录接口
 * @param data 登录参数
 * @returns {*} 登录结果
 */
export const userLogin = (data) => {
    return request({
        url: "/auth/login",
        method: "post",
        data: data
    })
}
/**
 * 获取用户信息接口
 * @returns {*} 用户信息
 */
export const getUserInfo = () => {
    return request({
        url: "/sys-user/info",
        method: "get"
    })
}
/**
 * 退出登录
 * @returns {*} 成功标志
 */
export const logout = () => {
    return request({
        url: "/auth/logout",
        method: "post"
    })
}