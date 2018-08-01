<!-- 上传图片组件 -->
<template>
    <div class="upload-container">
        <video v-if="imgUrl" class="img" autoplay :src="imgUrl"></video>
        <input type="file" style="display:none;widht:0;height:0;" ref='uploadFile' @change="httpUpload($event)">
        <el-button
            v-if="!imgUrl"
            type="primary"
            size="mini"
            @click.native="inputClicked">
            <i class="el-icon-upload el-icon--left"></i>上传视频

        </el-button>
        <el-button
            v-else
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="rmImage()">
            删除视频

        </el-button>
    </div>
</template>

<script>
    import {uploadVideo} from '@/api/upload'
    export default {
        name: 'uploadImg',
        props: {
            imgUrl: String
        },
        computed: {},
        data() {
            return {
                tempUrl: '',
            }
        },
        methods: {
            // 触发上传图片
            inputClicked(){
                this.$refs.uploadFile.click();
            },
            httpUpload(event, type){
                let file = event.currentTarget.files[0];
                let form = new FormData();
                form.append('file', file);
                uploadVideo(form).then(res => {
                    this.handleImageScucess(res.data.path)
                    this.$refs.uploadFile.value = ''
                }).catch(e => {
                    this.$message({
                        message: e,
                        type: 'error'
                    });
                })
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
            handleImageScucess(url) {
                this.emitInput(url)
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .img {
        width: 100%;
        max-width: 640px;
    }
</style>
