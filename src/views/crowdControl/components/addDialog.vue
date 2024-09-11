<!-- 新建人群弹窗 -->
<template>
  <el-dialog
    title="新建人群"
    :visible="dialogFormVisible"
    width="70%"
    @close="close"
  >
    <div class="outerBox">
      <div>请选择人群创建方式</div>
    </div>
        <div class="fatherBox">
          <div class="childBox" v-for="(item,index) in dialogFormData">
            <div @click="goToUrl(item,index)">
              <el-image :src="item.isSubscription==0?item.src0:item.src1"></el-image>
              <div>{{item.label}}</div>
            </div>
            <el-button type="text" v-if="item.isSubscription==0" @click="subscribe(item,index)">+订阅</el-button>
          </div>
          <!--
          <div>
            <img src="@/assets/images/look.png"></img>
            <div>区域/商圈圈人</div>
            <el-button type="text" v-if="dialogFormData.subscription==0">+订阅</el-button>
          </div>
          <div>
            <img src="@/assets/images/look.png"></img>
            <div>APP组合圈人</div>
          </div>
          <div>
            <img src="@/assets/images/look.png"></img>
            <div>TA标签组合圈人</div>
          </div>
          <div>
            <img src="@/assets/images/look.png"></img>
            <div>LBS+APP标签组合圈人</div>
          </div>
          -->
        </div>
      </div>
  </el-dialog>
</template>

<script>
// import { uploadDataByFile, postDataUpdateFrom } from '@/api/dataManage'
// import { getDataInterfaceDocument } from '@/api/apiManage'
import { downloadFile } from '@/utils/file'
import { mapState, mapMutations } from 'vuex'
import store from '@/store'
export default {
  name: 'addDialog',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    // dialogFormData: {
    //   type: Object,
    //   default: function () {
    //     return ''
    //   },
    // },
    dialogFormData: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  data() {
    return {
      url:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    }
  },
  methods: {
    //点击跳转
    goToUrl(val,index){
      if(val.isSubscription==0){
        this.$message.warning('请先订阅！')
      }else{
        switch(index){
          case 0:
            this.$router.push({
              name: 'customUpload',
              params: {},
            })
            break;
          case 1:
            this.$router.push({
              name: 'district',
              params: {},
            })
            break;
          case 2:
            this.$router.push({
              name: 'appAssembly',
              params: {},
            })
            break;
          case 3:
            this.$router.push({
              name: 'tag',
              params: {},
            })
            break;
          case 4:
            this.$router.push({
              name: 'group',
              params: {},
            })
            break;
        }
      }
    },
    //订阅
    subscribe(){},
    //关闭弹窗事件
    close() {
      this.$emit('dialogFormVisible', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.outerBox{
  width:100%;
  margin:0 0 20px 45px;
}
.fatherBox{
    display:flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    text-align:center;
    .childBox{
      // flex: 1 1 16%;
      width:115px;
      margin-right:30px;
        &:hover {
          cursor: pointer !important;
        }
    }
    :nth-child(n+1){
      margin-bottom:10px;
    }
    :last-child{
      margin-right:0;
    }
  }
</style>
