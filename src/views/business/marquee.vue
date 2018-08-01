<template>
    <div class="app-container calendar-list-container">
        <!-- banner配置规则 -->

        <div class="filter-container">
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                       icon="el-icon-edit">新增头条内容

            </el-button>
        </div>

        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
                  highlight-current-row

                  :default-sort="{prop: 'banner_no', order: 'ascending'}"
                  style="width: 100%">
            <el-table-column align="center" prop="id" label="头条id" width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" sortable prop="sort" label="排序" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.sort}}</span>
                </template>
            </el-table-column>
            <el-table-column width="auto" class="img-show" align="center" label="头条内容">
                <template slot-scope="scope">
                    <span>{{ scope.row.content }}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="跳转页面名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column width="150px" align="center" label="跳转链接">
                <template slot-scope="scope">
                    <span>{{scope.row.url || '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="跳转参数">
                <template slot-scope="scope">
                    <span>{{scope.row.params || '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="是否可用">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'">{{scope.row.status == 1 ? '可用' : '不可用'}}</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="230px" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" :type="scope.row.status ? 'danger' : ''"
                               @click="handleModifyStatus(scope.row,!scope.row.status)">
                        {{ scope.row.status == 1 ? '冻结' : '开启' }}


                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="140px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item label="跳转页面" prop="page_id">
                    <el-select class="filter-item" v-model="temp.page_id" placeholder="请选择跳转页面">
                        <el-option v-for="item in  gotype" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" placeholder="请输入内容" v-model="temp.content"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" prop="page_type">
                    <el-input v-if="temp.page_id == 1" placeholder="请输入链接，如：www.baidu.com"
                              v-model="temp.url"></el-input>
                    <el-input v-else disabled value="普通网页无需输入跳转链接"></el-input>
                </el-form-item>
                <el-form-item label="跳转参数" prop="params">
                    <el-input v-if="temp.page_id != 1" placeholder="请输入参数，如：课程id，推荐单id，分析师id"
                              v-model="temp.params"></el-input>
                    <el-input v-else disabled value="普通网页无需输入跳转参数"></el-input>
                </el-form-item>
                <el-form-item label="轮播排序" prop="params">
                    <el-input-number v-model="temp.sort"></el-input-number>
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
    import {fetchList, fetch, create, update, deleteTop} from '@/api/topLine'
    import waves from '@/directive/waves' // 水波纹指令
    import {parseTime} from '@/utils'
    import uploadImg from '@/components/Upload/uploadImg'

    // 页面跳转类型

    const gotype = [
        {key: '1', display_name: '普通网页'},
        {key: '2', display_name: '推荐单页面'},
        {key: '3', display_name: '分析师页面'},
        {key: '4', display_name: '课程列表页面'},
        {key: '5', display_name: '课程购买页面'},
        {key: '6', display_name: '视频列表页面'},
        {key: '7', display_name: '会员升级页面'},
        {key: '8', display_name: '绑定手机页面'},
    ]

    const goTypeKeyValue = gotype.reduce((acc, cur) => {
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
                sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
                statusOptions: ['published', 'draft', 'deleted'],
                showReviewer: false,
                temp: {
                    id: undefined,
                    params: 1,
                    page_id: 1,
                    url: '',
                    sort: 1,
                    status: 1,
                    content: ''
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑头条',
                    create: '新增头条'
                },
                dialogPvVisible: false,
                pvData: [],
                rules: {
                    type: [{required: false, message: 'type is required', trigger: 'change'}],
                    timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
                    title: [{required: false, message: 'title is required', trigger: 'blur'}]
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
                this.temp.img_url = url
            },
            // 获得全部的列表
            getList() {
                this.listLoading = true
                this.listLoading = false
                fetchList().then(response => {
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
                deleteTop(row).then(res => {
                    this.getList();
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                })
            },

            resetTemp() {
                this.temp = {
                    id: undefined,
                    params: '',
                    page_id: 1,
                    url: '',
                    sort: 1,
                    status: 1,
                    img_url: ''
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
                        create(this.temp).then(() => {
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
                this.temp = Object.assign({page_id: 1}, row) // copy obj
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            // 更新数据
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        update(tempData).then(() => {
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
    .banner-rules {
        padding: 20px 0;
    }

    .title {
        padding-bottom: 20px;
    }

    img {
        width: 100%;
    }
</style>
