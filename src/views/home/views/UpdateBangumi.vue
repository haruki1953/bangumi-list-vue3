<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { computed } from 'vue'
import { Film, VideoPlay, Download } from '@element-plus/icons-vue'
import { formatTimeAgoChs, formatFileSize } from '@/utils'
import {
  updateInfoToBgmWatchLink,
  updateInfoToBgmDownloadLink,
  updateInfoToBgmInfoLink,
  rssConfig
} from '@/config'

const bangumiStore = useBangumiStore()

const bgmList = computed(() => {
  return bangumiStore.updateBgmDataList
})

const updateList = computed(() => {
  return bangumiStore.bgmUpdateListLimited
})
</script>
<template>
  <div>
    <template v-if="bgmList.length">
      <BgmList
        :dataList="bgmList"
        couldSortNone
        sort="none"
        :sortNoneLable="['番剧', '更新']"
      ></BgmList>

      <el-divider content-position="left">
        <div class="divider-lable">
          <div class="text">更新记录</div>
          <a
            class="rss-link"
            target="_blank"
            rel="noopener noreferrer"
            :href="rssConfig.link"
          >
            <el-icon size="20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM96 136c0-13.3 10.7-24 24-24c137 0 248 111 248 248c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-110.5-89.5-200-200-200c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24c83.9 0 152 68.1 152 152c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-57.4-46.6-104-104-104c-13.3 0-24-10.7-24-24zm0 120a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"
                />
              </svg>
            </el-icon>
          </a>
        </div>
      </el-divider>

      <div class="update-list">
        <div
          class="update-item"
          v-for="item in updateList"
          :key="item.fileHash"
        >
          <el-row>
            <el-col :sm="14">
              <div class="update-name">{{ item.fileName }}</div>
            </el-col>
            <el-col :sm="10">
              <div class="update-info">
                <div class="content">
                  <div class="size">{{ formatFileSize(item.fileSize) }}</div>
                  <div class="date">{{ formatTimeAgoChs(item.fileDate) }}</div>
                </div>
                <div class="mask">
                  <div class="button-box">
                    <el-button
                      type="info"
                      :icon="Film"
                      circle
                      tag="a"
                      :href="updateInfoToBgmInfoLink(item)"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                    <el-button
                      type="primary"
                      :icon="VideoPlay"
                      circle
                      tag="a"
                      :href="updateInfoToBgmWatchLink(item)"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                    <el-button
                      type="success"
                      :icon="Download"
                      circle
                      tag="a"
                      :href="updateInfoToBgmDownloadLink(item)"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
    <BgmEmpty v-else description="暂无番剧"></BgmEmpty>
  </div>
</template>

<style lang="scss" scoped>
.update-item {
  margin-bottom: 10px;
  padding: 10px;
  background-color: var(--color-background-soft);
  border-radius: 15px;
  transition:
    background-color 0.5s,
    color 0.2s,
    transform 0.2s;
  &:hover {
    transform: scale(1.02, 1.02);
    background-color: var(--color-background-mute);
  }
}
$lineHeight: 35px;
.update-name {
  height: $lineHeight;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // text-align: center;
  line-height: $lineHeight;
}
.update-info {
  height: $lineHeight;
  padding: 0 10px;
  position: relative;
  .content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none; /* 禁用点击事件（点击穿透） */
    .button-box {
      pointer-events: auto; /* 重新启用按钮的点击事件 */
    }
  }
}

.el-divider {
  margin-bottom: 36px;
  transition: all 0.5s;
  --el-border-color: var(--color-border);
  .divider-lable {
    display: flex;
    align-items: center;
    .text {
      font-size: 20px;
      font-weight: bold;
      background-color: var(--color-background);
      color: var(--color-text);
      transition:
        background-color 0.5s,
        color 0.2s;
    }
  }
  :deep() {
    .el-divider__text {
      background-color: var(--color-background);
      transition: all 0.5s;
    }
  }
}

.rss-link {
  display: flex;
  margin-left: 10px;
  text-decoration: none; /* 去除下划线 */
  color: var(--el-color-warning);
}
</style>
