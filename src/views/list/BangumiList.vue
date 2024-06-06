<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { Search } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import type BgmList from '@/components/BgmList.vue'
import { bgmPlaceholder } from '@/config'

const bangumiStore = useBangumiStore()

// 搜索值 用于绑定
const searchVal = ref('')

// 搜索键 用于生成显示的数据
const searchKey = ref('')

// 要显示的数据
const dataList = computed(() => {
  return bangumiStore.searchBgm(searchKey.value)
})

// BgmList组件引用
const refBgmList = ref<InstanceType<typeof BgmList> | null>(null)

// 处理搜索
const handleSearch = () => {
  searchKey.value = searchVal.value
  // 重置显示数量
  refBgmList.value?.resetShowNum()
}

// showAll 显示全部用户
const showAll = () => {
  searchVal.value = ''
  handleSearch()
}
</script>
<template>
  <div>
    <div class="search-bar">
      <el-input
        v-model="searchVal"
        placeholder="搜索番剧，支持bangumiID、日期"
        clearable
        :prefix-icon="Search"
        size="large"
        @change="handleSearch"
        @clear="showAll"
      />
      <el-button
        type="primary"
        size="large"
        :icon="Search"
        circle
        @click="handleSearch"
      />
    </div>
    <BgmList :dataList="dataList" ref="refBgmList"></BgmList>
    <el-empty v-if="!dataList.length" description="未找到番剧">
      <template #image>
        <el-image class="bgm-img" :src="bgmPlaceholder"></el-image>
      </template>
      <el-button type="primary" @click="showAll">显示全部</el-button>
    </el-empty>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  margin: 20px auto 30px;
  max-width: 600px;
  .el-button {
    margin-left: 10px;
  }
  .el-input {
    :deep() {
      .el-input__wrapper {
        border-radius: 20px;
        background-color: var(--color-background-soft);
        transition: all 0.5s;
        box-shadow: none;
        &:hover {
          box-shadow: none;
        }
        .el-input__inner {
          // color: var(--color-text);
          font-weight: bold;
        }
      }
    }
  }
}
.bgm-img {
  border-radius: 10px;
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
</style>
