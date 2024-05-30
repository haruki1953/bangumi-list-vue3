<script setup lang="ts">
import { useDark, useToggle, useScroll } from '@vueuse/core'
import { logoImage } from '@/config'
import {
  HomeFilled,
  Menu as IconMenu,
  InfoFilled,
  StarFilled,
  MoonNight,
  Sunrise
} from '@element-plus/icons-vue'
import LinkGroup from './components/LinkGroup.vue'
import DecorationDot from './components/DecorationDot.vue'

const isDark = useDark({ disableTransition: false })
const toggleDark = useToggle(isDark)

const { arrivedState } = useScroll(document)

const devMessage = () => {
  ElMessage.warning('绝赞开发中')
}

const reload = () => {
  window.location.reload()
}
</script>
<template>
  <el-menu
    :default-active="$route.path"
    :class="{ 'menu-on-top': arrivedState.top }"
    mode="horizontal"
    :ellipsis="false"
    router
  >
    <div class="shim"></div>
    <el-menu-item @click="reload" :class="{ 'logo-dark': isDark }" class="logo">
      <img style="width: 36px" :src="logoImage" alt="logo" />
    </el-menu-item>
    <div class="menu-item decoration">
      <DecorationDot></DecorationDot>
    </div>
    <div class="flex-grow"></div>
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
    <div class="menu-item switch-item">
      <el-switch
        size="large"
        :modelValue="isDark"
        inline-prompt
        :active-icon="MoonNight"
        :inactive-icon="Sunrise"
        @click="toggleDark()"
      />
    </div>
    <div class="menu-item link-group">
      <LinkGroup></LinkGroup>
    </div>
    <div class="shim"></div>
  </el-menu>
  <div style="height: 60px"></div>
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
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-background);
    opacity: 0; /* 透明 */
    pointer-events: none; /* 允许点击穿透蒙版 */
    z-index: 31;
  }
}
.logo-dark {
  &::after {
    opacity: 0.1; /* 半透明 */
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
  .el-menu-item {
    --el-menu-text-color: var(--color-text);
    span {
      font-weight: bold;
    }
  }
  .flex-grow {
    flex-grow: 1;
  }
  .el-switch {
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
  .menu-item {
    display: flex;
    align-items: center;
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
  .decoration {
    margin: 10px;
  }
}
.menu-on-top {
  background-color: transparent;
  border-bottom-color: transparent;
}

$ref-margin: 80px;
.container {
  margin-left: $ref-margin;
  margin-right: $ref-margin;
}
.shim {
  width: $ref-margin;
}
@media (max-width: 1200px) {
  .container {
    margin-left: 10px;
    margin-right: 10px;
  }
  .shim {
    display: none;
  }
}
</style>
