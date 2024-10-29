<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { computed } from 'vue'
import { VideoPlay, Download } from '@element-plus/icons-vue'
import { formatTimeAgoChs, formatFileSize } from '@/utils'
import { updateInfoToBgmWatchLink, updateInfoToBgmDownloadLink } from '@/config'

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
        <div class="guess-like-title">更新记录</div>
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
  .guess-like-title {
    font-size: 20px;
    font-weight: bold;
    background-color: var(--color-background);
    color: var(--color-text);
    transition:
      background-color 0.5s,
      color 0.2s;
  }
  :deep() {
    .el-divider__text {
      background-color: var(--color-background);
      transition: all 0.5s;
    }
  }
}
</style>
