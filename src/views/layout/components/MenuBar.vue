<script setup lang="ts">
import { nextTick, ref, type Component } from 'vue'
import { useDark, useToggle, useScroll } from '@vueuse/core'
import { logoImage } from '@/config'
import { MoonNight, Sunrise, MoreFilled } from '@element-plus/icons-vue'
import DecorationDot from './DecorationDot.vue'
import { webName } from '@/config'
import { useBangumiStore } from '@/stores'
import { computed } from 'vue'
import { watch } from 'vue'
import { useDrawerOptimization, generateRandomClassName } from '@/utils'
import router from '@/router'

defineProps<{
  menu: {
    index: string
    title: string
    icon: Component
    size?: number
  }[]
}>()

const bangumiStore = useBangumiStore()

const isDark = useDark({ disableTransition: false })
const toggleDark = useToggle(isDark)

const { arrivedState } = useScroll(document)

const reload = () => {
  window.location.href = '/'
}

// 控制移动端菜单框显示
const showMenuBox = ref(false)
const showMenuBoxToggle = () => {
  showMenuBox.value = !showMenuBox.value
}
// 优化
const overlayClass = generateRandomClassName()
useDrawerOptimization({
  drawerVisible: showMenuBox,
  overlayClass
})
// 为防止在抽屉跳转路由后又被返回，故先返回
const menuDrawerSelect = async (index: string) => {
  console.log(index)
  window.history.back()
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 10))
  router.push(index)
}

const shouldDecorationDotHidden = computed(() => {
  const isShould = !arrivedState.top && !bangumiStore.isLoadingData
  return isShould
})
const limitedSDDH = ref(false)
const isUpdateing = ref(false)

watch(
  shouldDecorationDotHidden,
  async () => {
    if (isUpdateing.value) return
    isUpdateing.value = true
    limitedSDDH.value = shouldDecorationDotHidden.value
    if (bangumiStore.isLoadingData) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } else {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    limitedSDDH.value = shouldDecorationDotHidden.value
    isUpdateing.value = false
  },
  { immediate: true }
)
</script>
<template>
  <div class="menu-bar">
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
      <el-menu-item
        @click="reload"
        :class="{ 'logo-dark': isDark }"
        class="logo"
      >
        <img style="width: 36px" :src="logoImage" alt="logo" />
      </el-menu-item>

      <!-- 大屏显示的内容 lg -->
      <div class="menu-item decoration-item lg">
        <DecorationDot></DecorationDot>
      </div>
      <div class="flex-grow lg"></div>
      <el-menu-item
        class="lg"
        v-for="item in menu"
        :key="item.index"
        :index="item.index"
      >
        <el-icon :size="item.size">
          <component :is="item.icon"></component>
        </el-icon>
        <span>{{ item.title }}</span>
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
          :class="{ hidden: limitedSDDH }"
        ></DecorationDot>
        <div class="decoration-text" :class="{ show: limitedSDDH }">
          {{ $route.meta.title || webName }}
        </div>
      </div>
      <div class="flex-grow sm"></div>
      <div class="sm more-menu-item" @click="showMenuBoxToggle">
        <div class="more-box">
          <el-icon
            size="36"
            style="width: 36px; margin-right: 0"
            class="more-icon"
            :class="{ action: showMenuBox }"
          >
            <MoreFilled />
          </el-icon>
        </div>
      </div>

      <!-- 边距垫片 -->
      <div class="shim"></div>
    </el-menu>

    <!-- 小屏时顶部弹出的菜单抽屉 -->
    <div class="sm-menu">
      <el-drawer
        v-model="showMenuBox"
        direction="ttb"
        :show-close="false"
        :with-header="false"
        :lock-scroll="false"
        :size="menu.length * 56 + 156"
        :z-index="29"
        :modal-class="overlayClass"
      >
        <div class="menu-box">
          <el-menu :default-active="$route.path" @select="menuDrawerSelect">
            <el-menu-item
              v-for="item in menu"
              :key="item.index"
              :index="item.index"
            >
              <el-icon :size="item.size">
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
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
  </div>
</template>

<style lang="scss" scoped>
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
  user-select: none;
  &.menu-on-top {
    background-color: transparent;
    border-bottom-color: transparent;
  }
  .el-menu-item {
    --el-menu-text-color: var(--color-text);
    user-select: none;
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

.more-menu-item {
  height: 100%;
}
.more-box {
  height: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
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
$ref-padding-top: 60px;
.shim {
  // display: none;
  width: 0;
}
@media (min-width: 1200px) {
  .shim {
    width: $ref-padding-shim-12;
  }
}
@media (min-width: 1400px) {
  .shim {
    width: $ref-padding-shim-14;
  }
}
@media (min-width: 1600px) {
  .shim {
    width: $ref-padding-shim-16;
  }
}

.sm.sm {
  // 增加权重
  display: none;
}
@media (max-width: 1000px) {
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
