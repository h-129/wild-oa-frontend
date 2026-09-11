import request from "@/utils/request.js";
//用户列表接口
export const getUserList = (data) => {
    return request({
        url: "/sys-user/list",
        method: "post",
        data: data
    })
}
//查询用户分配角色接口
export const getUserRoleAssignInfo = (params) => {
    return request({
        url: "/sys-user/role-assign",
        method: "get",
        params: params
    })
}
//给用户分配角色接口
export const assignRole = (data) => {
    return request({
        url: "/sys-user/assign-role",
        method: "post",
        data: data
    })
}
//编辑用户资料接口
export const editUser = (data) => {
    return request({
        url: "/sys-user/edit",
        method: "put",
        data: data
    })
}
//删除用户
export const deleteUser = (id) => {
    return request({
        url: `/sys-user/delete/${id}`,
        method: "delete"
    })
}