<script setup lang="ts">
import { bangumiIcon, bgmError } from '@/config'
import type { BgmData } from '@/types/bangumi'
import { computed, ref } from 'vue'
import { Star, Film } from '@element-plus/icons-vue'
import { useFavoriteStore, useSettingStore } from '@/stores'

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
const classShowPopupBox = ref('')
let isPopuping = false // 防止用户短时间内多次点击
const togglePopupBox = async () => {
  if (isPopuping) return
  isPopuping = true
  isShowPopupBox.value = !isShowPopupBox.value
  classShowPopupBox.value = isShowPopupBox.value ? 'show' : 'hidden'

  // 等待动画播放完毕
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 如果 classShowPopupBox 为 hidden
  // 则需将其置空（PopupBox将dispaly:none性能优化）
  if (classShowPopupBox.value === 'hidden') {
    classShowPopupBox.value = ''
  }

  isPopuping = false
}

// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}
const openAlist = (url: string) => {
  openLink(url)
}

// 番剧收藏功能
const favoriteStore = useFavoriteStore()

// 番剧是否被收藏
const isFav = computed(() => {
  return favoriteStore.isFavBgm(props.data.id)
})

// 切换番剧收藏与否
const toggleFav = () => {
  if (isFav.value) {
    ElMessage({
      type: 'warning',
      offset: 66,
      message: '已取消收藏'
    })
  } else {
    ElMessage({
      type: 'success',
      offset: 66,
      message: '已收藏'
    })
  }
  favoriteStore.toggleFavBgm(props.data.id)
}

const settingStore = useSettingStore()
</script>
<template>
  <div class="bgm-card" @click="togglePopupBox">
    <el-badge
      :value="data.score"
      :offset="[-25, 15]"
      :class="badgeClass"
      :hidden="!badgeClass"
    >
      <div class="img-box" :class="{ shadow: isShowPopupBox }">
        <!-- 有了无限滚动后应该不需要lazy懒加载了 -->
        <el-image
          class="bgm-img"
          :src="data.img"
          :alt="data.chineseName || data.name"
        >
          <!-- <template #placeholder>
            <el-image class="bgm-img" :src="bgmPlaceholder"></el-image>
          </template> -->
          <template #error>
            <el-image class="bgm-img" :src="bgmError"></el-image>
          </template>
        </el-image>
        <div class="popup-box" :class="classShowPopupBox">
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
                :type="isFav ? 'success' : 'warning'"
                :icon="Star"
                circle
                @click="toggleFav"
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
    <div class="name-bar" v-if="settingStore.showBgmName">
      {{ data.chineseName || data.name }}
    </div>
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
  .bgm-img {
    :deep() {
      .el-image__inner.is-loading {
        display: none;
      }
      .el-image__wrapper,
      .el-image__error {
        position: static;
        width: 100%;
        aspect-ratio: 1 / 1.35;
        transition: background-color 0.5s;
      }
    }
  }
}

.popup-box {
  // 减小切换暗黑模式的负担，不用opacity: 0来隐藏，使用display: none，
  // 但这会使过渡失效，改用动画
  display: none;
  position: absolute;
  top: 0;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--color-background);
  transition: background-color 0.5s;
  z-index: 10;
  &.show {
    display: flex;
    animation: popupShow 0.5s;
    animation-fill-mode: forwards;
  }
  &.hidden {
    display: flex;
    animation: popupHidden 0.5s;
    animation-fill-mode: forwards;
  }
}
@keyframes popupShow {
  /* 开始状态 */
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  /* 结束状态 */
  100% {
    opacity: 0.9;
    transform: translateY(0);
  }
}
@keyframes popupHidden {
  /* 开始状态 */
  0% {
    opacity: 0.9;
    transform: translateY(0);
  }
  /* 结束状态 */
  100% {
    opacity: 0;
    transform: translateY(100px);
  }
}

.name-bar {
  margin: 4px 4px 0 4px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap; /* 强制文本在同一行内显示 */
  overflow: hidden; /* 隐藏超出容器的内容 */
  text-overflow: ellipsis; /* 使用省略号表示被剪切的文本 */
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
  .name-bar {
    font-size: 14px;
  }
}
// 屏幕太小、不显示信息
@media (max-width: 400px) {
  .bgm-content,
  .bgm-title {
    display: none;
  }
  .bgm-buttons .btn-box {
    flex-direction: column;
    align-items: center;
  }
}
</style>
