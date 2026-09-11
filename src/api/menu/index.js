import request from "@/utils/request"
//获取所有菜单
export const getMenuList = () => {
    return request({
        url: "/sys-menu/all",
        method: "get"
    })
}
//新增菜单
export const addMenu = (data) => {
    return request({
        url: "/sys-menu/add",
        method: "post",
        data: data
    })
}
//编辑菜单
export const editMenu = (data) => {
    return request({
        url: "/sys-menu/edit",
        method: "put",
        data: data
    })
}
//删除菜单
export const deleteMenu = (id) => {
    return request({
        url: `/sys-menu/delete/${id}`,
        method: "delete"
    })
}
