<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDark, useToggle, useScroll } from '@vueuse/core'
import { logoImage } from '@/config'
import {
  HomeFilled,
  Menu as IconMenu,
  InfoFilled,
  StarFilled,
  MoonNight,
  Sunrise,
  MoreFilled
} from '@element-plus/icons-vue'
import LinkGroup from './components/LinkGroup.vue'
import DecorationDot from './components/DecorationDot.vue'
import { webName } from '@/config'
import { useBangumiStore } from '@/stores'

const isDark = useDark({ disableTransition: false })
const toggleDark = useToggle(isDark)

const { arrivedState } = useScroll(document)

const devMessage = () => {
  ElMessage.warning('绝赞开发中')
}

const reload = () => {
  window.location.href = '/'
}

// 控制移动端菜单框显示
const showMenuBox = ref(false)
const showMenuBoxToggle = () => {
  showMenuBox.value = !showMenuBox.value
}

const bgmDataStore = useBangumiStore()
onMounted(async () => {
  // 初始化、请求数据
  await bgmDataStore.initData()
})
</script>
<template>
  <!-- 导航栏 -->
  <el-menu
    :default-active="$route.path"
    :class="{ 'menu-on-top': arrivedState.top }"
    mode="horizontal"
    :ellipsis="false"
    router
  >
    <!-- 边距垫片 -->
    <div class="shim"></div>

    <!-- logo 大屏小屏都显示 -->
    <el-menu-item @click="reload" :class="{ 'logo-dark': isDark }" class="logo">
      <img style="width: 36px" :src="logoImage" alt="logo" />
    </el-menu-item>

    <!-- 大屏显示的内容 lg -->
    <div class="menu-item decoration-item lg">
      <DecorationDot></DecorationDot>
    </div>
    <div class="flex-grow lg"></div>
    <el-menu-item class="lg" index="/">
      <el-icon><HomeFilled /></el-icon>
      <span>主页</span>
    </el-menu-item>
    <el-menu-item class="lg" index="/list">
      <el-icon><IconMenu /></el-icon>
      <span>全部番剧</span>
    </el-menu-item>
    <el-menu-item class="lg" @click="devMessage">
      <el-icon size="20"><StarFilled /></el-icon>
      <span>收藏</span>
    </el-menu-item>
    <el-menu-item class="lg" index="/about">
      <el-icon><InfoFilled /></el-icon>
      <span>关于</span>
    </el-menu-item>
    <div class="menu-item switch-item lg">
      <el-switch
        class="switch-dark"
        size="large"
        :modelValue="isDark"
        inline-prompt
        :active-icon="MoonNight"
        :inactive-icon="Sunrise"
        @click="toggleDark()"
      />
    </div>
    <div class="menu-item link-group lg">
      <LinkGroup></LinkGroup>
    </div>

    <!-- 小屏显示的内容 sm -->
    <div class="flex-grow sm"></div>
    <div class="menu-item decoration-item sm">
      <DecorationDot
        class="decoration-dot"
        :class="{ hidden: !arrivedState.top }"
      ></DecorationDot>
      <div class="decoration-text" :class="{ show: !arrivedState.top }">
        {{ $route.meta.title || webName }}
      </div>
    </div>
    <div class="flex-grow sm"></div>
    <el-menu-item @click="showMenuBoxToggle" class="sm">
      <el-icon
        size="36"
        style="width: 36px; margin-right: 0"
        class="more-icon"
        :class="{ action: showMenuBox }"
      >
        <MoreFilled />
      </el-icon>
    </el-menu-item>

    <!-- 边距垫片 -->
    <div class="shim"></div>
  </el-menu>

  <!-- 小平时顶部弹出的菜单抽屉 -->
  <div class="sm-menu">
    <el-drawer
      v-model="showMenuBox"
      direction="ttb"
      :show-close="false"
      :with-header="false"
      :lock-scroll="false"
      size="380"
      :z-index="29"
    >
      <div class="menu-box">
        <el-menu
          :default-active="$route.path"
          router
          @select="showMenuBox = false"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>主页</span>
          </el-menu-item>
          <el-menu-item index="/list">
            <el-icon><IconMenu /></el-icon>
            <span>全部番剧</span>
          </el-menu-item>
          <el-menu-item @click="devMessage">
            <el-icon size="20"><StarFilled /></el-icon>
            <span>收藏</span>
          </el-menu-item>
          <el-menu-item index="/about">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </el-menu-item>
        </el-menu>
        <div class="dark-link">
          <el-switch
            class="switch-dark"
            size="large"
            :modelValue="isDark"
            inline-prompt
            :active-icon="MoonNight"
            :inactive-icon="Sunrise"
            @click="toggleDark()"
          />
          <LinkGroup></LinkGroup>
        </div>
      </div>
    </el-drawer>
  </div>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
.page {
  height: 100vh;
}
.logo {
  position: relative;
  &::after {
    // 暗黑模式要用的图标蒙版
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0 0 16px 16px;
    background-color: var(--color-background);
    opacity: 0.1; /* 半透明 */
    pointer-events: none; /* 允许点击穿透蒙版 */
    z-index: 31;
    transition: transform 0.5s;
    // 隐藏
    transform: translateY(-60px);
  }
}
.logo-dark {
  &::after {
    // 移动出现
    transform: translateY(0);
  }
}

.el-menu {
  position: fixed;
  width: 100%;
  transition:
    background-color 0.5s,
    border-bottom-color 0.5s;
  background-color: var(--color-background);
  border-bottom-color: var(--color-border);
  z-index: 30;
  &.menu-on-top {
    background-color: transparent;
    border-bottom-color: transparent;
  }
  .el-menu-item {
    --el-menu-text-color: var(--color-text);
    span {
      font-weight: bold;
    }
  }
  .flex-grow {
    flex-grow: 1;
  }
  .menu-item {
    display: flex;
    align-items: center;
  }
  .between-item {
    margin: 0 18px;
  }
  .switch-item {
    margin: 18px 0;
    padding: 0 18px;
    border-left: 2px solid var(--color-border); /* 左边框 */
    border-right: 2px solid var(--color-border); /* 右边框 */
  }
  .link-group {
    margin: 0 10px;
  }
  .decoration-item {
    position: relative;
    margin: 0 10px;
    // overflow: hidden;
    .decoration-dot {
      transition: all 0.5s;
      &.hidden {
        transform: translateY(-60px);
      }
    }
    .decoration-text {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none; /* 允许点击穿透蒙版 */
      transform: translateY(60px);
      transition: all 0.5s;
      font-size: 18px;
      font-weight: bold;
      opacity: 0;
      &.show {
        transform: translateY(0);
        opacity: 10;
      }
    }
  }
}
.switch-dark {
  --el-switch-off-color: var(--el-color-primary);
  :deep() {
    .el-switch__action {
      background-color: var(--color-background);
    }
    .el-icon {
      font-size: 16px;
    }
  }
}

.more-icon {
  transition: all 0.5s;
  &.action {
    transform: rotate(90deg);
  }
}

.sm-menu {
  :deep() {
    .el-drawer__body {
      background-color: var(--color-background);
      transition: background-color 0.5s;
    }
  }
  .menu-box {
    width: 250px;
    margin: 0 auto;
    margin-top: 60px;
    .el-menu {
      position: static;
      border: none;
      border-radius: 20px;
      background-color: var(--color-background-soft);
      overflow: hidden;
    }
    .dark-link {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

// 响应式边距
$ref-padding-12: 120px;
$ref-padding-14: 200px;
$ref-padding-16: 300px;
$ref-padding-shim-12: 100px;
$ref-padding-shim-14: 150px;
$ref-padding-shim-16: 200px;
.container {
  padding: 80px 20px 20px 20px;
  margin: 0 auto;
  max-width: 1920px;
}
.shim {
  // display: none;
  width: 0;
}
@media (min-width: 1200px) {
  .container {
    padding: 80px $ref-padding-12 20px $ref-padding-12;
  }
  .shim {
    width: $ref-padding-shim-12;
  }
}
@media (min-width: 1400px) {
  .container {
    padding: 80px $ref-padding-14 20px $ref-padding-14;
  }
  .shim {
    width: $ref-padding-shim-14;
  }
}
@media (min-width: 1600px) {
  .container {
    padding: 80px $ref-padding-16 20px $ref-padding-16;
  }
  .shim {
    width: $ref-padding-shim-16;
  }
}
// 1920px将会以6列显示，所以将padding改小
@media (min-width: 1920px) {
  .container {
    padding: 80px 100px 20px 100px;
  }
}

.sm.sm {
  // 增加权重
  display: none;
}
@media (max-width: 900px) {
  .lg.lg {
    display: none;
  }
  .sm.sm {
    display: block;
  }
  .el-menu-item.sm,
  .decoration-item.sm {
    display: flex;
  }
}
</style>
