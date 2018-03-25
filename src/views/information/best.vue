<!-- 精推情报列表 -->

<template>
  <div class="app-container calendar-list-container">
    <!-- banner配置规则 -->
   
    <div class="filter-container">
    <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增精推情报</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row

    :default-sort = "{prop: 'banner_no', order: 'ascending'}"
      style="width: 100%">
      <el-table-column align="center" label="球队id" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.match_id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="主队" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.home_flag" width="40px" alt="">
          <div>{{scope.row.home}}</div>
        </template>
      </el-table-column>
       <el-table-column align="center" label="客队" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.away_flag" width="40px" alt="">
          <div>{{scope.row.away}}</div>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="比赛时间">
        <template slot-scope="scope">
          <span>{{scope.row.match_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联赛" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.league_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐方案数" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.orders}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="情报排序" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.order_no}}</span>
        </template>
      </el-table-column>
       <el-table-column align="center" label="情报" width="auto">
        <template slot-scope="scope">
            <el-row>
              <el-button type="danger" size="mini" @click.stop.prevent="handleShowInformation(scope.row.home_id)">主队情报</el-button>
            </el-row> 
            <el-row>
              <el-button type="warning" style="margin-top:5px;" size="mini" @click.stop.prevent="handleShowInformation(scope.row.away_id)">客队情报</el-button>
            </el-row>
        </template>
      </el-table-column>
     
      <el-table-column align="center" :label="$t('table.actions')" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleUpdate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="140px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="比赛信息" prop="page_type">
          <span>{{ temp.home }} vs {{ temp.away }} </span>
        </el-form-item>
         <el-form-item label="比赛时间" prop="page_type">
          <span> {{temp.match_time | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
        </el-form-item>
        <el-form-item label="排序" prop="params">
          <el-input-number v-model="temp.order_no"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="球队情报信息" :visible.sync="dialogPvVisible">
      这是一些情报信息
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import uploadImg from '@/components/Upload/uploadImg'

// 页面跳转类型

const gotype = [
  { key: '1', display_name: '普通网页' },
  { key: '2', display_name: '推荐单页面' },
  { key: '3', display_name: '分析师页面' },
  { key: '4', display_name: '课程列表页面' },
  { key: '5', display_name: '课程购买页面' },
  { key: '6', display_name: '视频列表页面' },
  { key: '7', display_name: '会员升级页面' },
  { key: '8', display_name: '绑定手机页面' },
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
        update: '编辑情报顺序',
        create: '新增情报'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
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
      ]
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
      this.list = [
        {
          match_id:1,
          home_id:3,
          home:'中国',
          home_flag:'https://relottery.nosdn.127.net/match/soccer/2_14324.jpg?imageView&thumbnail=20y20&quality=85',
          away:'韩国',
          away_id:3,
          away_flag:'https://relottery.nosdn.127.net/match/soccer/2_19527.jpg?imageView&thumbnail=20y20&quality=85',
          match_time:1521904512,
          orders:1111,
          league_name:'世界杯',
          order_no:1
        },
        {
          match_id:1,
          home_id:3,
          home:'中国',
          home_flag:'https://relottery.nosdn.127.net/match/soccer/2_14324.jpg?imageView&thumbnail=20y20&quality=85',
          away:'韩国',
          away_id:3,
          away_flag:'https://relottery.nosdn.127.net/match/soccer/2_19527.jpg?imageView&thumbnail=20y20&quality=85',
          match_time:1521904512,
          orders:1111,
          league_name:'世界杯',
          order_no:1
        },
        {
         match_id:1,
          home_id:3,
          home:'中国',
          home_flag:'https://relottery.nosdn.127.net/match/soccer/2_14324.jpg?imageView&thumbnail=20y20&quality=85',
          away:'韩国',
          away_id:3,
          away_flag:'https://relottery.nosdn.127.net/match/soccer/2_19527.jpg?imageView&thumbnail=20y20&quality=85',
          match_time:1521904512,
          orders:1111,
          league_name:'世界杯',
          order_no:1
        },
      ]
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },

    /* 显示当前球队不同的情报 */
    handleShowInformation(id) {
      this.dialogPvVisible = true
      /* 显示球队情报信息 */
      /*fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })*/
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
      this.$router.push({
        path:'/information/list'
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
/*   img{
  width: 100%;
} */
</style>
