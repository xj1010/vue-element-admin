<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="服务名称">
        <el-input v-model="listQuery.title" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="listQuery.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="开启" value="1"></el-option>
          <el-option label="关闭" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="restForm()" >重置</el-button>
        <el-button type="button"  class="el-button el-button--danger" size="small"  icon="el-icon-edit" @click="updateServiceStatus(scope.row, 'allstart')">全部开启</el-button>
        <el-button type="button"  class="el-button el-button--danger" size="small"  icon="el-icon-edit" @click="updateServiceStatus(scope.row, 'allstop')">全部关闭</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="list"
      style="width: 100%"
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      ref="multipleTable"
    >

      <el-table-column  align="center" label="服务名称"  width="200px;">
        <template slot-scope="scope" >
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="状态" width="100px;">
        <template slot-scope="scope" >
          <el-tag effect="dark"  :type=" scope.row.status | typeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="描述" >
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button type="button"  class="el-button el-button--success" size="small" v-if="!scope.row.status" icon="el-icon-edit" @click="updateServiceStatus(scope.row, 'start')">开启</el-button>
          <el-button type="button"  class="el-button el-button--info is-plain" size="small"  v-if="scope.row.status" icon="el-icon-edit" @click="updateServiceStatus(scope.row, 'stop')">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
  </div>

</template>

<script>
  import {fetchList, update} from '@/api/admin/service'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'serviceList',
    components: {Pagination},
    filters: {
      statusFilter(status) {
        const statusMap = {
          true  : '运行中',
          false : '暂停',
        }
        return statusMap[status]
      },
      typeFilter(status) {
        const statusMap = {
          true : 'success',
          false : 'info',
        }
        return statusMap[status]
      }

    },
    data() {
      return {
        loading: true,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          title: "",
          status: "",
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
          console.log(this.list);
        })
      },
      restForm() {
        this.listQuery = {
          page: 1,
          limit: 20,
          title: "",
          status: "",
        }
        this.getList();
      },

      updateServiceStatus(row, type){
        update({"s":row.name, "type": type }).then(response => {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.listLoading = false;
          this.getList();
        })


      },
      onSubmit() {
        this.getList();
      },
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
