<!-- 视频分类模块 -->
<template>
  <div class="app-container calendar-list-container">
    <!-- banner配置规则 -->

    <div class="filter-container">
    <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增视频分类</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="分类id" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="分类名称">
        <template slot-scope="scope">
          <span>{{ scope.row.cate }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.video_no}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="是否可用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '可用' : '不可用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="视频列表" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" @click="gotoVideoList(scope.row)">视频列表</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
         <el-button size="mini" :type="scope.row.status ? 'danger' : ''" @click="handleModifyStatus(scope.row,!scope.row.status)">{{ scope.row.status == 1 ? '冻结' : '开启' }}
          </el-button>
          <!--<el-button type="danger" size="mini" @click="handleUpdate(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="140px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="分类名称" prop="cate">
          <el-input v-model="temp.cate"></el-input>
        </el-form-item>
        <el-form-item label="分类排序" prop="video_no">
          <el-input-number v-model="temp.video_no"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getVideoCate, addVideoCate, updateVideoCate, deleteVideoCate } from '@/api/video'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import uploadImg from '@/components/Upload/uploadImg'


export default {
  name: 'complexTable',
  directives: {
    waves
  },
  components:{
    uploadImg
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        cate: "",
        id: undefined,
        status: "",
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑视频分类',
        create: '新增视频分类'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return goTypeKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 上传图片的组件生成的图片
    uploadImg(url){
        console.log('url:' + url)

        this.temp.img_url = url
    },
  	// 获得全部的列表
    getList() {
      this.listLoading = true
      this.listLoading = false
      getVideoCate(this.listQuery).then(response => {
         this.list = response.data.list
         this.total = response.data.meta.total
         this.listLoading = false
       })
    },

    // 页码过滤
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    // 数量限制搜索
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },

    // 根据页面搜索
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },

    // 修改当前行的状态
    handleModifyStatus(row, status) {
      deleteVideoCate( row ).then( res => {
        this.getList();
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },

    resetTemp() {
      this.temp = {
        cate: "",
        id: undefined,
        status: 1,
      }
    },

    // 新增数据初始化
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addVideoCate(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    //  跳转视频列表
    gotoVideoList( row ){
      this.$router.push({
        path: `/video/videoList/${row.id}`
      })
    },

    // 设置当前编辑窗口
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

  	// 模拟更新数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateVideoCate(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    // 格式化Json
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
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
