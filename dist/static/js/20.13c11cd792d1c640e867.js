webpackJsonp([20],{"85h+":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("Edqs"),n=a.n(i),l=a("vLgD"),s=a("mQOt"),r=a.n(s);var o=a("cAgV"),d=a("0xDb"),u=a("erVD"),p=[{key:"1",display_name:"普通网页"},{key:"2",display_name:"推荐单页面"},{key:"3",display_name:"分析师页面"},{key:"4",display_name:"课程列表页面"},{key:"5",display_name:"课程购买页面"},{key:"6",display_name:"视频列表页面"},{key:"7",display_name:"会员升级页面"},{key:"8",display_name:"绑定手机页面"}],c=p.reduce(function(t,e){return t[e.key]=e.display_name,t},{}),m={name:"complexTable",directives:{waves:o.a},components:{uploadImg:u.a},data:function(){return{gotype:p,tableKey:0,list:null,total:null,listLoading:!0,listQuery:{page:1,limit:20,importance:void 0,title:void 0,type:void 0,sort:"+id"},importanceOptions:[1,2,3],sortOptions:[{label:"ID Ascending",key:"+id"},{label:"ID Descending",key:"-id"}],statusOptions:["published","draft","deleted"],showReviewer:!1,temp:{id:void 0,params:"",page_id:1,url:"",sort:1,status:1,img_url:""},dialogFormVisible:!1,dialogStatus:"",textMap:{update:"编辑轮播图",create:"新增轮播图"},dialogPvVisible:!1,pvData:[],rules:{type:[{required:!1,message:"type is required",trigger:"change"}],timestamp:[{type:"date",required:!0,message:"timestamp is required",trigger:"change"}],title:[{required:!1,message:"title is required",trigger:"blur"}]},downloadLoading:!1}},filters:{statusFilter:function(t){return{published:"success",draft:"info",deleted:"danger"}[t]},typeFilter:function(t){return c[t]}},created:function(){this.getList()},methods:{uploadImg:function(t){this.temp.img_url=t},getList:function(){var t,e=this;this.listLoading=!0,this.listLoading=!1,Object(l.a)({url:"/admin/banner",method:"get",params:t}).then(function(t){e.list=t.data.list,e.total=t.data.meta.total,e.listLoading=!1})},handleFilter:function(){this.listQuery.page=1,this.getList()},handleSizeChange:function(t){this.listQuery.limit=t,this.getList()},handleCurrentChange:function(t){this.listQuery.page=t,this.getList()},handleModifyStatus:function(t,e){var a,i=this;(a=t,Object(l.a)({url:"/admin/banner/delete",method:"post",data:r.a.stringify(a)})).then(function(t){i.getList(),i.$message({message:"操作成功",type:"success"})})},resetTemp:function(){this.temp={id:void 0,params:"",page_id:1,url:"",sort:1,status:1,img_url:""}},handleCreate:function(){var t=this;this.resetTemp(),this.dialogStatus="create",this.dialogFormVisible=!0,this.$nextTick(function(){t.$refs.dataForm.clearValidate()})},createData:function(){var t=this;this.$refs.dataForm.validate(function(e){var a;e&&(a=t.temp,Object(l.a)({url:"/admin/banner",method:"post",data:r.a.stringify(a)})).then(function(){t.getList(),t.dialogFormVisible=!1,t.$notify({title:"成功",message:"创建成功",type:"success",duration:2e3})})})},handleUpdate:function(t){var e=this;this.temp=n()({page_id:1},t),this.dialogStatus="update",this.dialogFormVisible=!0,this.$nextTick(function(){e.$refs.dataForm.clearValidate()})},updateData:function(){var t=this;this.$refs.dataForm.validate(function(e){if(e){var a=n()({},t.temp);(i=a,Object(l.a)({url:"/admin/banner/update",method:"post",data:r.a.stringify(i)})).then(function(){t.getList(),t.dialogFormVisible=!1,t.$notify({title:"成功",message:"更新成功",type:"success",duration:2e3})})}var i})},formatJson:function(t,e){return e.map(function(e){return t.map(function(t){return"timestamp"===t?Object(d.c)(e[t]):e[t]})})}}},f={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container calendar-list-container"},[a("div",{staticClass:"filter-container"},[a("el-button",{staticClass:"filter-item",staticStyle:{"margin-left":"10px"},attrs:{type:"primary",icon:"el-icon-edit"},on:{click:t.handleCreate}},[t._v("新增轮播图\n\n        ")])],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],key:t.tableKey,staticStyle:{width:"100%"},attrs:{data:t.list,"element-loading-text":"给我一点时间",border:"",fit:"","highlight-current-row":"","default-sort":{prop:"banner_no",order:"ascending"}}},[a("el-table-column",{attrs:{align:"center",prop:"id",label:"轮播图id",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.id))])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",sortable:"",prop:"sort",label:"排序",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.sort))])]}}])}),t._v(" "),a("el-table-column",{staticClass:"img-show",attrs:{width:"auto",align:"center",label:"图片"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("img",{attrs:{src:t.row.img_url}})]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"150px",align:"center",label:"跳转页面名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.name))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"150px",align:"center",label:"跳转链接"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.url||"无"))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"150px",align:"center",label:"跳转参数"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(e.row.params||"无"))])]}}])}),t._v(" "),a("el-table-column",{attrs:{width:"150px",align:"center",label:"是否可用"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-tag",{attrs:{type:1==e.row.status?"success":"danger"}},[t._v(t._s(1==e.row.status?"可用":"不可用"))])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作",width:"230px","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(a){t.handleUpdate(e.row)}}},[t._v("编辑")]),t._v(" "),a("el-button",{attrs:{size:"mini",type:e.row.status?"danger":""},on:{click:function(a){t.handleModifyStatus(e.row,!e.row.status)}}},[t._v("\n                    "+t._s(1==e.row.status?"冻结":"开启")+"\n\n\n                ")])]}}])})],1),t._v(" "),a("el-dialog",{attrs:{title:t.textMap[t.dialogStatus],visible:t.dialogFormVisible},on:{"update:visible":function(e){t.dialogFormVisible=e}}},[a("el-form",{ref:"dataForm",staticStyle:{width:"400px","margin-left":"50px"},attrs:{rules:t.rules,model:t.temp,"label-position":"left","label-width":"140px"}},[a("el-form-item",{attrs:{label:"跳转页面",prop:"page_id"}},[a("el-select",{staticClass:"filter-item",attrs:{placeholder:"请选择跳转页面"},model:{value:t.temp.page_id,callback:function(e){t.$set(t.temp,"page_id",e)},expression:"temp.page_id"}},t._l(t.gotype,function(t){return a("el-option",{key:t.key,attrs:{label:t.display_name,value:t.key}})}))],1),t._v(" "),a("el-form-item",{attrs:{label:"展示图片",prop:"img_url"}},[a("uploadImg",{attrs:{imgUrl:t.temp.img_url},on:{input:t.uploadImg}})],1),t._v(" "),a("el-form-item",{attrs:{label:"跳转链接",prop:"page_type"}},[1==t.temp.page_id?a("el-input",{attrs:{placeholder:"请输入链接，如：www.baidu.com"},model:{value:t.temp.url,callback:function(e){t.$set(t.temp,"url",e)},expression:"temp.url"}}):a("el-input",{attrs:{disabled:"",value:"普通网页无需输入跳转链接"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"跳转参数",prop:"params"}},[1!=t.temp.page_id?a("el-input",{attrs:{placeholder:"请输入参数，如：课程id，推荐单id，分析师id"},model:{value:t.temp.params,callback:function(e){t.$set(t.temp,"params",e)},expression:"temp.params"}}):a("el-input",{attrs:{disabled:"",value:"普通网页无需输入跳转参数"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"轮播排序",prop:"params"}},[a("el-input-number",{model:{value:t.temp.sort,callback:function(e){t.$set(t.temp,"sort",e)},expression:"temp.sort"}})],1)],1),t._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.dialogFormVisible=!1}}},[t._v("取 消")]),t._v(" "),"create"==t.dialogStatus?a("el-button",{attrs:{type:"primary"},on:{click:t.createData}},[t._v("确 定")]):a("el-button",{attrs:{type:"primary"},on:{click:t.updateData}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var g=a("XAIM")(m,f,!1,function(t){a("Srdi")},"data-v-4bfb8e9c",null);e.default=g.exports},Srdi:function(t,e,a){var i=a("ZwFd");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a("6imX")("8037625e",i,!0)},ZwFd:function(t,e,a){(t.exports=a("bKW+")(!1)).push([t.i,"\n.banner-rules[data-v-4bfb8e9c] {\n  padding: 20px 0;\n}\n.title[data-v-4bfb8e9c] {\n  padding-bottom: 20px;\n}\nimg[data-v-4bfb8e9c] {\n  width: 100%;\n}\n",""])}});