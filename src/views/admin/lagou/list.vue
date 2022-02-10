<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="搜索类型">
        <el-select v-model="listQuery.searchType" placeholder="请选择" style="width:100px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="公司名称" value="company_name"></el-option>
          <el-option label="职位名称" value="position_name"></el-option>
          <el-option label="城市" value="city"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-input v-model="listQuery.keyword" placeholder="关键字"></el-input>
      </el-form-item>

      <el-form-item label="发布时间" >
        <el-date-picker
          v-model="listQuery.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"  style="width:150px;" >
        </el-date-picker>
        -
        <el-date-picker
          v-model="listQuery.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期" style="width:150px;">
        </el-date-picker>

      </el-form-item>

      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button   @click="restForm()" >重置</el-button>
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
      <el-table-column align="center" label="ID" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="公司规模">
        <template slot-scope="scope">
          <span>{{ scope.row.company_size }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公司名称">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="职位">
        <template slot-scope="scope">
          <span>{{ scope.row.position_name }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="一级类目">
        <template slot-scope="scope">
          <span>{{ scope.row.first_type }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="二级类目">
        <template slot-scope="scope">
          <span>{{ scope.row.second_type }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="三级类目">
        <template slot-scope="scope">
          <span>{{ scope.row.third_type }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="最低工资">
        <template slot-scope="scope">
          <span>{{ scope.row.salary_min }}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="最高工资">
        <template slot-scope="scope">
          <span>{{ scope.row.salary_max }}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="工资月份">
        <template slot-scope="scope">
          <span>{{ scope.row.salary_month }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="工作年限" >
        <template slot-scope="scope">
          {{ scope.row.work_year }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="学历" >
        <template slot-scope="scope">
          {{ scope.row.education }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="创建时间" >
        <template slot-scope="scope">
          {{ scope.row.create_time }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="lookAt(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>
  </div>

</template>

<script>
  import {fetchList} from '@/api/admin/lagou'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'LagouList',
    components: {Pagination},
    data() {
      return {
        loading: true,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          searchType: "",
          keyword: "",
          startDate : "",
          endDate: "",
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
          searchType: "",
          keyword: "",
          startDate : "",
          endDate: "",
        }
        this.getList();
      },

      lookAt(row){
        window.open(row.link, "_blank");
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
