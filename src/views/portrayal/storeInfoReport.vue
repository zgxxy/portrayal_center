<!-- 门店信息报告 -->
<template>
  <div>
    <el-card class="father-card">
      <el-card class="content">
        <div class="header">
          <div class="city">
            城市：
            <el-select
              v-model="formData.city"
              filterable
              clearable
              :filterable="true"
              placeholder="请选择或输入城市"
              @change="cityChange"
              style="width: 80%;"
            >
              <el-option
                v-for="item in citys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-radio-group v-model="formData.tabPosition">
              <el-radio-button label="行政区">行政区</el-radio-button>
              <el-radio-button label="商圈">商圈</el-radio-button>
            </el-radio-group>
            <span style="margin-left: 10px;">
              <el-select
                v-if="formData.tabPosition == '行政区'"
                v-model="formData.region"
                @change="regionChange"
                filterable
                clearable
                placeholder="请选择或输入行政区"
                style="width: 50%;"
              >
                <el-option
                  v-for="item in regions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-else
                v-model="formData.business"
                filterable
                clearable
                placeholder="请选择或输入商圈"
                style="width: 50%;"
              >
                <el-option
                  v-for="item in businesses"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
          </div>
        </div>
      </el-card>
      <el-card class="mapBox">
        <div class="mapBox_0">
          <AMap
            :heatmapData="heatmapData"
            class="left_box"
            ref="child"
            :value="formData.searchValue"
            @click="poiClick"
          ></AMap>
          <div class="fixed-box">
            <div class="selectBox">
              <span>品牌：</span>
              <mul-select
                :options="brandList"
                :selectList="mulSelecteds"
                :loading="mulSelectLoading"
                @change="mulChange"
                class="brandselect"
              ></mul-select>
              <i
                class="el-icon-setting"
                v-if="brandList.length > 0"
                @click="settingShow = !settingShow"
              ></i>
            </div>
            <div class="transition">
              <transition name="el-zoom-in-top">
                <div v-show="settingShow" style="display: flex;">
                  <div class="tabBox">
                    <div style="text-align: center; display: block;">
                      <el-radio-group
                        v-model="settingTab"
                        class="radioDiv"
                        v-for="(item, index) in TabList"
                      >
                        <div>
                          <el-radio-button :label="item.label">
                            <el-image
                              :src="item.url"
                              style="width: 20px; height: 20px;"
                            ></el-image>
                          </el-radio-button>
                        </div>
                      </el-radio-group>
                    </div>
                  </div>
                  <div class="contentBox">
                    <el-checkbox-group
                      v-model="mulSelecteds"
                      @change="brandChange"
                    >
                      <el-checkbox
                        v-for="item in brandList"
                        :label="item.label"
                        :name="item.label"
                        :key="item.label"
                        class="brand-checkbox"
                      >
                        <div class="brandBox">
                          <el-image
                            :src="
                              item.url
                                ? require('@/assets/images/brandIcon/' +
                                    item.url)
                                : ''
                            "
                            style="
                              width: 45px;
                              height: 45px;
                              border-radius: 50%;
                            "
                          ></el-image>
                          <div>{{ item.label }}</div>
                        </div>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="right_box">
            <div v-if="formData.city">
              <div class="head-box interval">
                <div>
                  {{ formData.city ? cityCompute(formData.city) : '--' }}
                </div>
                <i class="el-icon-setting setting" @click="settingDialog"></i>
              </div>
              <div class="interval">
                <div class="head-box">
                  <headline>竞品品牌分布</headline>
                  <el-select
                    class="small"
                    v-model="formData.business"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width: 50%;"
                  >
                    <el-option
                      v-for="item in businesses"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <el-table
                  ref="multipleTable"
                  :data="dataList.competitorBrand"
                  style="width: 100%; margin-top: 16px;"
                  border
                  stripe
                  :header-cell-style="{
                    background: '#eef5ff',
                    color: '#606266',
                  }"
                  :cell-style="{ borderColor: '#d8e6fe' }"
                >
                  <!--<el-table-column type="index" label="序号" width="50" />-->
                  <el-table-column
                    prop="logo"
                    label="logo"
                    align="left"
                    width="60"
                  >
                    <template slot-scope="scope">
                      <el-image
                        :src="
                          require('@/assets/images/brandIcon/' + scope.row.logo)
                        "
                        style="width: 30px; height: 30px;"
                      >
                        <div slot="error" class="image-slot">
                          <i
                            class="el-icon-menu"
                            style="font-size: 33px; color: #cce0fc;"
                          ></i>
                        </div>
                      </el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="brandName" label="品牌名称" />
                  <el-table-column
                    prop="storeNum"
                    label="店铺数量"
                    width="60"
                  />
                </el-table>
              </div>
              <div class="interval">
                <headline>本/协同品牌分布</headline>
                <el-table
                  ref="multipleTable"
                  :data="dataList.synergyBrand"
                  style="width: 100%; margin-top: 16px;"
                  border
                  stripe
                  :header-cell-style="{
                    background: '#eef5ff',
                    color: '#606266',
                  }"
                  :cell-style="{ borderColor: '#d8e6fe' }"
                >
                  <!--<el-table-column type="index" label="序号" width="50" />-->
                  <el-table-column
                    prop="logo"
                    label="logo"
                    align="left"
                    width="60"
                  >
                    <template slot-scope="scope">
                      <el-image
                        :src="
                          require('@/assets/images/brandIcon/' + scope.row.logo)
                        "
                        style="width: 30px; height: 30px;"
                      >
                        <div slot="error" class="image-slot">
                          <i
                            class="el-icon-menu"
                            style="font-size: 33px; color: #cce0fc;"
                          ></i>
                        </div>
                      </el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="brandName" label="品牌名称" />
                  <el-table-column
                    prop="storeNum"
                    label="店铺数量"
                    width="60"
                  />
                </el-table>
              </div>
              <div class="interval">
                <div class="head-box">
                  <headline>行政区排名</headline>
                  <el-select
                    class="small"
                    v-model="formData.business"
                    filterable
                    clearable
                    placeholder="请选择"
                    style="width: 50%;"
                  >
                    <el-option
                      v-for="item in businesses"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <el-table
                  ref="multipleTable"
                  :data="dataList.regionRank"
                  style="width: 100%; margin-top: 16px;"
                  border
                  stripe
                  :header-cell-style="{
                    background: '#eef5ff',
                    color: '#606266',
                  }"
                  :cell-style="{ borderColor: '#d8e6fe' }"
                >
                  <el-table-column prop="" label="排名" align="left" width="33">
                    <template slot-scope="scope">
                      <div
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          margin-left: 10px;
                        "
                      >
                        <div
                          class="rank-box"
                          :class="{
                            'rank-redBox1': scope.$index == 0,
                            'rank-redBox2': scope.$index == 1,
                            'rank-redBox3': scope.$index == 2,
                            'rank-blueBox': scope.$index > 2,
                          }"
                        >
                          {{ scope.$index + 1 }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="region" label="行政区" width="50" />
                  <el-table-column
                    prop="targetProp"
                    label="目标客占比"
                    width="70"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.targetProp ? scope.row.targetProp + '%' : '--'
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="commercialExponent"
                    label="业态密度指数"
                  />
                </el-table>
              </div>
            </div>
            <el-empty v-else description="暂无数据" />
          </div>
        </div>
      </el-card>
    </el-card>
    <setting
      :dialog-form-visible.sync="dialogFormVisible"
      :dialogFormData="dialogFormData"
      @dialogFormVisible="closeFrom"
    />
  </div>
</template>
<script>
import {
  getAllCityCode,
  getAdministrativeRegionsCodeByCityName,
} from '@/api/crowdControl'
import { getActiveLocalCity, getStoreInfo } from '@/api/sceneApplication'
import { getThermalMapByTaskId } from '@/api/report'
import AMap from '@/components/MapContainer/AMap'
import Column from '@/components/echarts/ColumnLine.vue'
import myLine from '@/components/echarts/Line.vue'
import setting from '@/views/sceneApplication/components/brandSetting.vue'
import { bMapTransAMap } from '@/utils/public'
import mulSelect from '@/components/whole/mulSelect'
export default {
  components: {
    AMap,
    Column,
    myLine,
    setting,
    mulSelect,
  },
  data() {
    return {
      data: this.$route.query,
      activeName: 'second', //tab
      formData: {
        city: '',
        tabPosition: '行政区',
        region: '',
        business: '',
        radio: 1,
        searchValue: '',
      },
      citys: [], //城市选择下拉框
      regions: [], //行政区下拉框
      businesses: [], //商圈下拉框
      dialogFormVisible: false, //规则配置弹窗
      dialogFormData: {},
      settingShow: false,
      settingTab: '0',
      TabList: [
        {
          label: 0,
          name: '停车场',
          url: require('@/assets/images/slices/park.png'),
        },
        {
          label: 1,
          name: '洗车',
          url: require('@/assets/images/slices/wash.png'),
        },
        {
          label: 2,
          name: '修车',
          url: require('@/assets/images/slices/repair.png'),
        },
        {
          label: 3,
          name: '交车',
          url: require('@/assets/images/slices/car.png'),
        },
      ],
      brandList: [], //品牌列表
      dataList: {}, //页面总数据
      mulSelecteds: [], //品牌选中数组
      mulSelectLoading: false,
      heatmapData: [], //热力数据
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      //获取城市列表
      getActiveLocalCity().then((response) => {
        if (response.code == 200) {
          response.data.forEach((e) => {
            this.citys.push({
              label: e.city,
              value: e.cityCode,
              provinceCode: e.provinceCode,
            })
          })
        }
      })
    },
    //获取品牌
    getBrand() {
      const that = this
      return new Promise((resolve, reject) => {
        getStoreInfo().then((res) => {
          if (res.status == 200) {
            that.dataList = res.data
            let brand = JSON.parse(JSON.stringify(that.dataList.position)) //数组是引用类型, 深拷贝一下
            brand.map((e) => {
              delete e.cityName, delete e.name, delete e.geoCenter
            })
            that.brandList = Array.from(
              new Set(brand.map(JSON.stringify)),
              JSON.parse,
            )
            that.brandList.map((e, i) => {
              if (e.brand.indexOf('、') != -1) that.brandList.splice(i, 1)
            })
            that.brandList = that.brandList.map((e, i) => {
              return { label: e.brand, url: e.url, value: e.value }
            })
            // console.log(that.dataList, 'dataList')
            console.log(that.brandList, 'brandList')
            resolve(true)
          }
        })
      }).catch((err) => {})
    },
    //获取行政区
    getRegions(val) {
      this.regions = []
      this.formData.region = ''
      // if (this.data.cityCode) {
      getAdministrativeRegionsCodeByCityName({
        // cityCode: this.data.cityCode,
        cityCode: val,
      }).then((res) => {
        if (res.code == 200) {
          res.data.forEach((e) => {
            if (e.name) {
              this.regions.push({
                label: e.name,
                value: e.value,
              })
            }
          })
        }
      })
      // }
    },
    //选择城市
    async cityChange(val) {
      const that = this
      console.log(this.mulSelecteds, '品牌选择')
      this.getRegions(val)
      let city = this.citys.find((el) => el.value.indexOf(val)).label
      let pois = []
      let res = await this.getBrand()
      if (res) {
        that.dataList?.position?.forEach((e) => {
          if (city.indexOf(e.cityName)) {
            pois.push({
              name: e.name,
              location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
              url: e.url ? require('@/assets/images/brandIcon/' + e.url) : null,
              imageSize: [28, 28],
            })
          }
        })
        console.log(pois, '位置信息')
        this.$refs.child.addMarker({
          poi: pois,
        })
      } else {
        this.$message.error('获取品牌坐标失败')
      }
    },
    //选择行政区
    regionChange(val) {
      let region = this.regions.find((e) => e.value == val).label
      this.$refs.child.regionSearch(region)
    },
    cityCompute(val) {
      let city = this.citys.find((e) => e.value == val).label
      return city
    },
    //点击地图
    poiClick(val) {
      console.log(this.mulSelecteds, '选中品牌')
      console.log(val, 'marker点击事件')
      // let { href } = this.$router.resolve({
      //   name: 'marketDetail',
      //   query: val.data,
      // })
      // window.open(href, '_blank')
    },
    brandChange(val) {
      console.log(val, 'brandChange')
    },
    mulChange(val) {
      this.mulSelecteds = val
    },
    groupByMethod(arr, fnOrProperty) {
      return arr
        .map(
          typeof fnOrProperty === 'function'
            ? fnOrProperty
            : (val) => val[fnOrProperty],
        )
        .reduce((acc, val, i) => {
          acc[val] = (acc[val] || []).concat(arr[i])
          return acc
        }, {})
    },
    //配置弹窗
    settingDialog() {
      this.dialogFormVisible = true
      let data = {
        traditional: [
          {
            label: '传统1',
            value: 0,
          },
          {
            label: '传统2',
            value: 1,
          },
          {
            label: '传统3',
            value: 2,
          },
          {
            label: '传统4',
            value: 3,
          },
          {
            label: '传统5',
            value: 4,
          },
        ],
        newPower: [
          {
            label: '新势力1',
            value: 0,
          },
          {
            label: '新势力2',
            value: 1,
          },
          {
            label: '新势力33333',
            value: 2,
          },
        ],
        synergy: [
          {
            label: '协同1',
            value: 0,
          },
          {
            label: '协同2',
            value: 1,
          },
          {
            label: '协同3',
            value: 2,
          },
        ],
      }
      this.dialogFormData = data
    },
    //关闭弹窗
    closeFrom(val) {
      this.dialogFormVisible = val
    },
  },
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  // white-space: nowrap;
  .city {
    font-weight: 900;
    margin-right: 15px;
  }
  // :last-child {
  //   margin-left: auto;
  //   margin-right: 0;
  // }
}
.setting {
  color: #418ff6;
  cursor: pointer;
  font-size: 18px;
  margin-left: 5px;
  padding: 3px;
  border-radius: 3px;
  background: linear-gradient(120deg, #e6f3fd 50%, #f5e4ff 100%);
}
::v-deep .mapBox .el-card__body {
  padding: 0;
  background: linear-gradient(
    179deg,
    #edf8ff 0%,
    rgba(248, 252, 255, 0.46) 51%,
    #ffffff 100%,
    #ffffff 100%
  );
}
.mapBox_0 {
  display: flex;
  position: relative;
  .left_box {
    flex: 1;
  }
  .right_box {
    height: 555px;
    overflow-y: auto;
    width: 260px;
    padding: 10px;
    .head-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .interval {
      margin-bottom: 15px;
    }
  }
  .label {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .setting_box {
    margin-bottom: 20px;
  }
}
.fixed-box {
  z-index: 999;
  position: absolute;
  width: 300px;
  left: 10px;
  top: 20px;
  padding: 5px;
  border-radius: 5px;

  .selectBox {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 0;
    padding: 5px 10px;
    background: #fff;
    span {
      width: 50px;
    }
    i {
      font-size: 18px;
      margin-left: 8px;
      cursor: pointer;
    }
    ::v-deep .brandselect .el-input__inner {
      background: transparent;
    }
  }
  .transition {
    z-index: 999;
    box-shadow: 0px 0px 4px 0px rgba(185, 214, 255, 0.18);
    //tab窗
    .tabBox {
      background: #ffffff;
      border-right: 1px #e1f0ff solid;
      .radioDiv {
        margin: 0 auto;
        width: auto;
        text-align: left;
        display: table;
      }
      ::v-deep .el-radio-button__orig-radio + .el-radio-button__inner {
        // opacity: 0.8;
        // background: #ffffff;
      }
      ::v-deep .el-radio-button:first-child:last-child .el-radio-button__inner {
        border-radius: 0px;
        border: none;
      }
      ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background-color: #e1f0ff;
      }
    }
    //内容窗
    .contentBox {
      max-height: 290px;
      width: 260px;
      background: #ffffff;
      padding: 10px;
      overflow-y: auto;
      .brandBox {
        display: flex;
        margin: 5px 0;
        align-items: center;
        :first-child {
          margin-right: 10px;
        }
      }
      ::v-deep .brand-checkbox .el-checkbox__input {
        display: inline-block;
        position: relative;
        right: -200px;
        top: 12px;
        margin-left: -15px;
      }
    }
  }
}

::v-deep .tabBox .el-radio-button__inner {
  width: 50px;
  padding: 15px 5px;
}
.nested-enter-from,
.nested-leave-to {
  transform: translateX(-150px);
  opacity: 0;
}
.headline-box {
  margin-bottom: 0px;
}
::v-deep .small.el-select .el-input__inner {
  height: 10px;
}
::v-deep .content .el-form-item__label {
  width: 80px !important;
}
::v-deep .tabs .el-tabs__item {
  font-size: 12px;
  font-weight: 600;
  font-size: 12px;
  padding: 0 15px;
}
</style>
