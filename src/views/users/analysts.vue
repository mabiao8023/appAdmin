<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="el-icon-edit">新增分析师

            </el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row
                  style="width: 100%">
            <el-table-column align="center" label="分析师id" width="200">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="头像">
                <template slot-scope="scope">
                    <img :src="scope.row.avatar" style="width:60px;height:60px;border-radius:50%;">
                </template>
            </el-table-column>

            <el-table-column width="150px" align="center" label="昵称">
                <template slot-scope="scope">
                    <span>{{scope.row.nickname}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="标签">
                <template slot-scope="scope">
                    <span>{{scope.row.tag}}</span>
                </template>
            </el-table-column>
            <el-table-column width="auto" align="center" label="简介">
                <template slot-scope="scope">
                    <span>{{scope.row.intro}}</span>
                </template>
            </el-table-column>
            <el-table-column width="110px" align="center" label="分析师等级">
                <template slot-scope="scope">
                    <p>{{scope.row.level}}</p>
                </template>
            </el-table-column>
            <!--<el-table-column width="110px" align="center" label="球币">-->
            <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.money}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column width="110px" align="center" label="球票">
                <template slot-scope="scope">
                    <span>{{scope.row.ticket}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column width="150px" align="center" label="状态">-->
            <!--<template slot-scope="scope">-->
            <!--<el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '正常' : '已冻结'}}</el-tag>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="操作" width="auto" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <!--<el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">冻结-->
                    <!--</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination align="right" background @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" :current-page="listQuery.page"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="140px"
                     style='width: 400px; margin-left:50px;'>

                <el-form-item label="昵称" prop="nickname">
                    <el-input type="textarea" placeholder="请输入昵称" v-model="temp.nickname"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <uploadImg :imgUrl="temp.avatar" @input="uploadImg"></uploadImg>
                </el-form-item>
                <el-form-item label="标签" prop="tag">
                    <el-input placeholder="请输入分析师标签" v-model="temp.tag"></el-input>
                </el-form-item>
                <el-form-item label="简介" prop="intro">
                    <el-input placeholder="请输入分析师简介" v-model="temp.intro"></el-input>
                </el-form-item>
                <el-form-item label="球票数" prop="params">
                    <el-input-number v-model="temp.ticket"></el-input-number>
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
    import {fetchList, editAnalysts} from '@/api/analysts'
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
            uploadImg,
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
                    avatar: '',
                    nickname: '',
                    ticket: 0,
                    tag: '',
                    intro: '',
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
                    type: [{required: true, message: 'type is required', trigger: 'change'}],
                    timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
                    title: [{required: true, message: 'title is required', trigger: 'blur'}]
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
                this.temp.avatar = url
            },
            getList() {
                this.listLoading = false;
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
                    avatar: '',
                    nickname: '',
                    ticket: 0,
                    tag: '',
                    intro: '',
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
                        creatAnalysts(this.temp).then(() => {
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
                        editAnalysts(tempData).then(() => {
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
