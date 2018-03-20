<!-- 上传图片 -->
<template>
    <div class="upload-container">
       <img v-if="imgUrl" class="img" :src="imgUrl">
	   <input type="file" style="display:none;widht:0;height:0;" ref='uploadFile' @change="httpUpload($event)">
	   <el-button v-if="!imgUrl" type="primary" size="mini" @click.native="inputClicked"><i class="el-icon-upload el-icon--left"></i>上传图片</el-button>
		<el-button v-else type="danger" size="mini" icon="el-icon-delete" @click.native="rmImage()">删除图片</el-button>
    </div>
</template>

<script>
// 预览效果见付费文章
import { getToken } from '@/api/qiniu'

export default {
  name: 'uploadImg',
  props: {
    imgUrl: String
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  methods: {
  	// 触发上传图片
  	inputClicked(){
  		this.$refs.uploadFile.click();
  	},
  	httpUpload(event,type){
                let file = event.currentTarget.files[0];
                let form = new FormData();
                form.append('file',file);
                this.handleImageScucess('https://a.ym8800.com/upload/8d69197cca28b7bafed3548c44f6b72a.jpg')
                this.$refs.uploadFile.value = ''
                // todo:调用上传接口
                // uploadFile(form).then( res => {
                //     console.log(res);
                //     // 复制当前的url
                    
                //     this[type].img_url = res.path;
                // }).catch( e => {
                //     this.$message({
                //         message: e,
                //         type: 'error'
                //     });
                // } );
            },
    // 移除图片
    rmImage() {
      this.emitInput('')
    },
    // 事件传值
    emitInput(val) {
      this.$emit('input', val)
    },
    // 上传图片成功
    handleImageScucess( url ) {
      this.emitInput(url)
    },
   
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
   .img{
		width: 100%;
		max-width: 640px;
   }
	
</style>
