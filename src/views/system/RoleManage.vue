<template>
  <div id="role_manage_div">
    <div class="tools_div">
      <el-row :gutter="4">
        <el-col :span="6">
          <el-input v-model="searchModel.roleName" clearable placeholder="请输入角色名"/>
        </el-col>
        <el-col :span="6">
          <el-button :icon="Search" type="primary" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" type="default" @click="handleReset">重置</el-button>
        </el-col>
      </el-row>
      <el-button :icon="Plus" class="mt-4" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="table_div">
      <el-table :data="pageState.records" border>
        <el-table-column align="center" label="序号" type="index" width="80"/>
        <el-table-column label="角色名" prop="roleName" width="120"/>
        <el-table-column label="角色code" prop="roleCode" width="120"/>
        <el-table-column label="描述" prop="description" show-overflow-tooltip width="120"/>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip width="120"/>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip width="120"/>
        <el-table-column align="center" fixed="right" label="操作" width="320">
          <template #default="scope">
            <el-button :icon="Edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button :icon="Pointer" type="success" @click="handleAssignMenu(scope.row)">分配菜单</el-button>
            <el-button :icon="Delete" type="danger" @click="handleDeleteConfirm(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="dialogState.visible" :title="dialogState.title" :width="dialogState.width">
        <el-form ref="formRef" :model="formModel" :rules="rules" label-position="right" label-width="120px">
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item label="角色名" prop="roleName">
                <el-input v-model="formModel.roleName" clearable placeholder="请输入角色名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色code" prop="roleCode">
                <el-input v-model="formModel.roleCode" clearable placeholder="请输入角色code"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="12">
              <el-form-item label="描述" prop="description">
                <el-input v-model="formModel.description" clearable placeholder="请输入描述" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="dialogState.visible=false">取消</el-button>
        </template>
      </el-dialog>
      <!--      分配菜单弹框-->
      <el-dialog v-model="menuDialogState.visible" :width="menuDialogState.width">
        <template #header>
          {{ menuDialogState.title }}
        </template>
        <el-tree
            ref="menuTreeRef"
            :data="menuTreeOptions"
            :default-checked-keys="checkedMenu"
            :props="{
                children: 'children',
                label: 'menuName'
            }"
            default-expand-all
            node-key="id"
            show-checkbox
        />
        <template #footer>
          <el-button type="primary" @click="handleAssignMenuSubmit">确定</el-button>
          <el-button @click="menuDialogState.visible=false">取消</el-button>
        </template>
      </el-dialog>
      <div class="pagination_div">
        <el-pagination
            v-model:current-page="pageState.pageNum"
            v-model:page-size="pageState.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="pageState.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadTableData"
            @current-change="loadTableData"/>
      </div>
    </div>
  </div>
</template>
<script setup>
import {nextTick, onMounted, reactive, ref} from "vue";
import {Delete, Edit, Plus, Pointer, Refresh, Search} from "@element-plus/icons-vue";
import {addRole, assignMenu, deleteRole, editRole, getRoleList, getRoleMenuAssignInfo} from "@/api/role/index.js";
import {ElMessage, ElMessageBox} from "element-plus";
//搜索框model
const searchModel = reactive({
  roleName: ""
})
//分配菜单的菜单树
const menuTreeOptions = ref([])
//当前角色已分配的菜单id
const checkedMenu = ref([])
//当前菜单树的
const menuTreeRef = ref(null)
//分页状态
const pageState = reactive({
  records: [],
  pageNum: 1,
  pageSize: 10,
  total: 0,
})
//弹框状态
const dialogState = reactive({
  visible: false,
  title: "",
  width: "650px",
  type: ""
})
//分配菜单弹窗状态
const menuDialogState = reactive({
  visible: false,
  title: "",
  width: "650px",
  type: "",
  roleId: ""
})
///表单对象
const formModel = reactive({
  id: "",
  roleName: "",
  roleCode: "",
  description: "",
});
//表单校验规则
const rules = reactive({
  roleName: [
    {required: true, message: '请输入角色名', trigger: 'blur'},
    {min: 2, max: 10, message: '角色名长度必须在2-10位之间', trigger: 'blur'},
  ],
  roleCode: [
    {required: true, message: '请输入角色code', trigger: 'blur'},
    {min: 3, max: 10, message: '角色code长度必须在3-10位之间', trigger: 'blur'},
  ],
  description: [
    {required: true, message: '请输入描述', trigger: 'blur'},
    {min: 2, max: 10, message: '描述长度必须在2-10位之间', trigger: 'blur'},
  ],
})
const formRef = ref(null)
//查询
const handleSearch = () => {
  pageState.pageNum = 1
  loadTableData()
}
//重置
const handleReset = () => {
  searchModel.roleName = ""
  handleSearch()
}
//添加
const handleAdd = async () => {
  dialogState.visible = true
  dialogState.title = "新增角色"
  dialogState.type = "add"
  //等待弹窗显示完成
  await nextTick()
  //清除表单项
  formRef.value.resetFields()
}
//编辑
const handleEdit = async (row) => {
  dialogState.visible = true
  dialogState.title = "编辑角色"
  dialogState.type = "edit"
  await nextTick()
  //擦除校验错误
  formRef.value?.clearValidate()
  Object.assign(formModel, row)
}
//分配菜单
const handleAssignMenu = async (row) => {
  menuDialogState.roleId = row.id
  //获取所有菜单
  try {
    const queryParams = {
      roleId: row.id
    }
    const {data: {allMenuList, checkedMenuIds}} = await getRoleMenuAssignInfo(queryParams)
    menuTreeOptions.value = allMenuList
    checkedMenu.value = checkedMenuIds
  } catch (e) {
    ElMessage.error(e.message)
    return
  }
  menuDialogState.visible = true
  menuDialogState.title = "分配菜单"
}
//删除
const handleDeleteConfirm = async (row) => {
  try {
    await ElMessageBox.confirm("是否确认删除?", "提示", {type: 'warning'})
    try {
      await deleteRole(row.id)
    } catch (e) {
      ElMessage.error(e.message)
      return
    }
    dialogState.visible = false
    ElMessage.success('删除成功')
  } catch (error) {
    // 用户点击了“取消”会走这里
    ElMessage.info('已取消')
  } finally {
    await loadTableData()
  }
}
//提交
const handleSubmit = async () => {
  try {
    let valid = await formRef.value?.validate()
    if (!valid) return
    //编辑
    if (dialogState.type === "edit") {
      await editRole(formModel);
    } else {
      //新增
      await addRole(formModel)
    }
    //关闭弹窗
    dialogState.visible = false
    ElMessage.success("操作成功")
  } catch (e) {
    ElMessage.error("请检查输入是否有误")
  } finally {
    await loadTableData()
  }
}
//处理分配角色菜单提交
const handleAssignMenuSubmit = async () => {
  //获取全选中的
  const checkedKeys = menuTreeRef.value.getCheckedKeys();
  //获取半选中的
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys();
  //已选中的菜单id
  const menuIds = [...checkedKeys, ...halfCheckedKeys];
  const assignMenuDto = {
    roleId: menuDialogState.roleId,
    menuIds: menuIds,
  }
  try {
    await assignMenu(assignMenuDto)
    ElMessage.success("操作成功")
  } catch (e) {
    ElMessage.error(e.message)
  }
  menuDialogState.visible = false
}

//加载数据
const loadTableData = async () => {
  const queryParams = {
    pageNum: pageState.pageNum,
    pageSize: pageState.pageSize,
    ...searchModel
  }
  try {
    const {data: {records, total}} = await getRoleList(queryParams)
    pageState.records = records
    pageState.total = total
  } catch (e) {
    ElMessage.error(e.message)
  }
}
onMounted(() => {
  loadTableData()
})
</script>
<style lang="scss" scoped>
#role_manage_div {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table_div {
  margin-top: 15px;
  flex: 1;
  overflow: hidden;
}

.pagination_div {
  padding-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>