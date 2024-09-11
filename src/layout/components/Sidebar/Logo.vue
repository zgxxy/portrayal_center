<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/crowdControl"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/crowdControl"
      >
        <img
          v-if="logo"
          :src="logo"
          class="sidebar-logo"
          object-fit="contain"
        />
        <div class="sidebar-title-box">
          <div class="sidebar-title1">{{ '浩 海' }}</div>
          <div class="sidebar-title2">{{ '画 像 洞 察 中 心' }}</div>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: '画像洞察中心',
      // logo: require('../../../assets/images/lanyou.png'),
      logo: require('../../../assets/images/log.png'),
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #e9f2ff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    //logo--菜单展开时
    & .sidebar-logo {
      width: 35px;
      height: auto;
      vertical-align: middle;
      margin: 8px 8px 0 0;
    }

    & .sidebar-title-box {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      color: #8b8a8a;
      & .sidebar-title1 {
        margin: 0;
        font-weight: 600;
        line-height: 20px;
        font-size: 14px;
        font-family: YouYuan;
        // margin-bottom: 3px;
      }
      & .sidebar-title2 {
        margin: 0;
        line-height: 15px;
        font-size: 10px;
        -webkit-transform: scale(0.8);
        margin-left: -8px;
        font-family: Source Han Serif SC, Avenir, Helvetica Neue, Arial,
          Helvetica, sans-serif;
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
