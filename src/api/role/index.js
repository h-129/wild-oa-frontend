import request from "@/utils/request.js";
//获取角色列表
export const getRoleList = (data) => {
    return request({
        url: "/sys-role/list",
        method: "post",
        data
    })
}
//添加角色
export const addRole = (data) => {
    return request({
        url: "/sys-role/add",
        method: "post",
        data
    })
}
//编辑角色
export const editRole = (data) => {
    return request({
        url: "/sys-role/edit",
        method: "put",
        data
    })
}
//删除角色
export const deleteRole = (id) => {
    return request({
        url: `/sys-role/delete/${id}`,
        method: "delete",
    })
}
//查询角色分配菜单列表
export const getRoleMenuAssignInfo = (params) => {
    return request({
        url: "/sys-role/menu-assign",
        method: "get",
        params: params
    })
}
//给角色分配菜单
export const assignMenu = (data) => {
    return request({
        url: `/sys-role/assign-menu`,
        method: "post",
        data: data
    })
}