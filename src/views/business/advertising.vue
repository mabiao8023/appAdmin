<!-- 跑马灯配置 -->
<template>
  <div class="app-container calendar-list-container">
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
    :default-sort = "{prop: 'banner_no', order: 'ascending'}"
      style="width: 100%">
      <el-table-column align="center"  prop="id" label="id" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="日期">
        <template slot-scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="auto" align="center" label="广告页面">
        <template slot-scope="scope">
          <span>{{ scope.row.page_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="是否可用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '可用' : '不可用'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
         <el-button size="mini" :type="scope.row.status ? 'danger' : ''" @click="handleModifyStatus(scope.row,!scope.row.status)">{{ scope.row.status == 1 ? '冻结' : '开启' }}
          </el-button>
     <!--      <el-button type="danger" size="mini" @click="handleUpdate(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'


export default {
  name: 'complexTable',
  directives: {
    waves
  },
  components:{
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
    }
  },
  created() {
    this.getList()
  },
  methods: {

    // 获得全部的列表
    getList() {
      this.listLoading = true
      this.listLoading = false
      this.list = [
        {
          id:1,
          page_name:'首页',
          status:1,
        },
        {
          id:1,
          page_name:'更多推荐',
          status:1,
        },
        {
          id:1,
          page_name:'赛事页面',
          status:1,
        },
        {
          id:1,
          page_name:'推荐详情',
          status:1,
        },
        {
          id:1,
          page_name:'视频列表',
          status:1,
        },
        {
          id:1,
          page_name:'课程列表',
          status:1,
        }
      ]
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },

    // 修改当前行的状态
    handleModifyStatus(row, status) {


      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },


    // 设置当前编辑窗口
    handleUpdate(row) {
      /* todo:跳转到对应的广告页面 */
      this.$router.push({
        path:`/business/adList/1`
      })

    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .banner-rules{
    padding: 20px 0;
  }
  .title{
    padding-bottom: 20px;
  }
  img{
    width: 100%;
  }
</style>
