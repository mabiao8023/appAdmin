webpackJsonp([40],{DZ1V:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("u6qr"),s=i.n(a),l=i("Edqs"),n=i.n(l),r=i("SKY5"),o=i("cAgV"),d=(i("0xDb"),[{key:"CN",display_name:"China"},{key:"US",display_name:"USA"},{key:"JP",display_name:"Japan"},{key:"EU",display_name:"Eurozone"}]),u=d.reduce(function(e,t){return e[t.key]=t.display_name,e},{}),p={name:"complexTable",directives:{waves:o.a},data:function(){return{tableKey:0,list:null,total:null,listLoading:!0,listQuery:{page:1,limit:20,date:"2018-05-20",league_id:"",type:void 0,sort:"+id",is_recommend:1},importanceOptions:[1,2,3],calendarTypeOptions:d,sortOptions:[{label:"ID Ascending",key:"+id"},{label:"ID Descending",key:"-id"}],statusOptions:["published","draft","deleted"],showReviewer:!1,temp:{id:void 0,importance:1,remark:"",timestamp:new Date,title:"",type:"",status:"published"},dialogFormVisible:!1,dialogStatus:"",textMap:{update:"Edit",create:"Create"},dialogPvVisible:!1,pvData:[],rules:{type:[{required:!0,message:"type is required",trigger:"change"}],timestamp:[{type:"date",required:!0,message:"timestamp is required",trigger:"change"}],title:[{required:!0,message:"title is required",trigger:"blur"}]},downloadLoading:!1,leagueList:[]}},filters:{statusFilter:function(e){return{published:"success",draft:"info",deleted:"danger"}[e]},typeFilter:function(e){return u[e]}},created:function(){this.getList()},methods:{getList:function(){var e=this;this.listLoading=!0,Object(r.a)(this.listQuery).then(function(t){e.list=t.data.list,e.total=t.data.meta.total,e.listLoading=!1})},handleFilter:function(){this.listQuery.page=1,this.getList()},handleSizeChange:function(e){this.listQuery.limit=e,this.getList()},handleCurrentChange:function(e){this.listQuery.page=e,this.getList()},handleModifyStatus:function(e,t){this.$message({message:"操作成功",type:"success"}),e.status=t},resetTemp:function(){this.temp={id:void 0,importance:1,remark:"",timestamp:new Date,title:"",status:"published",type:""}},handleCreate:function(){var e=this;this.resetTemp(),this.dialogStatus="create",this.dialogFormVisible=!0,this.$nextTick(function(){e.$refs.dataForm.clearValidate()})},createData:function(){var e=this;this.$refs.dataForm.validate(function(t){t&&(e.temp.id=parseInt(100*Math.random())+1024,e.temp.author="vue-element-admin",createArticle(e.temp).then(function(){e.list.unshift(e.temp),e.dialogFormVisible=!1,e.$notify({title:"成功",message:"创建成功",type:"success",duration:2e3})}))})},handleUpdate:function(e){var t=this;this.temp=n()({},e),this.temp.timestamp=new Date(this.temp.timestamp),this.dialogStatus="update",this.dialogFormVisible=!0,this.$nextTick(function(){t.$refs.dataForm.clearValidate()})},updateReStatus:function(e){var t=this;Object(r.b)(e).then(function(e){t.getList(),t.$notify({title:"成功",message:"操作成功",type:"success",duration:2e3})})},updateData:function(){var e=this;this.$refs.dataForm.validate(function(t){if(t){var i=n()({},e.temp);i.timestamp=+new Date(i.timestamp),updateArticle(i).then(function(){var t=!0,i=!1,a=void 0;try{for(var l,n=s()(e.list);!(t=(l=n.next()).done);t=!0){var r=l.value;if(r.id===e.temp.id){var o=e.list.indexOf(r);e.list.splice(o,1,e.temp);break}}}catch(e){i=!0,a=e}finally{try{!t&&n.return&&n.return()}finally{if(i)throw a}}e.dialogFormVisible=!1,e.$notify({title:"成功",message:"更新成功",type:"success",duration:2e3})})}})},handleDelete:function(e){this.$notify({title:"成功",message:"删除成功",type:"success",duration:2e3});var t=this.list.indexOf(e);this.list.splice(t,1)}}},c={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-container calendar-list-container"},[i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],key:e.tableKey,staticStyle:{width:"100%"},attrs:{data:e.list,"element-loading-text":"给我一点时间",border:"",fit:"","highlight-current-row":""}},[i("el-table-column",{attrs:{align:"center",label:"比赛id",width:"185"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.id))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"比赛日期",width:"285"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.match_time))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"联赛",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.league_name))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"主队",width:"165"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.home))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"客队",width:"165"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("span",[e._v(e._s(t.row.away))])]}}])}),e._v(" "),i("el-table-column",{attrs:{align:"center",label:"操作",width:"auto","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{on:{click:function(i){e.updateReStatus(t.row)}}},[e._v("取消精推情报\n\n\n                ")])]}}])})],1),e._v(" "),i("div",{staticClass:"pagination-container"},[i("el-pagination",{attrs:{background:"","current-page":e.listQuery.page,"page-sizes":[10,20,30,50],"page-size":e.listQuery.limit,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),i("el-dialog",{attrs:{title:e.textMap[e.dialogStatus],visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[i("el-form",{ref:"dataForm",staticStyle:{width:"400px","margin-left":"50px"},attrs:{rules:e.rules,model:e.temp,"label-position":"left","label-width":"100px"}},[i("el-form-item",{attrs:{label:"分析师id",prop:"type"}},[i("el-input",{model:{value:e.temp.user_id,callback:function(t){e.$set(e.temp,"user_id",t)},expression:"temp.user_id"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"分析师id",prop:"type"}},[i("el-input",{model:{value:e.temp.user_id,callback:function(t){e.$set(e.temp,"user_id",t)},expression:"temp.user_id"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"日期",prop:"timestamp"}},[i("el-date-picker",{attrs:{type:"datetime",placeholder:"Please pick a date"},model:{value:e.temp.timestamp,callback:function(t){e.$set(e.temp,"timestamp",t)},expression:"temp.timestamp"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"标题",prop:"title"}},[i("el-input",{model:{value:e.temp.title,callback:function(t){e.$set(e.temp,"title",t)},expression:"temp.title"}})],1)],1)],1)],1)},staticRenderFns:[]},m=i("XAIM")(p,c,!1,null,null,null);t.default=m.exports}});