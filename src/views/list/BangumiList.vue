<script setup lang="ts">
import { useBangumiStore } from '@/stores'
import { Search } from '@element-plus/icons-vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type BgmList from '@/components/BgmList.vue'
import { useRoute, useRouter } from 'vue-router'
import { specCharsHandler } from '@/utils'

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

const route = useRoute()
const router = useRouter()

// 处理搜索
const handleSearch = () => {
  searchKey.value = searchVal.value
  // 重置显示数量
  refBgmList.value?.resetShowNum()
  // 搜索时设置route
  if (searchKey.value !== '') {
    router.replace({
      name: 'list',
      query: { search: searchKey.value }
    })
  } else {
    router.replace({
      name: 'list'
    })
  }
}

// showAll 显示全部用户
const showAll = () => {
  searchVal.value = ''
  handleSearch()
}

// 可通过路由参数搜索
onMounted(() => {
  const routeSearchVal = (() => {
    if (route.query.search == null) {
      return null
    }
    if (typeof route.query.search === 'string') {
      return route.query.search
    } else {
      return route.query.search[0]
    }
  })()
  if (routeSearchVal != null) {
    // 处理特殊字符以免造成影响
    searchVal.value = specCharsHandler(routeSearchVal)
    handleSearch()
  }
})

// 闪烁的未找到番剧提示
const strings = ['【未找到番剧】', '【点击显示全部】']
const currentString = ref(strings[0])
let index = 0
let intervalId: number | undefined = undefined
onMounted(() => {
  intervalId = setInterval(() => {
    index = (index + 1) % strings.length
    currentString.value = strings[index]
  }, 2000)
})
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>
<template>
  <div>
    <div class="search-bar">
      <el-input
        v-model="searchVal"
        placeholder="搜索番剧，支持bangumiID、标签"
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
    <BgmList
      v-if="dataList.length !== 0"
      :dataList="dataList"
      ref="refBgmList"
    ></BgmList>
    <BgmEmpty v-show="dataList.length === 0" @click="showAll">
      <Transition name="fade10" mode="out-in">
        <div class="empty-text" :key="currentString">{{ currentString }}</div>
      </Transition>
    </BgmEmpty>
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

.bgm-empty {
  cursor: pointer;
}
</style>
