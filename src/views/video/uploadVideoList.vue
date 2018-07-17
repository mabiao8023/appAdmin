<!-- 视频列表模块 -->
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增视频</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" label="视频id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="视频描述">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="auto" class="img-show" align="center" label="首屏图片">
        <template slot-scope="scope">
          <img style="width:100px;" :src="scope.row.img_url">
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="视频链接">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="view_window">{{scope.row.url}}</a>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="播放数">
        <template slot-scope="scope">
          <span>{{ scope.row.viewer }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="上传时间" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column width="100px" align="center" label="排序" sortable >-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.order_no }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
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
          <!--<el-button type="danger" size="mini" @click="handleUpdate(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination align="right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="140px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="视频描述" prop="title">
          <el-input type="textarea"  placeholder="请输入相关描述" v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="展示图片" prop="img_url">
          <uploadImg :imgUrl="temp.img_url" @input="uploadImg"></uploadImg>
        </el-form-item>
        <el-form-item label="视频链接" prop="url">
          <uploadVideo :imgUrl="temp.url" @input="uploadVideo"></uploadVideo>
        </el-form-item>
        <el-form-item label="视频时长" prop="url">
          <el-input-number v-model="temp.times"></el-input-number>
        </el-form-item>
        <el-form-item label="播放量" prop="viewer">
          <el-input-number v-model="temp.viewer"></el-input-number>
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
import { fetchList, fetchVideo, createVideo, updateVideo, deleteVideo } from '@/api/video'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import uploadImg from '@/components/Upload/uploadImg'
import uploadVideo from '@/components/Upload/uploadVideo'
import ElInputNumber from "../../../node_modules/element-ui/packages/input-number/src/input-number";

export default {
  name: 'complexTable',
  directives: {
    waves
  },
  components:{
    ElInputNumber, uploadImg, uploadVideo
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
        cate_id: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        url: '',
        times: 88,
        title: '',
        viewer: '',
        status: 1,
        img_url:  ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑轮播图',
        create: '新增轮播图'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: false, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      /* 复选框选中的列表,内容为选中的id */
      checkList:[]
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
      this.temp.img_url = url
    },
    uploadVideo(url){
      this.temp.url = url
    },
  	// 获得全部的列表
    getList() {
      this.listLoading = true
      this.listLoading = false
      this.listQuery.cate_id = this.$route.params.id
      fetchList(this.listQuery).then(response => {
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


      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        url: '',
        times: '',
        title: '',
        viewer: '',
        status: 1,
        img_url:  ''
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
          createVideo(this.temp).then(() => {
            this.getList();
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
          updateVideo(this.temp).then(() => {
            this.getList();
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
  a{
  	color: green;
  	&:hover{
		text-decoration: underline;
  	}
  }
</style>
