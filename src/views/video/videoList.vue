<!-- 视频列表模块 -->
<template>
  <div class="app-container calendar-list-container">

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
          <img :src="scope.row.img_url">
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="视频链接">
        <template slot-scope="scope">
          <a :href="scope.row.video" target="view_window">{{scope.row.video}}</a>
        </template>
      </el-table-column>
      <el-table-column width="150px" sortable align="center" label="视频分类">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.categroy">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="上传者">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="上传时间" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.uplateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="排序" sortable >
        <template slot-scope="scope">
          <span>{{ scope.row.order_no }}</span>
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
          <el-button type="danger" size="mini" @click="handleUpdate(scope.row)">删除</el-button>
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
        <el-form-item  label="视频分类" prop="page_type">
            <el-checkbox-group align="left" v-model="checkList">
              <el-checkbox
                v-for="(item,index) in gotype"
                :label="item.key"
                :checked="isChecked(item.key) ? true : false"
                >{{item.display_name}}
              </el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="展示图片" prop="img_url">
          <uploadImg :imgUrl="temp.img_url" @input="uploadImg"></uploadImg>
        </el-form-item>
        <el-form-item label="跳转链接" prop="page_type">
          <el-input v-if="temp.page_type == 1" placeholder="请输入链接，如：www.baidu.com" v-model="temp.url"></el-input>
          <el-input v-else disabled value="普通网页无需输入跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="跳转参数" prop="params">
          <el-input v-if="temp.page_type != 1" placeholder="请输入参数，如：课程id，推荐单id，分析师id"  v-model="temp.params"></el-input>
          <el-input v-else disabled value="普通网页无需输入跳转参数"></el-input>
        </el-form-item>
        <el-form-item label="轮播排序" prop="params">
          <el-input-number v-model="temp.banner_no"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import uploadImg from '@/components/Upload/uploadImg'

// 视频分类列表

const gotype = [
  { key: '1', display_name: '不可描述' },
  { key: '2', display_name: '全部干货' },
  { key: '3', display_name: '其他分类' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
/*const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})*/

const goTypeKeyValue = gotype.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

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
      gotype,
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
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        img_url:''
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

      bannerRulesList:[
        {
          title:'普通网页',
          url:'www.baidu.com',
          paramsId:'',
        },
        {
          title:'推荐页面',
          url:'',
          paramsId:'5',
        },
        {
          title:'其他',
          url:'',
          paramsId:'...',
        }
      ],
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
    /* 是否选中分类的列表 */
    isChecked( id ){
      let flag = false;
      if( this.temp.categroy && this.temp.categroy.length ){
           this.temp.categroy.forEach( val => {
            if( val.id == id ){
              flag = true;
            }
          } );
      }

      return flag;
    },
    // 上传图片的组件生成的图片
    uploadImg(url){
        console.log('url:' + url)

          this.temp.img_url = url
    },
  	// 获得全部的列表
    getList() {
      this.listLoading = true
      this.listLoading = false
      this.list = [
        {
          id:1,
          title:'非常好的一个视频，好好看看，什么都不会说的？？？？',
          user_name:'天下第一',
          img_url:'https://a.ym8800.com/upload/8d69197cca28b7bafed3548c44f6b72a.jpg',
          video:'http://v3.mukewang.com/jiuyeban/58c20168e520e59d7f8b459b/H.mp4',
          categroy:[{id:1,name:'不可描述'},{id:2,name:'干货专题'}],
          order_no:1,
          plays:8888,
          zan:8888,
          uplateTime:'2018-01-12 18:36',
          status:1,
        },
        {
          id:1,
          title:'非常好的一个视频，好好看看，什么都不会说的？？？？',
          user_name:'天下第一',
          img_url:'https://a.ym8800.com/upload/8d69197cca28b7bafed3548c44f6b72a.jpg',
          video:'http://v3.mukewang.com/jiuyeban/58c20168e520e59d7f8b459b/H.mp4',
          categroy:[{id:1,name:'不可描述'},{id:2,name:'干货专题'}],
          order_no:1,
          plays:8888,
          zan:8888,
          uplateTime:'2018-01-12 18:36',
          status:1,
        },
        {
          id:1,
          title:'非常好的一个视频，好好看看，什么都不会说的？？？？',
          user_name:'天下第一',
          img_url:'https://a.ym8800.com/upload/8d69197cca28b7bafed3548c44f6b72a.jpg',
          video:'http://v3.mukewang.com/jiuyeban/58c20168e520e59d7f8b459b/H.mp4',
          categroy:[{id:1,name:'不可描述'},{id:2,name:'干货专题'}],
          order_no:1,
          plays:8888,
          zan:8888,
          uplateTime:'2018-01-12 18:36',
          status:1,
        },
        {
          id:1,
          title:'非常好的一个视频，好好看看，什么都不会说的？？？？',
          user_name:'天下第一',
          img_url:'https://a.ym8800.com/upload/8d69197cca28b7bafed3548c44f6b72a.jpg',
          video:'http://v3.mukewang.com/jiuyeban/58c20168e520e59d7f8b459b/H.mp4',
          categroy:[{id:1,name:'不可描述'},{id:2,name:'干货专题'}],
          order_no:1,
          plays:8888,
          zan:8888,
          uplateTime:'2018-01-12 18:36',
          status:1,
        }
      ]
      this.total = 10
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
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
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        img_url:''
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
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
      this.temp.timestamp = new Date(this.temp.timestamp)
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
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
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

    // 删除列表
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },

    // 获得各渠道下的浏览数
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    // 下载exele
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel(tHeader, data, 'table-list')
        this.downloadLoading = false
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
  a{
  	color: green;
  	&:hover{
		text-decoration: underline;
  	}
  }
</style>
