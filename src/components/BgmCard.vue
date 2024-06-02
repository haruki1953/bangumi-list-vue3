<script setup lang="ts">
import { alistConfig, bangumiIcon, bgmError, bgmPlaceholder } from '@/config'
import type { BgmData } from '@/types/bangumi'
import { computed, ref } from 'vue'
import { Star, Film } from '@element-plus/icons-vue'

const props = defineProps<{
  data: BgmData
}>()

// 根据评分控制颜色
const badgeClass = computed(() => {
  const score = parseFloat(props.data.score)
  if (isNaN(score)) {
    return '' // 解析失败，不显示评分
  } else if (score >= 7.5) {
    return 'excellent'
  } else if (score >= 7) {
    return 'good'
  } else if (score >= 6.5) {
    return 'fair'
  } else if (score >= 6) {
    return 'poor'
  } else {
    return 'terrible'
  }
})

const isShowPopupBox = ref(false)

// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}
const openAlist = (url: string) => {
  openLink(alistConfig.baseUrl + url)
}

const devMessage = () => {
  ElMessage.warning('绝赞开发中')
}
</script>
<template>
  <div class="bgm-card" @click="isShowPopupBox = !isShowPopupBox">
    <el-badge
      :value="data.score"
      :offset="[-25, 15]"
      :class="badgeClass"
      :hidden="!badgeClass"
    >
      <div class="img-box" :class="{ shadow: isShowPopupBox }">
        <el-image
          class="bgm-img"
          lazy
          :src="data.img"
          :alt="data.chineseName || data.name"
        >
          <template #placeholder>
            <div class="img-placeholder"></div>
          </template>
          <template #error>
            <el-image class="bgm-img" :src="bgmPlaceholder">
              <template #error>
                <div class="img-placeholder"></div>
              </template>
            </el-image>
          </template>
        </el-image>
        <div class="popup-box" :class="{ show: isShowPopupBox }">
          <div class="bgm-title">
            {{ data.chineseName || data.name }}
          </div>
          <div class="bgm-content">
            <div class="bgm-info">
              <span class="bold">放送开始：</span>
              <span>{{ data.date }}</span>
            </div>
            <div class="bgm-info">
              <span class="bold">放送星期：</span>
              <span>{{ data.weekday }}</span>
            </div>
            <div class="bgm-info">
              <span class="bold">话数：</span>
              <span>{{ data.episode }}</span>
            </div>
            <div class="bgm-info">
              <span class="bold">评分：</span>
              <span>{{ data.score }}</span>
            </div>
          </div>
          <div class="bgm-buttons">
            <div class="btn-box">
              <el-button
                type="primary"
                :icon="Film"
                round
                class="watch"
                @click="openAlist(data.alistPath)"
              />
              <el-button
                type="warning"
                :icon="Star"
                circle
                @click="devMessage"
              />
              <el-button
                type="danger"
                circle
                class="bangumi"
                @click="openLink(data.bgmUrl)"
              >
                <el-image :src="bangumiIcon"></el-image>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-badge>
  </div>
</template>

<style lang="scss" scoped>
.bgm-card {
  margin-bottom: 20px;
  // position: relative;
  // overflow: hidden;
  :deep() {
    .excellent.el-badge .el-badge__content {
      background-color: var(--el-color-warning);
    }
    .good.el-badge .el-badge__content {
      background-color: var(--el-color-success);
    }
    .fair.el-badge .el-badge__content {
      background-color: var(--el-color-primary);
    }
    .poor.el-badge .el-badge__content {
      background-color: var(--el-color-danger);
    }
    .terrible.el-badge .el-badge__content {
      background-color: var(--el-color-info);
    }
  }
}
.el-badge {
  width: 100%;
}
.bgm-img {
  display: block;
  width: 100%;
  border-radius: 10px;
}
.img-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  aspect-ratio: 1 / 1.35;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.5s;
  &.shadow {
    box-shadow: var(--el-box-shadow);
  }
  &:hover {
    box-shadow: var(--el-box-shadow);
  }
}
.img-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1.35;
  background-color: var(--color-background-mute);
  transition: background-color 0.5s;
}

.popup-box {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);
  transform: translateY(100px);
  opacity: 0;
  // pointer-events: none; // 允许点击穿透
  pointer-events: visiblePainted; // 允许元素可见部分响应鼠标事件
  transition:
    opacity 0.5s,
    transform 0.5s,
    background-color 0.5s;
  z-index: 10;
  &.show {
    transform: translateY(0);
    opacity: 0.9;
    // pointer-events: auto;
  }
}

.bgm-title {
  max-width: 90%;
  margin: 0 auto;
  white-space: nowrap; /* 强制文本在同一行内显示 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  text-overflow: ellipsis; /* 使用省略号表示被剪切的文本 */
  font-size: 18px;
  font-weight: bold;
}
.bgm-content {
  width: 80%;
  margin: 0 auto;
  margin-top: 5px;
  font-size: 16px;
  .bgm-info {
    span {
      white-space: nowrap;
    }
    .bold {
      font-weight: bold;
    }
  }
}
.bgm-buttons {
  width: 70%;
  margin: 0 auto;
  margin-top: 10px;
  .el-button {
    margin: 2px 4px;
  }
  .btn-box {
    display: flex;
    .watch {
      flex: auto;
    }
  }
}

// 小屏时调整字体大小
@media (max-width: 500px) {
  .bgm-title {
    font-size: 14px;
  }
  .bgm-content {
    font-size: 12px;
  }
  .bgm-buttons {
    width: 90%;
    .el-button {
      margin: 2px 2px;
    }
  }
}
// 屏幕太小、不显示信息
@media (max-width: 400px) {
  .bgm-content {
    display: none;
  }
  .bgm-buttons .btn-box {
    flex-direction: column;
    align-items: center;
  }
}
</style>