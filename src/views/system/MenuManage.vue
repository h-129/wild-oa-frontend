<template>
  <div id="menu_manage_div">
    <div class="tools_div" style="margin-bottom: 20px;">
      <el-button icon="Plus" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="table_div">
      <el-table
          :data="tableData"
          border
          default-expand-all
          row-key="id"
          style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column label="菜单名称" prop="name" width="160"/>

        <el-table-column align="center" label="类型" prop="type" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 0 ? 'warning' : 'success'">
              {{ row.type === 0 ? '目录' : row.type === 1 ? '菜单' : '按钮' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" label="图标" prop="icon" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <!-- 判断：如果图标名字带冒号(如 lucid:settings)说明是 Iconify，否则当成 ElementPlus 组件 -->
              <Icon v-if="row.icon && row.icon.includes(':')" :icon="row.icon"/>
              <component :is="row.icon" v-else/>
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column label="路由路径" min-width="150" prop="path" show-overflow-tooltip/>
        <el-table-column label="组件路径" min-width="150" prop="component" show-overflow-tooltip/>
        <el-table-column label="权限标识" min-width="130" prop="perms" show-overflow-tooltip/>
        <el-table-column align="center" label="排序" prop="sortValue" width="80"/>

        <el-table-column align="center" label="状态" prop="status" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip width="180"/>
        <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip width="180"/>
        <el-table-column align="center" fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button :icon="Edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button :icon="Delete" type="danger" @click="handleDeleteConfirm(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹框 -->
      <el-dialog
          v-model="dialogState.visible"
          :width="dialogState.width"
          destroy-on-close
      >
        <template v-slot:header>
          {{ dialogState.title }}
        </template>
        <el-form ref="formRef" :model="formModel" :rules="rules" label-position="right" label-width="100px">

          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="formModel.type" @change="handleTypeChange">
              <el-radio :value="0" size="large">目录</el-radio>
              <el-radio :value="1" size="large">菜单</el-radio>
              <el-radio :value="2" size="large">按钮</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-row :gutter="20">
            <!-- 上级菜单 -->
            <el-col :span="12">
              <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select
                    v-model="formModel.parentId"
                    :data="menuTreeOptions"
                    :props="{ value: 'id', label: 'name', children: 'children' }"
                    check-strictly
                    placeholder="请选择上级菜单"
                />
              </el-form-item>
            </el-col>
            <!-- 菜单名称 -->
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="formModel.name" placeholder="请输入菜单名称"/>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 路由路径 (目录或菜单时显示) -->
          <el-row v-if="formModel.type !== 2" :gutter="20">
            <el-col :span="12">
              <el-form-item label="路由路径" prop="path">
                <el-input v-model="formModel.path" placeholder="请输入路由路径（如 /system）"/>
              </el-form-item>
            </el-col>
            <!-- 组件路径 (仅菜单时显示) -->
            <el-col v-if="formModel.type === 1" :span="12">
              <el-form-item label="组件路径" prop="component">
                <el-input v-model="formModel.component" placeholder="请输入组件路径（如 system/User）"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 权限标识 (菜单或按钮时显示) -->
            <el-col v-if="formModel.type === 1 || formModel.type === 2" :span="12">
              <el-form-item label="权限标识" prop="perms">
                <el-input v-model="formModel.perms" placeholder="请输入权限标识（如 sys:user:list）"/>
              </el-form-item>
            </el-col>
            <!-- 菜单图标 (目录或菜单时显示) -->
            <el-col v-if="formModel.type !== 2" :span="12">
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="formModel.icon" placeholder="请输入 Element 图标名称"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="排序" prop="sortValue">
                <el-input-number v-model="formModel.sortValue" :min="0" placeholder="请输入排序"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="formModel.status">
                  <el-radio :value="1" size="large">启用</el-radio>
                  <el-radio :value="0" size="large">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template v-slot:footer>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button type="default" @click="dialogState.visible = false">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from "element-plus"
import {Delete, Edit} from "@element-plus/icons-vue";
import {addMenu, deleteMenu, editMenu, getMenuList} from "@/api/menu/index.js";

// 每次调用都返回一份全新的干净对象
const getInitialForm = () => ({
  id: "",
  parentId: 0,
  name: "",
  type: 0,
  path: "",
  component: "",
  perms: "",
  icon: "",
  sortValue: 1,
  status: 1,
})
// 弹框状态
const dialogState = reactive({
  visible: false,
  title: "",
  width: "680px",
  type: "",
})

// 表单对象
const formModel = reactive(getInitialForm())

const formRef = ref(null)

// 表单规则
const rules = reactive({
  parentId: [{required: true, message: "请选择上级菜单", trigger: "change"}],
  name: [{required: true, message: "请输入菜单名称", trigger: "blur"}],
  type: [{required: true, message: "请选择菜单类型", trigger: "change"}],
  path: [{required: true, message: "请输入路由路径", trigger: "blur"}],
  component: [{required: true, message: "请输入组件路径", trigger: "blur"}],
  perms: [{required: true, message: "请输入权限标识", trigger: "blur"}],
  sortValue: [{required: true, message: "请输入排序", trigger: "blur"}],
  status: [{required: true, message: "请选择状态", trigger: "change"}],
})

// 构造带有顶级根节点的树形选择下拉数据
const menuTreeOptions = computed(() => {
  return [
    {
      id: 0,
      name: '顶级菜单',
      children: tableData.value
    }
  ]
})

// 切换菜单类型时清空无关字段
const handleTypeChange = () => {
  if (formModel.type === 0) {
    // 目录：清空组件和权限
    formModel.component = ""
    formModel.perms = ""
  } else if (formModel.type === 2) {
    // 按钮：清空路径、组件和图标
    formModel.path = ""
    formModel.component = ""
    formModel.icon = ""
  }
}

// 新增菜单
const handleAdd = async () => {
  dialogState.visible = true
  dialogState.title = "新增菜单"
  dialogState.type = "add"
  Object.assign(formModel, getInitialForm())
  await nextTick()
  formRef.value?.clearValidate()
}
//表格数据
const tableData = ref([])

//处理编辑
const handleEdit = async (row) => {
  dialogState.title = "编辑菜单"
  dialogState.visible = true
  dialogState.type = "edit"
  await nextTick()
  Object.assign(formModel, getInitialForm(), row)
  formRef.value?.clearValidate()
}
// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    switch (dialogState.type) {
      case "add":
        await addMenu(formModel)
        break
      case "edit":
        await editMenu(formModel)
        break
    }
    ElMessage.success("操作成功")
    dialogState.visible = false
  } catch (e) {
    ElMessage.error("请检查输入是否有误")
  } finally {
    await loadTableData()
  }
}
//删除
const handleDeleteConfirm = async (row) => {
  try {
    await ElMessageBox.confirm("是否确认删除?", "提示", {type: 'warning'})
    try {
      await deleteMenu(row.id)
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
//加载表格数据
const loadTableData = async () => {
  try {
    const {data} = await getMenuList()
    tableData.value = data
  } catch (e) {
    ElMessage.error(e.message)
  }
}
onMounted(() => {
  loadTableData()
})
</script>

<style lang="scss" scoped>
#menu_manage_div {
  padding: 20px;
}
</style>