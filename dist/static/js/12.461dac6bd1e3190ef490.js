webpackJsonp([12],{E6MX:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("Edqs"),n=i.n(a),s=i("vLgD"),l=i("mQOt"),r=i.n(l);var o=i("cAgV"),d=i("0xDb"),c=i("erVD"),u=[{key:"1",display_name:"普通网页"},{key:"2",display_name:"推荐单页面"},{key:"3",display_name:"分析师页面"},{key:"4",display_name:"课程列表页面"},{key:"5",display_name:"课程购买页面"},{key:"6",display_name:"视频列表页面"},{key:"7",display_name:"会员升级页面"},{key:"8",display_name:"绑定手机页面"}],p=u.reduce(function(t,e){return t[e.key]=e.display_name,t},{}),m={name:"complexTable",directives:{waves:o.a},components:{uploadImg:c.a},data:function(){return{gotype:u,tableKey:0,list:null,total:null,listLoading:!0,listQuery:{page:1,limit:20,importance:void 0,title:void 0,type:void 0,sort:"+id"},importanceOptions:[1,2,3],sortOptions:[{label:"ID Ascending",key:"+id"},{label:"ID Descending",key:"-id"}],statusOptions:["published","draft","deleted"],showReviewer:!1,temp:{id:void 0,status:1,content:""},dialogFormVisible:!1,dialogStatus:"",textMap:{update:"编辑",create:"新增"},dialogPvVisible:!1,pvData:[],rules:{type:[{required:!1,message:"type is required",trigger:"change"}],timestamp:[{type:"date",required:!0,message:"timestamp is required",trigger:"change"}],title:[{required:!1,message:"title is required",trigger:"blur"}]},downloadLoading:!1}},filters:{statusFilter:function(t){return{published:"success",draft:"info",deleted:"danger"}[t]},typeFilter:function(t){return p[t]}},created:function(){this.getList()},methods:{uploadImg:function(t){this.temp.img_url=t},getList:function(){var t,e=this;this.listLoading=!0,this.listLoading=!1,Object(s.a)({url:"/admin/notice",method:"get",params:t}).then(function(t){e.list=t.data.list,e.total=t.data.meta.total,e.listLoading=!1})},handleFilter:function(){this.listQuery.page=1,this.getList()},handleSizeChange:function(t){this.listQuery.limit=t,this.getList()},handleCurrentChange:function(t){this.listQuery.page=t,this.getList()},handleModifyStatus:function(t,e){var i,a=this;(i=t,Object(s.a)({url:"/admin/notice/delete",method:"post",data:r.a.stringify(i)})).then(function(t){a.getList(),a.$message({message:"操作成功",type:"success"})})},resetTemp:function(){this.temp={id:void 0,status:1,content:""}},handleCreate:function(){var t=this;this.resetTemp(),this.dialogStatus="create",this.dialogFormVisible=!0,this.$nextTick(function(){t.$refs.dataForm.clearValidate()})},createData:function(){var t=this;this.$refs.dataForm.validate(function(e){var i;e&&(i=t.temp,Object(s.a)({url:"/admin/notice",method:"post",data:r.a.stringify(i)})).then(function(){t.getList(),t.dialogFormVisible=!1,t.$notify({title:"成功",message:"创建成功",type:"success",duration:2e3})})})},handleUpdate:function(t){var e=this;this.temp=n()({page_id:1},t),this.dialogStatus="update",this.dialogFormVisible=!0,this.$nextTick(function(){e.$refs.dataForm.clearValidate()})},updateData:function(){var t=this;this.$refs.dataForm.validate(function(e){if(e){var i=n()({},t.temp);(a=i,Object(s.a)({url:"/admin/notice/update",method:"post",data:r.a.stringify(a)})).then(function(){t.getList(),t.dialogFormVisible=!1,t.$notify({title:"成功",message:"更新成功",type:"success",duration:2e3})})}var a})},formatJson:function(t,e){return e.map(function(e){return t.map(function(t){return"timestamp"===t?Object(d.c)(e[t]):e[t]})})}}},g={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"app-container calendar-list-container"},[i("div",{staticClass:"filter-container"},[i("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:t.handleCreate}},[t._v("新增系统消息\n\n        ")])],1),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,staticStyle:{width:"100%"},attrs:{data:t.list,"element-loading-text":"给我一点时间",border:"",fit:"","highlight-current-row":"","default-sort":{prop:"banner_no",order:"ascending"}}},[i("el-table-column",{attrs:{align:"center",prop:"id",label:"头条id",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.id))])]}}])}),t._v(" "),i("el-table-column",{staticClass:"img-show",attrs:{width:"auto",align:"center",label:"头条内容"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",[t._v(t._s(e.row.content))])]}}])}),t._v(" "),i("el-table-column",{attrs:{width:"150px",align:"center",label:"是否可用"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-tag",{attrs:{type:1==e.row.status?"success":"danger"}},[t._v(t._s(1==e.row.status?"可用":"不可用"))])]}}])}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"230px","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(i){t.handleUpdate(e.row)}}},[t._v("编辑")]),t._v(" "),i("el-button",{attrs:{size:"mini",type:e.row.status?"danger":""},on:{click:function(i){t.handleModifyStatus(e.row,!e.row.status)}}},[t._v("\n                    "+t._s(1==e.row.status?"冻结":"开启")+"\n\n\n                ")])]}}])})],1),t._v(" "),i("el-dialog",{attrs:{title:t.textMap[t.dialogStatus],visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[i("el-form",{ref:"dataForm",staticStyle:{width:"400px","margin-left":"50px"},attrs:{rules:t.rules,model:t.temp,"label-position":"left","label-width":"140px"}},[i("el-form-item",{attrs:{label:"内容",prop:"content"}},[i("el-input",{attrs:{type:"textarea",placeholder:"请输入内容"},model:{value:t.temp.content,callback:function(e){t.$set(t.temp,"content",e)},expression:"temp.content"}})],1)],1),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),t._v(" "),"create"==t.dialogStatus?i("el-button",{attrs:{type:"primary"},on:{click:t.createData}},[t._v("确 定")]):i("el-button",{attrs:{type:"primary"},on:{click:t.updateData}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var f=i("XAIM")(m,g,!1,function(t){i("dlJt")},"data-v-c9ae6dd6",null);e.default=f.exports},ErZr:function(t,e,i){(t.exports=i("bKW+")(!1)).push([t.i,"\n.banner-rules[data-v-c9ae6dd6] {\n  padding: 20px 0;\n}\n.title[data-v-c9ae6dd6] {\n  padding-bottom: 20px;\n}\nimg[data-v-c9ae6dd6] {\n  width: 100%;\n}\n",""])},dlJt:function(t,e,i){var a=i("ErZr");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);i("6imX")("74d0839d",a,!0)}});