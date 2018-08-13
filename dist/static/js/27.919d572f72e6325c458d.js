webpackJsonp([27],{LlF6:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Edqs"),i=a.n(n),l=a("vLgD"),s=a("mQOt"),r=a.n(s);var o=a("cAgV"),u=a("0xDb"),c={name:"complexTable",directives:{waves:o.a},data:function(){return{tableKey:0,list:null,total:null,listLoading:!0,listQuery:{page:1,limit:20},temp:{id:void 0,importance:1,remark:"",timestamp:new Date,title:"",type:"",status:"published"},dialogFormVisible:!1,dialogStatus:"",textMap:{update:"Edit",create:"Create"},downloadLoading:!1}},created:function(){this.getList()},methods:{getList:function(){var t,e=this;this.listLoading=!1,(t=this.listQuery,Object(l.a)({url:"/admin/application",method:"get",params:t})).then(function(t){e.list=t.data.list,e.total=t.data.meta.total,e.listLoading=!1})},handleFilter:function(){this.listQuery.page=1,this.getList()},handleSizeChange:function(t){this.listQuery.limit=t,this.getList()},handleCurrentChange:function(t){this.listQuery.page=t,this.getList()},handleModifyStatus:function(t,e){var a,n=this;(a=t,Object(l.a)({url:"/admin/application/refuse",method:"post",data:r.a.stringify(a)})).then(function(t){n.getList(),n.$message({message:"已拒绝",type:"success"})})},resetTemp:function(){this.temp={id:void 0,importance:1,remark:"",timestamp:new Date,title:"",status:"published",type:""}},handleCreate:function(){var t=this;this.resetTemp(),this.dialogStatus="create",this.dialogFormVisible=!0,this.$nextTick(function(){t.$refs.dataForm.clearValidate()})},createData:function(){var t=this;this.$refs.dataForm.validate(function(e){e&&createArticle(t.temp).then(function(){t.list.unshift(t.temp),t.dialogFormVisible=!1,t.$notify({title:"成功",message:"创建成功",type:"success",duration:2e3})})})},handleUpdate:function(t){var e=this;this.temp=i()({},t);var a,n=i()({},this.temp);(a=n,Object(l.a)({url:"/admin/application/pass",method:"post",data:r.a.stringify(a)})).then(function(){e.getList(),e.dialogFormVisible=!1,e.$notify({title:"成功",message:"同意申请",type:"success",duration:2e3})})},formatJson:function(t,e){return e.map(function(e){return t.map(function(t){return"timestamp"===t?Object(u.c)(e[t]):e[t]})})}}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container calendar-list-container"},[a("div",{staticClass:"filter-container"},[a("el-input",{staticClass:"filter-item",staticStyle:{width:"200px"},attrs:{placeholder:"用户昵称"},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.handleFilter(e)}},model:{value:t.listQuery.title,callback:function(e){t.$set(t.listQuery,"title",e)},expression:"listQuery.title"}}),t._v(" "),a("el-button",{directives:[{name:"waves",rawName:"v-waves"}],staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:t.handleFilter}},[t._v("搜索\n\n        ")])],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,staticStyle:{width:"100%"},attrs:{data:t.list,"element-loading-text":"给我一点时间",border:"",fit:"","highlight-current-row":""}},[a("el-table-column",{attrs:{align:"center",label:"用户id",width:"65"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.id))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"60px",align:"center",label:"头像"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("img",{staticStyle:{width:"40px",height:"40px","border-radius":"50%"},attrs:{src:t.row.avatar}})]}}])}),t._v(" "),a("el-table-column",{attrs:{"min-width":"80px",label:"昵称"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.nickname))])]}}])}),t._v(" "),a("el-table-column",{attrs:{"min-width":"60px",label:"性别"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.sex))])]}}])}),t._v(" "),a("el-table-column",{attrs:{"min-width":"60px",label:"球龄"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.ball_year))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"100px",align:"center",label:"头衔"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.tag))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"150px",align:"center",label:"简介"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.intro))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"110px",align:"center",label:"擅长参考"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.good_at))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"110px",align:"center",label:"擅长技能"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.skill))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"110px",align:"center",label:"擅长联赛"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.league))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"100px",align:"center",label:"是否可用"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-tag",{attrs:{type:1==e.row.status?"success":"danger"}},[t._v("\n                    "+t._s(1==e.row.status?"已同意":2==e.row.status?"未通过审核":"未审核")+"\n\n                ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"200px","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){return 0==e.row.status?[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(a){t.handleUpdate(e.row)}}},[t._v("同意")]),t._v(" "),"published"!=e.row.status?a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){t.handleModifyStatus(e.row,"published")}}},[t._v("拒绝\n\n\n                ")]):t._e()]:void 0}}])})],1),t._v(" "),a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{background:"","current-page":t.listQuery.page,"page-sizes":[10,20,30,50],"page-size":t.listQuery.limit,layout:"total, sizes, prev, pager, next, jumper",total:t.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1)},staticRenderFns:[]},p=a("XAIM")(c,d,!1,null,null,null);e.default=p.exports}});