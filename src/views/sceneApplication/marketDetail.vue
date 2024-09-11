<!-- 商场详情 -->
<template>
  <div>
    <el-card class="father-card">
      <el-card class="top_data_box" v-if="basicData.shopBaseDataVO">
        <div class="title">
          {{ basicData.shopBaseDataVO.shopName }}
        </div>
        <div>
          <i
            class="el-icon-location"
            style="font-size: 18px; color: #418bff;"
          ></i>
          {{ basicData.shopBaseDataVO.address }}
        </div>
        <div class="data_box">
          <div class="dataBox1">
            <div>
              <span>{{ basicData.shopBaseDataVO.openingTime || '--' }}</span>
            </div>
            <div>开业时间</div>
          </div>
          <div class="dataBox1">
            <div>
              <span>{{ basicData.shopBaseDataVO.commerceArea || 0 }}</span>
              万㎡
            </div>
            <div>商业面积</div>
          </div>
          <div class="dataBox1" v-if="basicData.shopBaseDataVO.numberFloor">
            <div>
              <span>{{ basicData.shopBaseDataVO.numberFloor || 0 }}</span>
              层
            </div>
            <div>楼层数</div>
          </div>
          <div class="dataBox1" v-if="basicData.shopBaseDataVO.parkingSpot">
            <div>
              <span>{{ basicData.shopBaseDataVO.parkingSpot || 0 }}</span>
              个
            </div>
            <div>停车位</div>
          </div>
          <div class="dataBox1">
            <div>
              <span>{{ basicData.shopBaseDataVO.numberStore || 0 }}</span>
              个
            </div>
            <div>入驻商户</div>
          </div>
          <div class="dataBox1">
            <div>
              <span>{{ basicData.shopBaseDataVO.rent || 0 }}</span>
              元/月/㎡
            </div>
            <div>租金均价</div>
          </div>
        </div>
      </el-card>
      <div class="content_box">
        <el-tabs v-model="activeName" class="tabs" @tab-click="tabClick">
          <el-tab-pane label="客流信息" name="first">
            <div v-if="activeName == 'first' && customerData">
              <div class="purple_box">
                <div
                  class="dataBox2"
                  v-for="(item, index) in customerData.data"
                  :key="'data' + index"
                >
                  <i class="icon" :class="item.class"></i>
                  <div>
                    <div>{{ item.name }}</div>
                    <span>{{ thousandFormat(item.value) }}</span>
                  </div>
                </div>
              </div>
              <div style="margin-bottom: 20px;">
                <headline>工作日/节假日日均客流量趋势</headline>
                <column
                  v-if="basicData.dayPassingFlowVO"
                  ref="echarts"
                  :data="basicData.dayPassingFlowVO.dataList"
                  :xAxis="basicData.dayPassingFlowVO.xaxis"
                  :yName="['单位：万人', '单位：万人']"
                  :interval="1"
                  :xLength="10"
                />
              </div>
              <div style="margin-bottom: 20px;">
                <headline>月均客流量趋势</headline>
                <myLine
                  v-if="basicData.monthPassingFlowVO"
                  ref="echarts"
                  :data="basicData.monthPassingFlowVO.dataList"
                  :xAxis="basicData.monthPassingFlowVO.xaxis"
                  :smooth="true"
                  :areaStyle="true"
                  :xLength="10"
                  yName="单位：万人"
                  symbol="none"
                />
              </div>
            </div>
            <el-empty v-else description="暂无数据" style="height: 100%;" />
          </el-tab-pane>
          <el-tab-pane label="客流来源" name="second">
            <div>
              <el-radio-group v-model="source" @input="radioChang">
                <el-radio-button label="0">居住客流-来源小区</el-radio-button>
                <el-radio-button label="1">工作客流-来源写字楼</el-radio-button>
              </el-radio-group>
              <div class="mapBox_0">
                <AMap class="left_box" ref="child" />
                <div class="right_box">
                  <headline>
                    {{ (source == 0 ? '来源小区' : '来源写字楼') + 'top 50' }}
                  </headline>
                  <el-input
                    placeholder="输入商场名称搜索"
                    v-model="customerSourceForm.marketName"
                    style="margin-bottom: 10px;"
                    clearable
                    @keyup.enter.native="getCustomerSource"
                  >
                    <i
                      class="el-icon-search el-input__icon"
                      slot="suffix"
                      @click="getCustomerSource"
                    ></i>
                  </el-input>
                  <div>
                    <el-table
                      :data="customerSource"
                      :header-cell-style="{
                        background: '#eef5ff',
                        color: '#606266',
                        borderColor: '#d8e6fe',
                        fontSize: '12px',
                      }"
                      :row-style="{ height: '35px' }"
                      :cell-style="{
                        borderColor: '#d8e6fe',
                        padding: '0',
                      }"
                      style="width: 100%; margin-bottom: 20px;"
                    >
                      <el-table-column
                        prop="houseName"
                        label="小区名称"
                        :show-overflow-tooltip="true"
                      >
                        <template slot-scope="scope">
                          <div>
                            <div
                              style="
                                display: flex;
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
                              {{ scope.row.houseName }}
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="contributionRate"
                        label="贡献率"
                        width="70px"
                      >
                        <template slot-scope="scope" slot="header">
                          <div style="display: flex; justify-content: center;">
                            <span>贡献率</span>
                            <div style="display: flex; flex-direction: column;">
                              <i
                                :class="{
                                  'sortIcon-focus':
                                    customerSourceForm.sort ==
                                      'contributionRate' &&
                                    customerSourceForm.asc,
                                  'sortIcon-cancel':
                                    customerSourceForm.sort !==
                                      'contributionRate' ||
                                    !customerSourceForm.asc,
                                }"
                                class="el-icon-caret-top sortIcon"
                                @click="sortClick('contributionRate', true)"
                              ></i>
                              <i
                                :class="{
                                  'sortIcon-focus':
                                    customerSourceForm.sort ==
                                      'contributionRate' &&
                                    !customerSourceForm.asc,
                                  'sortIcon-cancel':
                                    customerSourceForm.sort !==
                                      'contributionRate' ||
                                    customerSourceForm.asc,
                                }"
                                class="el-icon-caret-bottom sortIcon"
                                @click="sortClick('contributionRate', false)"
                              ></i>
                            </div>
                          </div>
                        </template>
                        <template slot-scope="scope">
                          <div>
                            {{ scope.row.contributionRate || '--' }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="permeateRate"
                        label="渗透率"
                        width="70px"
                      >
                        <template slot-scope="scope" slot="header">
                          <div style="display: flex; justify-content: center;">
                            <span>渗透率</span>
                            <div style="display: flex; flex-direction: column;">
                              <i
                                :class="{
                                  'sortIcon-focus':
                                    customerSourceForm.sort == 'permeateRate' &&
                                    customerSourceForm.asc,
                                  'sortIcon-cancel':
                                    customerSourceForm.sort !==
                                      'permeateRate' || !customerSourceForm.asc,
                                }"
                                class="el-icon-caret-top sortIcon"
                                @click="sortClick('permeateRate', true)"
                              ></i>
                              <i
                                :class="{
                                  'sortIcon-focus':
                                    customerSourceForm.sort == 'permeateRate' &&
                                    !customerSourceForm.asc,
                                  'sortIcon-cancel':
                                    customerSourceForm.sort !==
                                      'permeateRate' || customerSourceForm.asc,
                                }"
                                class="el-icon-caret-bottom sortIcon"
                                @click="sortClick('permeateRate', false)"
                              ></i>
                            </div>
                          </div>
                        </template>
                        <template slot-scope="scope">
                          <div>
                            {{ scope.row.permeateRate || '--' }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      :current-page="customerSourcePage.pageNo"
                      :page-size="customerSourcePage.pageSize"
                      :pager-count="5"
                      layout="total, prev, pager, next"
                      :total="customerSourceTotal"
                      @current-change="sourceCurrentChange"
                      class="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="客流画像" name="third">
            <div v-if="activeName == 'third'">
              <div class="third_box">
                <div class="home">
                  <div class="yellow_box">
                    <el-image
                      style="width: 37px; height: 37px; margin-right: 10px;"
                      :src="require('@/assets/images/slices/home_people.svg')"
                    ></el-image>
                    <div
                      class="dataBox"
                      v-for="(item, index) in customerPortrayal
                        .residentPopulation.basicData"
                      :key="'homepeople' + index"
                    >
                      <div>{{ item.name }}</div>
                      <div v-if="index != 2">
                        {{ item.value ? thousandFormat(item.value) : 0 }}
                      </div>
                      <div v-else>{{ item.value || 0 }}%</div>
                    </div>
                    <el-image
                      v-if="
                        customerPortrayal.residentPopulation.basicData.length >
                        3
                      "
                      style="width: 37px; height: 37px; margin-right: 10px;"
                      :src="up_down_url[0]"
                    ></el-image>
                  </div>
                  <div class="home_data">
                    <headline>居住人群-性别分布</headline>
                    <div class="gander_data_box">
                      <div
                        style="width: 90px;"
                        v-if="
                          customerPortrayal.residentPopulation
                            .genderDistribution[0].TGI
                        "
                      >
                        <el-image
                          style="width: 37px; height: 37px; margin-right: 10px;"
                          :src="require('@/assets/images/slices/man_tgi.svg')"
                        ></el-image>
                        <div style="color: #5ea3ff; margin-bottom: 10px;">
                          TGI：{{
                            customerPortrayal.residentPopulation
                              .genderDistribution[0].TGI || 0
                          }}
                        </div>
                        <el-image
                          style="width: 37px; height: 37px; margin-right: 10px;"
                          :src="require('@/assets/images/slices/woman_tgi.svg')"
                        ></el-image>
                        <div style="color: #ffd067;">
                          TGI：{{
                            customerPortrayal.residentPopulation
                              .genderDistribution[1].TGI || 0
                          }}
                        </div>
                      </div>
                      <PIE
                        :data="
                          customerPortrayal.residentPopulation
                            .genderDistribution
                        "
                        :color="[
                          { c1: '#AECBFF', c2: '#5EA3FF' },
                          { c1: '#FBF676', c2: '#FFD067' },
                        ]"
                        labelColor="#333"
                      />
                    </div>
                  </div>
                  <div class="home_data">
                    <headline>居住人群-年龄分布</headline>
                    <div>
                      <ColumnLine
                        :data="
                          customerPortrayal.residentPopulation.ageDistribution
                            .dataList
                        "
                        :xAxis="
                          customerPortrayal.residentPopulation.ageDistribution
                            .xaxis
                        "
                        :xLength="10"
                        units="%"
                        :legendShow="false"
                      />
                    </div>
                  </div>
                  <div class="home_data">
                    <headline>居住人群-家庭情况</headline>
                    <div style="display: flex;">
                      <Gauge
                        :type="0"
                        text="已婚"
                        :imageUrl="home_url[0]"
                        :data="
                          Number(
                            customerPortrayal.residentPopulation.isMarried,
                          ) * 100
                        "
                        :fontSize="20"
                      />
                      <Gauge
                        :type="3"
                        text="有小孩"
                        :imageUrl="home_url[1]"
                        :data="
                          Number(
                            customerPortrayal.residentPopulation.haveChildren,
                          ) * 100
                        "
                        :fontSize="20"
                      />
                    </div>
                  </div>
                  <div class="home_data">
                    <headline>居住人群-收入水平</headline>
                    <div>
                      <ColumnLine
                        :data="
                          customerPortrayal.residentPopulation.incomeLevel
                            .dataList
                        "
                        :xAxis="
                          customerPortrayal.residentPopulation.incomeLevel.xaxis
                        "
                        units="%"
                        :legendShow="false"
                        :color="['#FBF676', '#FFD067']"
                      />
                    </div>
                  </div>
                  <div class="home_data">
                    <headline>居住人群-学历水平</headline>
                    <div>
                      <ColumnLine
                        :data="
                          customerPortrayal.residentPopulation.educationalLevel
                            .dataList
                        "
                        :xAxis="
                          customerPortrayal.residentPopulation.educationalLevel
                            .xaxis
                        "
                        units="%"
                        :legendShow="false"
                        :color="['#FBF676', '#FFD067']"
                      />
                    </div>
                  </div>
                </div>
                <div class="work">
                  <div class="blue_box">
                    <el-image
                      style="width: 37px; height: 37px; margin-right: 10px;"
                      :src="require('@/assets/images/slices/work_people.svg')"
                    ></el-image>
                    <div
                      class="dataBox"
                      v-for="(item, index) in customerPortrayal.workPopulation
                        .basicData"
                      :key="'workpeople' + index"
                    >
                      <div>{{ item.name }}</div>
                      <div v-if="index != 2">
                        {{ item.value ? thousandFormat(item.value) : 0 }}
                      </div>
                      <div v-else>{{ item.value || 0 }}%</div>
                    </div>
                    <el-image
                      v-if="
                        customerPortrayal.residentPopulation.basicData.length >
                        3
                      "
                      style="width: 37px; height: 37px; margin-right: 10px;"
                      :src="up_down_url[1]"
                    ></el-image>
                  </div>
                  <div class="work_data">
                    <headline>工作人群-性别分布</headline>
                    <div class="gander_data_box">
                      <div
                        style="width: 90px;"
                        v-if="
                          customerPortrayal.workPopulation.genderDistribution[0]
                            .TGI
                        "
                      >
                        <el-image
                          style="width: 37px; height: 37px; margin-right: 10px;"
                          :src="require('@/assets/images/slices/man_tgi.svg')"
                        ></el-image>
                        <div style="color: #5ea3ff; margin-bottom: 10px;">
                          TGI：{{
                            customerPortrayal.workPopulation
                              .genderDistribution[0].TGI || 0
                          }}
                        </div>
                        <el-image
                          style="width: 37px; height: 37px; margin-right: 10px;"
                          :src="require('@/assets/images/slices/woman_tgi.svg')"
                        ></el-image>
                        <div style="color: #ffd067;">
                          TGI：{{
                            customerPortrayal.workPopulation
                              .genderDistribution[1].TGI || 0
                          }}
                        </div>
                      </div>
                      <PIE
                        :data="
                          customerPortrayal.workPopulation.genderDistribution
                        "
                        :color="[
                          { c1: '#AECBFF', c2: '#5EA3FF' },
                          { c1: '#FBF676', c2: '#FFD067' },
                        ]"
                        labelColor="#333"
                      />
                    </div>
                  </div>
                  <div class="work_data">
                    <headline>工作人群-年龄分布</headline>
                    <div>
                      <div></div>
                      <ColumnLine
                        :data="
                          customerPortrayal.workPopulation.ageDistribution
                            .dataList
                        "
                        :xAxis="
                          customerPortrayal.workPopulation.ageDistribution.xaxis
                        "
                        :xLength="10"
                        units="%"
                        :legendShow="false"
                      />
                    </div>
                  </div>
                  <div class="work_data">
                    <headline>工作人群-家庭情况</headline>
                    <div style="display: flex;">
                      <Gauge
                        :type="0"
                        text="已婚"
                        :imageUrl="home_url[0]"
                        :data="
                          Number(customerPortrayal.workPopulation.isMarried) *
                          100
                        "
                        :fontSize="20"
                      />
                      <Gauge
                        :type="3"
                        text="有小孩"
                        :imageUrl="home_url[1]"
                        :data="
                          Number(
                            customerPortrayal.workPopulation.haveChildren,
                          ) * 100
                        "
                        :fontSize="20"
                      />
                    </div>
                  </div>
                  <div class="work_data">
                    <headline>工作人群-收入水平</headline>
                    <div>
                      <ColumnLine
                        :data="
                          customerPortrayal.workPopulation.incomeLevel.dataList
                        "
                        :xAxis="
                          customerPortrayal.workPopulation.incomeLevel.xaxis
                        "
                        units="%"
                        :legendShow="false"
                      />
                    </div>
                  </div>
                  <div class="work_data">
                    <headline>工作人群-学历水平</headline>
                    <div>
                      <ColumnLine
                        :data="
                          customerPortrayal.workPopulation.educationalLevel
                            .dataList
                        "
                        :xAxis="
                          customerPortrayal.workPopulation.educationalLevel
                            .xaxis
                        "
                        units="%"
                        :legendShow="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂无数据" style="height: 100%;" />
          </el-tab-pane>
          <el-tab-pane label="周边配套" name="fourth">
            <div class="fourth_box">
              <AMap mapId="fourthAmap" ref="fourthAmap" />
              <!--<el-button class="btn" @click="show = !peripheralShow">Toggle</el-button>-->
              <i
                class="el-icon-s-fold btn"
                @click="peripheralShow = !peripheralShow"
                v-show="!peripheralShow"
              ></i>
              <i
                class="el-icon-s-unfold btn"
                @click="peripheralShow = !peripheralShow"
                v-show="peripheralShow"
              ></i>
              <div class="transition">
                <Transition name="nested">
                  <div
                    v-show="peripheralShow"
                    style="display: flex;"
                    class="outer"
                  >
                    <div class="tabBox">
                      <div style="text-align: center; display: block;">
                        <el-radio-group
                          v-model="peripheralTab"
                          class="radioDiv"
                          v-for="item in peripheralTabList"
                          @input="peripheralTabChange(peripheralTab)"
                        >
                          <div>
                            <el-radio-button :label="item.label">
                              {{ item.name }}
                            </el-radio-button>
                          </div>
                        </el-radio-group>
                      </div>
                    </div>
                    <div class="contentBox">
                      <!--
                      <el-select
                        v-model="peripheralDistance"
                        placeholder="请选择"
                        @change="peripheralDistanceChange"
                        size="mini"
                        style="width: 50%;"
                      >
                        <el-option
                          v-for="value in distanceList"
                          :key="'distance' + value.value"
                          :label="value.label"
                          :value="value.value"
                        ></el-option>
                      </el-select>
                      -->
                      <div
                        style="display: flex; align-items: end;"
                        :style="
                          peripheralData.SurroundingShopStatistics.dataList
                            ? 'justify-content: space-between;'
                            : 'justify-content: flex-end;'
                        "
                      >
                        <headline
                          v-if="
                            peripheralData.SurroundingShopStatistics.dataList
                          "
                        >
                          {{ peripheralTab | peripheralEcharts }}
                        </headline>
                        <el-select
                          v-model="peripheralDistance"
                          placeholder="请选择"
                          @change="peripheralDistanceChange"
                          size="mini"
                          style="width: 50%;"
                        >
                          <el-option
                            v-for="value in distanceList"
                            :key="'distance' + value.value"
                            :label="value.label"
                            :value="value.value"
                          ></el-option>
                        </el-select>
                      </div>
                      <div
                        :class="{
                          contentBox_data: !peripheralData
                            .SurroundingShopStatistics.dataList,
                        }"
                      >
                        <div
                          class="echartsBox"
                          v-if="
                            peripheralData.SurroundingShopStatistics.dataList
                          "
                        >
                          <ColumnLine
                            :data="
                              peripheralData.SurroundingShopStatistics.dataList
                            "
                            :xAxis="
                              peripheralData.SurroundingShopStatistics.xaxis
                            "
                            height="160px"
                          />
                        </div>
                        <headline>
                          {{ peripheralTab | peripheralTable }}
                        </headline>
                        <el-table
                          ref="table"
                          :data="peripheralData.detailTable"
                          style="width: 100%;"
                          border
                          stripe
                          :header-cell-style="{
                            background: '#eef5ff',
                            color: '#606266',
                            borderColor: '#d8e6fe',
                            fontSize: '12px',
                            height: '20px',
                          }"
                          :cell-style="{
                            borderColor: '#d8e6fe',
                            padding: '0',
                          }"
                          :row-style="{ height: '28px' }"
                        >
                          <el-table-column
                            type="index"
                            label="序号"
                            width="35"
                          />
                          <el-table-column
                            prop="name"
                            label="名称"
                            align="left"
                            :show-overflow-tooltip="true"
                            width="125"
                          />
                          <el-table-column prop="type" label="类别" />
                          <el-table-column
                            prop="eigenvector"
                            label="商业面积"
                            v-if="peripheralTab == 0"
                            :key="'商业面积' + Math.random()"
                          >
                            <template slot-scope="scope">
                              {{
                                scope.row.eigenvector &&
                                scope.row.eigenvector != 0
                                  ? scope.row.eigenvector + '万㎡'
                                  : '--'
                              }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="eigenvector"
                            label="居住人口"
                            v-if="peripheralTab == 1"
                            :key="'居住人口' + Math.random()"
                          >
                            <template slot-scope="scope">
                              {{
                                scope.row.eigenvector
                                  ? thousandFormat(scope.row.eigenvector)
                                  : 0
                              }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="eigenvector"
                            label="总建面"
                            v-if="peripheralTab == 2"
                            :key="'总建面' + Math.random()"
                          >
                            <template slot-scope="scope">
                              {{
                                scope.row.eigenvector &&
                                scope.row.eigenvector != '-' &&
                                scope.row.eigenvector != 0
                                  ? scope.row.eigenvector + '㎡'
                                  : '--'
                              }}
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="eigenvector"
                            label="距离"
                            v-if="peripheralTab == 3"
                            :key="'距离' + Math.random()"
                          >
                            <template slot-scope="scope">
                              {{
                                scope.row.eigenvector !== 'null'
                                  ? scope.row.eigenvector
                                  : '--'
                              }}
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-pagination
                          :current-page="peripheralPage.pageNo"
                          :page-size="peripheralPage.pageSize"
                          :pager-count="5"
                          layout="total, prev, pager, next"
                          :total="peripheralTotal"
                          @size-change="peripheralSizeChange"
                          @current-change="peripheralCurrentChange"
                          class="small peripheral"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="业态组成" name="fifth">
            <div v-if="activeName == 'fifth'">
              <div class="mapBox_0">
                <div style="flex: 1;">
                  <headline>业态分布</headline>
                  <PIE
                    :data="commercialGroup.businessDistributionPie"
                    labelPosition="outside"
                    :text="'总数\n' + commercialGroup.storeTotalNum"
                    @click="pieClick"
                  />
                </div>
                <div style="flex: 1;">
                  <headline>{{ commercialColumnText }}</headline>
                  <ColumnLine
                    :data="
                      commercialGroup.businessDistributionColumn[pieIndex]
                        .dataList
                    "
                    :xAxis="
                      commercialGroup.businessDistributionColumn[pieIndex].xaxis
                    "
                    :legendShow="false"
                    :yName="['单位：个']"
                  />
                </div>
              </div>
              <div class="selectBox">
                <span>店铺详情</span>
                <div class="childBox">
                  <div style="margin-right: 30px;">
                    业态类型：
                    <el-select
                      v-model="commercialForm.commercialType"
                      placeholder="请选择"
                      @change="getMarketBusiness"
                      clearable
                    >
                      <el-option
                        v-for="item in commercialGroup.commercialTypeList"
                        :key="'commercialType' + item.value"
                        :label="item.label"
                        :value="item.value || '全部'"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>
                    楼层：
                    <el-select
                      v-model="commercialForm.floor"
                      placeholder="请选择"
                      @change="getMarketBusiness"
                      clearable
                    >
                      <el-option
                        v-for="item in commercialGroup.floorList"
                        :key="'floor' + item.value"
                        :label="item.label"
                        :value="item.value || '全部'"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="tableBox">
                <el-table
                  ref="table"
                  :data="storeDetailTable"
                  style="width: 100%;"
                  border
                  stripe
                  :header-cell-style="{
                    background: '#eef5ff',
                    color: '#606266',
                    borderColor: '#d8e6fe',
                    fontSize: '12px',
                  }"
                  :cell-style="{ borderColor: '#d8e6fe' }"
                >
                  <el-table-column type="index" label="序号" width="50" />
                  <el-table-column
                    prop="storeName"
                    label="门店名称"
                    :show-overflow-tooltip="true"
                    align="left"
                  />
                  <el-table-column prop="floor" label="楼层" width="50" />
                  <el-table-column
                    prop="brand"
                    label="所属品牌"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    prop="firstType"
                    label="业态一级分类"
                    width="100"
                  />
                  <el-table-column
                    prop="secondType"
                    label="业态二级分类"
                    width="100"
                  />
                  <el-table-column
                    prop="affiliatedShop"
                    label="所属商场"
                    width="100"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.affiliatedShop || '--' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="capitaConsumer"
                    label="人均消费"
                    width="100"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.capitaConsumer || '--' }}
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  :current-page="commercialPage.pageNo"
                  :page-sizes="[10, 20, 30]"
                  :pager-count="5"
                  :page-size="commercialPage.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="commercialTotal"
                  @size-change="commercialSizeChange"
                  @current-change="commercialCurrentChange"
                />
              </div>
            </div>
            <el-empty v-else description="暂无数据" style="height: 100%;" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getShopDataById,
  getCustomerSourceCommunityData,
  getCustomerSourceOfficeData,
  getPeripheralDataByPage,
  marketAnalysisService,
  getMarketBusinessByPage,
} from '@/api/sceneApplication'
import AMap from '@/components/MapContainer/AMap'
import ColumnLine from '@/components/echarts/ColumnLine.vue'
import column from '@/components/echarts/column.vue'
import myLine from '@/components/echarts/Line.vue'
import PIE from '@/components/echarts/Pie.vue'
import Gauge from '@/components/echarts/Gauge.vue'
import { thousandFormat, AMapTransBMap, bMapTransAMap } from '@/utils/public'
import echartsData from '/public/testData/portrayalData.json'
import marketDetail from '/public/testData/marketDetail.json'
export default {
  components: {
    AMap,
    ColumnLine,
    column,
    myLine,
    PIE,
    Gauge,
  },
  filters: {
    peripheralEcharts(index) {
      let res = ''
      if (index == '0') res = '周边商场统计'
      else if (index == '1') res = '周边住宅情况'
      else if (index == '2') res = '周边写字楼详情'
      else if (index == '3') res = '交通配套分类统计'
      else if (index == '4') res = '周边学校统计'
      else if (index == '5') res = '周边医院统计'
      return res
    },
    peripheralTable(index) {
      let res = ''
      if (index == '0') res = '周边商场详情'
      else if (index == '1') res = '周边住宅详情'
      else if (index == '2') res = '周边写字楼详情'
      else if (index == '3') res = '交通配套详情'
      else if (index == '4') res = '周边学校详情'
      else if (index == '5') res = '周边医院详情'
      return res
    },
  },
  data() {
    return {
      data: this.$route.query,
      thousandFormat: thousandFormat,
      activeName: 'first', //tab
      source: '0', //客流来源--小区or写字楼
      up_down_url: [
        require('@/assets/images/slices/up.svg'),
        require('@/assets/images/slices/down.svg'),
      ],
      home_url: [
        require('@/assets/images/slices/marry_1.png'),
        require('@/assets/images/slices/child_4.png'),
      ],
      //客流来源表单
      customerSourceForm: {
        marketName: '', //搜索商场
        sort: 'contributionRate',
        asc: false,
      },
      //业态组成表单
      commercialForm: {
        commercialType: '全部', //业态类型
        floor: '全部', //楼层
      },
      iconClass: ['el-icon-date', 'el-icon-suitcase', 'el-icon-hot-water'], //icon图标
      basicData: {}, //顶部信息数据
      customerData: {}, //客流信息数据
      customerSource: [], //客流来源数据
      customerPortrayal: {}, //客流画像数据
      //周边配套数据
      peripheralData: {
        SurroundingShopStatistics: {}, //柱形图数据
        detailTable: [], //表格数据
      },
      commercialGroup: {}, //业态组成echart数据
      storeDetailTable: [], //业态组成表格数据
      businesses: [], //商场列表
      marketList: [], //商场列表
      peripheralShow: false, //周边配套弹窗显示
      peripheralTab: '0', //周边配套tabindex
      //周边配套tab
      peripheralTabList: [
        {
          label: 0,
          name: '商场',
        },
        {
          label: 1,
          name: '小区',
        },
        {
          label: 2,
          name: '写字楼',
        },
        {
          label: 3,
          name: '交通',
        },
        {
          label: 4,
          name: '学校',
        },
        {
          label: 5,
          name: '医院',
        },
      ],
      distanceList: [
        {
          value: '1',
          label: '周边3KM',
        },
        {
          value: '2',
          label: '周边5KM',
        },
        {
          value: '3',
          label: '步行15MIN',
        },
        {
          value: '4',
          label: '车行15MIN',
        },
        {
          value: '5',
          label: '车行30MIN',
        },
      ],
      peripheralDistance: '1', //周边配套--周边距离下拉框
      pieIndex: null, //业态组成--pie图index
      commercialColumnText: '', //业态组成--colunmtext
      //客流来源分页
      customerSourcePage: {
        pageNo: 1,
        pageSize: 10,
      },
      customerSourceTotal: 0,
      //周边配套表格分页
      peripheralPage: {
        pageNo: 1,
        pageSize: 10,
      },
      peripheralTotal: 0,
      //业态组成表格分页
      commercialPage: {
        pageNo: 1,
        pageSize: 10,
      },
      commercialTotal: 0,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getShopDataById(this.data.name).then((res) => {
        if (res.code == 200) {
          if (!this.data.shopId) this.data.shopId = res.data.shopId
          console.log(this.data, '传送的数据')
          this.basicData = res.data
          /*********客流信息数据*********/
          // this.customerData = marketDetail.customerData
          this.customerData = res.data.customerDataVO
          //添加icon图标
          if (this.customerData.data?.length > 0) {
            this.customerData.data?.forEach((e, i) => {
              e['class'] = this.iconClass[i]
            })
          }

          /*********客流画像数据*********/
          // this.customerPortrayal = marketDetail.customerPortrayal
          //性别分布数据处理
          res.data.customerPortrayal.residentPopulation.genderDistribution.forEach(
            (e) => {
              e.value = (Number(e.value) * 100).toFixed(2)
            },
          )
          res.data.customerPortrayal.workPopulation.genderDistribution.forEach(
            (e) => {
              e.value = (Number(e.value) * 100).toFixed(2)
            },
          )
          //年龄分布数据处理
          res.data.customerPortrayal.residentPopulation.ageDistribution.dataList.forEach(
            (e) => {
              if (e.cdata) {
                for (let i = 0; i < e.cdata.length; i++) {
                  e.cdata[i] = (Number(e.cdata[i]) * 100).toFixed(2)
                }
              }
            },
          )
          res.data.customerPortrayal.workPopulation.ageDistribution.dataList.forEach(
            (e) => {
              if (e.cdata) {
                for (let i = 0; i < e.cdata.length; i++) {
                  e.cdata[i] = (Number(e.cdata[i]) * 100).toFixed(2)
                }
              }
            },
          )
          //收入水平数据处理
          res.data.customerPortrayal.residentPopulation.incomeLevel.dataList.forEach(
            (e) => {
              if (e.cdata) {
                for (let i = 0; i < e.cdata.length; i++) {
                  e.cdata[i] = (Number(e.cdata[i]) * 100).toFixed(2)
                }
              }
            },
          )
          res.data.customerPortrayal.workPopulation.incomeLevel.dataList.forEach(
            (e) => {
              if (e.cdata) {
                for (let i = 0; i < e.cdata.length; i++) {
                  e.cdata[i] = (Number(e.cdata[i]) * 100).toFixed(2)
                }
              }
            },
          )
          //学历水平数据处理
          res.data.customerPortrayal.residentPopulation.educationalLevel.dataList.forEach(
            (e) => {
              if (e.cdata) {
                for (let i = 0; i < e.cdata.length; i++) {
                  e.cdata[i] = (Number(e.cdata[i]) * 100).toFixed(2)
                }
              }
            },
          )
          res.data.customerPortrayal.workPopulation.educationalLevel.dataList.forEach(
            (e) => {
              if (e.cdata) {
                for (let i = 0; i < e.cdata.length; i++) {
                  e.cdata[i] = (Number(e.cdata[i]) * 100).toFixed(2)
                }
              }
            },
          )
          this.customerPortrayal = res.data.customerPortrayal
          //调完接口返回shopId再开始调业态组成数据
          /*********业态组成数据*********/
          this.getMarketAnalysisServiceData()
          this.getMarketBusiness()
        }
      })
    },
    //获取客流来源信息
    async getCustomerSourceData() {
      this.customerSource = []
      // this.customerSource = marketDetail.customerSource
      let params = {
        asc: this.customerSourceForm.asc, //false:降序 true:升序
        name: this.customerSourceForm.marketName,
        orders: [
          {
            asc: true,
            column: '',
          },
        ],
        pageNum: this.customerSourcePage.pageNo,
        pageSize: this.customerSourcePage.pageSize,
        searchCount: true,
        shopId: this.data.shopId,
        sort: this.customerSourceForm.sort, //排序的字段
      }
      console.log(params, '客流来源参数')
      let res = null
      if (this.source === '0') {
        res = await getCustomerSourceCommunityData(params)
      } else {
        res = await getCustomerSourceOfficeData(params)
      }
      if (res.code == 200) {
        this.customerSource = res.data.list
        this.customerSourceTotal = res.data.total
        // let pois = []
        // this.customerSource.forEach((e) => {
        //   if (e.geoCenter !== null) {
        //     pois.push({
        //       name: e.houseName,
        //       location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
        //     })
        //   }
        // })
        // this.$nextTick(function () {
        //   this.$refs.child.addMarker({
        //     poi: pois,
        //   })
        // })
      }
    },
    addPoi() {
      const that = this
      let pois = []
      that.customerSource.forEach((e) => {
        if (e.geoCenter !== null) {
          pois.push({
            name: e.houseName,
            location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
          })
        }
      })
      this.$nextTick(function () {
        this.$refs.child.addMarker({
          poi: pois,
        })
      })
    },
    getCustomerSource() {
      const that = this
      this.getCustomerSourceData()
      setTimeout(function () {
        that.addPoi()
      }, 1000)
    },
    //获取周边配套数据
    async getPeripheralData() {
      this.peripheralData.detailTable = []
      // this.peripheralData =
      //   marketDetail.peripheralData[Number(this.peripheralTab)]
      let params = {
        dimension: this.peripheralDistance,
        orders: [
          {
            asc: true,
            column: '',
          },
        ],
        pageNum: this.peripheralPage.pageNo,
        pageSize: this.peripheralPage.pageSize,
        searchCount: true,
        shopId: this.data.shopId,
        type: this.peripheralTabList[Number(this.peripheralTab)].name,
      }
      let res = await getPeripheralDataByPage(params)
      if (res.code == 200) {
        this.peripheralTotal = res.data.total
        this.peripheralData.detailTable = res.data.list
        let pois = []
        this.peripheralData.detailTable.forEach((e) => {
          if (e.geoCenter || e.geoCenter != null) {
            if (e.geoCenter.lng != '') {
              pois.push({
                name: e.name,
                location: bMapTransAMap([e.geoCenter.lng, e.geoCenter.lat]),
              })
            }
          }
        })
        let circleRadius = null
        switch (this.peripheralDistance) {
          case '1':
            circleRadius = 3000
            break
          case '2':
            circleRadius = 5000
            break
          case '3':
            circleRadius = 1000
            break
          case '4':
            circleRadius = 3000
            break
          case '5':
            circleRadius = 8600
            break
        }
        let mapParams = {
          poi: pois,
          circleData: {
            circleLocation: this.data.location,
            circleRadius: circleRadius,
            name: this.data.name,
          },
          url:
            this.peripheralTab == '0'
              ? require('@/assets/images/slices/map_shop.png')
              : this.peripheralTab == '1'
              ? require('@/assets/images/slices/map_house.png')
              : this.peripheralTab == '2'
              ? require('@/assets/images/slices/map_firm.png')
              : this.peripheralTab == '3'
              ? require('@/assets/images/slices/map_car.png')
              : this.peripheralTab == '4'
              ? require('@/assets/images/slices/map_school.png')
              : require('@/assets/images/slices/map_hospital.png'),
          color:
            this.peripheralTab == '0'
              ? 'red'
              : this.peripheralTab == '1'
              ? 'org'
              : this.peripheralTab == '2'
              ? 'org'
              : this.peripheralTab == '3'
              ? 'blue'
              : this.peripheralTab == '4'
              ? 'blue'
              : 'red',
          zoom: this.peripheralTab == '3' ? 3 : 0,
        }
        console.log(mapParams, 'mapParams')
        this.$nextTick(function () {
          this.$refs.fourthAmap.addMarker(mapParams)
        })
      } else {
        this.peripheralTotal = 0
      }
    },
    //获取业态组合--pie和column数据
    async getMarketAnalysisServiceData() {
      let res = await marketAnalysisService(this.data.shopId)
      if (res.code == 200) {
        // this.commercialGroup = marketDetail.commercialGroup
        //饼状图数据处理
        res.data.businessDistributionPie.forEach((e) => {
          e.value = (Number(e.value) * 100).toFixed(2)
        })
        //提取出value数组
        const arr = res.data.businessDistributionPie
          .map((item, index) => ({
            ...item,
            index,
          }))
          .map(({ value }) => value)
        //获取最大值下标
        const maxIndex = arr.findIndex((e) => e == Math.max(...arr))
        this.pieIndex = maxIndex
        this.commercialColumnText =
          res.data.businessDistributionPie[maxIndex].name
        //下拉框数据--把“全部”调换到开头
        res.data.commercialTypeList.map((item, index) => {
          if (index == res.data.commercialTypeList.length - 1) {
            res.data.commercialTypeList.unshift(
              res.data.commercialTypeList.splice(index, 1)[0],
            )
          }
        })
        res.data.floorList.map((item, index) => {
          if (index == res.data.floorList.length - 1) {
            res.data.floorList.unshift(res.data.floorList.splice(index, 1)[0])
          }
        })
        this.commercialGroup = res.data
      }
    },
    //获取业态组合--表格数据
    async getMarketBusiness() {
      let params = {
        firstType:
          this.commercialForm.commercialType == '全部'
            ? ''
            : this.commercialForm.commercialType,
        floor:
          this.commercialForm.floor == '全部' ? '' : this.commercialForm.floor,
        orders: [
          {
            asc: true,
            column: '',
          },
        ],
        pageNum: this.commercialPage.pageNo,
        pageSize: this.commercialPage.pageSize,
        searchCount: true,
        shopId: this.data.shopId,
      }
      let res = await getMarketBusinessByPage(params)
      if (res.code == 200) {
        // this.commercialGroup.storeDetailTable = res.data.list
        this.storeDetailTable = res.data.list
        this.commercialTotal = res.data.total
      }
    },
    //大tab切换
    tabClick() {
      switch (this.activeName) {
        case 'second':
          /*********客流来源*********/
          if (this.customerSource.length == 0) {
            // this.getCustomerSourceData()
            this.getCustomerSource()
          }
          break
        case 'fourth':
          /*********周边配套*********/
          if (this.peripheralData.detailTable.length == 0) {
            this.getPeripheralData()
          }
          break
      }
    },
    //单选组--居住客流、工作客流切换
    radioChang(val) {
      this.customerSourceForm.sort = 'contributionRate'
      this.customerSourceForm.asc = false
      this.customerSourceForm.marketName = ''
      // this.getCustomerSourceData()
      this.getCustomerSource()
    },
    //排序方法
    sortClick(property, type) {
      //type：true 升序  false 降序
      //再一次点击清除排序效果
      if (
        this.customerSourceForm.asc == type &&
        this.customerSourceForm.sort == property
      ) {
        this.customerSourceForm.sort = ''
      } else {
        if (type) {
          this.customerSourceForm.asc = true
        } else {
          this.customerSourceForm.asc = false
        }
        this.customerSourceForm.sort = property
      }
      this.getCustomerSourceData()
    },
    //周边配套tab切换
    peripheralTabChange(val) {
      this.peripheralPage.pageNo = 1
      this.getPeripheralData()
    },
    //距离下拉框选择事件
    peripheralDistanceChange() {
      this.peripheralPage.pageNo = 1
      this.getPeripheralData()
    },
    //pie图点击事件
    pieClick(val) {
      this.pieIndex = val.id
      this.commercialColumnText = this.commercialGroup.businessDistributionPie[
        val.id
      ].name
    },
    //客流来源翻页
    sourceCurrentChange(val) {
      this.customerSourcePage.pageNo = val
      // this.getCustomerSourceData()
      this.getCustomerSource()
    },
    //周边配套表格翻页
    peripheralSizeChange(val) {
      this.peripheralPage.pageSize = val
      this.getPeripheralData()
    },
    peripheralCurrentChange(val) {
      this.peripheralPage.pageNo = val
      this.getPeripheralData()
    },
    //业态组成表格翻页
    commercialSizeChange(val) {
      this.commercialPage.pageSize = val
      this.getMarketBusiness()
    },
    commercialCurrentChange(val) {
      this.commercialPage.pageNo = val
      this.getMarketBusiness()
    },
  },
}
</script>
<style src="@/assets/css/marketDetail.css" scoped></style>
<style lang="scss" scoped>
//排序按钮
.sortIcon {
  cursor: pointer;
  margin: -1.5px 3px;
  font-size: 14px;
}
//点击取消
.sortIcon-cancel {
  color: #c0c4cc;
}
//点击
.sortIcon-focus {
  color: #409eff;
}
.fourth_box {
  position: relative;
  .btn {
    z-index: 999;
    position: absolute;
    right: 10px;
    top: 0px;
    padding: 5px;
    border-radius: 5px;
    font-size: 25px;
    color: #fff;
    background-color: #accef0;
  }
  //内容窗
  .contentBox {
    max-height: 420px;
    width: 350px;
    background: #fff;
    padding: 10px;
    overflow-y: auto;
  }
  .contentBox_data {
    margin-top: -20px;
  }
  .transition {
    z-index: 99;
    position: absolute;
    right: 10px;
    top: 50px !important;
    // border: solid 1.2px #fefefe;
    box-shadow: 0px 0px 4px 0px rgba(185, 214, 255, 0.18);
  }
  .echartsBox {
    border: solid 1.2px #66b1ff;
    border-radius: 3px;
    margin: 10px 0;
  }
}
//transition动画弹窗
.outer {
  transition: 0.5s;
  //tab窗
  .tabBox {
    margin: 50px 0;
    .radioDiv {
      margin: 0 auto;
      width: auto;
      text-align: left;
      display: table;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      opacity: 0.8;
    }
    ::v-deep .el-radio-button:first-child:last-child .el-radio-button__inner {
      border-radius: 5px 0 0 5px;
    }
  }
}
::v-deep .outer .tabBox .el-radio-button__inner {
  width: 70px;
}
.nested-enter-from,
.nested-leave-to {
  transform: translateX(150px);
  opacity: 0;
}
::v-deep .small .el-pager li {
  min-width: 25.5px;
}
::v-deep .peripheral.el-pagination {
  margin-top: 5px;
  margin-bottom: 0px;
}
::v-deep .tabs .el-tabs__item {
  font-size: 14px;
  font-weight: 600;
}
</style>
