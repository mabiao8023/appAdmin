<!-- 用户会员等级配置 -->

<template>
    <div class="app-container calendar-list-container">
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="#id" width="65">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="会员等级">
                <template slot-scope="scope">
                    <span>等级{{scope.row.level}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100px" align="center" label="会员时长">
                <template slot-scope="scope">
                    <span>{{scope.row.month}}个月</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100px" align="center" label="会员价格">
                <template slot-scope="scope">
                    <span>{{scope.row.price}}元</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- <div class="pagination-container">
           <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
           </el-pagination>
         </div> -->

        <el-dialog title="编辑用户会员特权" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="150px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="会员等级" prop="level">
            <span>
                会员等级{{temp.level}}
            </span>
                </el-form-item>
                <el-form-item label="会员时长" prop="month">
            <span>
                {{temp.month}}个月
            </span>
                </el-form-item>
                <el-form-item label="3月价格（元）" prop="price">
                    <el-input-number v-model="temp.price"></el-input-number>
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
                <el-table-column prop="key" label="Channel"></el-table-column>
                <el-table-column prop="pv" label="Pv"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
    import {fetchList, updateAnalystMember} from '@/api/analystsMember'
    import waves from '@/directive/waves' // 水波纹指令
    import {parseTime} from '@/utils'
    import uploadImg from '@/components/Upload/uploadImg'

    const calendarTypeOptions = [
        {key: 'CN', display_name: 'China'},
        {key: 'US', display_name: 'USA'},
        {key: 'JP', display_name: 'Japan'},
        {key: 'EU', display_name: 'Eurozone'}
    ]

    // arr to obj ,such as { CN : "China", US : "USA" }
    const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.display_name
        return acc
    }, {})

    export default {
        name: 'complexTable',
        directives: {
            waves
        },
        components: {
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
                calendarTypeOptions,
                sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
                statusOptions: ['published', 'draft', 'deleted'],
                showReviewer: false,
                temp: {
                    id: undefined,
                    level: '',
                    month: '',
                    price: '0.01'
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: 'Edit',
                    create: 'Create'
                },
                dialogPvVisible: false,
                pvData: [],
                rules: {
                    type: [{required: false, message: 'type is required', trigger: 'change'}],
                    timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
                    title: [{required: false, message: 'title is required', trigger: 'blur'}]
                },
                downloadLoading: false
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
                return calendarTypeKeyValue[type]
            }
        },
        created() {
            this.getList()
        },
        methods: {
            // 上传图片的组件生成的图片
            uploadImg(url){
                this.temp.icon = url
            },
            getList() {
                this.listLoading = true
                fetchList(this.listQuery).then(response => {
                    this.list = response.data.list
                    this.total = response.data.meta.total
                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            handleSizeChange(val) {
                this.listQuery.limit = val
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.getList()
            },
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
                    level: '',
                    month: '',
                    price: '0.01'
                }
            },
            handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
                        this.temp.author = 'vue-element-admin'
                        updateUserMember(this.temp).then(() => {
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
            handleUpdate(row) {
                this.temp = Object.assign({}, row) // copy obj
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        updateAnalystMember(tempData).then(() => {
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
            handleFetchPv(pv) {
                fetchPv(pv).then(response => {
                    this.pvData = response.data.pvData
                    this.dialogPvVisible = true
                })
            },
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
