import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useBangumiStore } from './bangumi'
import { getWeightedRandomElements } from '@/utils'

// 历史模块
export const useHistoryStore = defineStore(
  'bangumi-history',
  () => {
    // 保存记录的id
    const bgmIds = ref<string[]>([])

    const maxLength = ref(35)
    const limitLength = ref(true)

    const setLimit = (limit: boolean, length: number) => {
      limitLength.value = limit
      maxLength.value = length
      tryLimit()
    }

    const tryLimit = () => {
      if (!limitLength.value) {
        return
      }
      bgmIds.value = bgmIds.value.slice(0, maxLength.value)
    }

    // 要用到bangumiStore的数据
    const bangumiStore = useBangumiStore()

    // 计算属性根据id获取记录的番剧
    const bgmList = computed(() => {
      return bangumiStore.getBgmListByIds(bgmIds.value)
    })

    // 切换番剧记录与否
    const toggleBgm = (id: string) => {
      if (isBgm(id)) {
        delBgm(id)
      } else {
        addBgm(id)
      }
    }
    const addBgm = (id: string) => {
      delBgm(id)
      bgmIds.value.unshift(id)
      tryLimit()
    }
    const delBgm = (id: string) => {
      bgmIds.value = bgmIds.value.filter((i) => i !== id)
    }

    // 判断番剧是否记录
    const isBgm = (id: string) => {
      return bgmIds.value.find((bgmId) => bgmId === id)
    }

    // 清除记录
    const removeBgm = () => {
      bgmIds.value = []
    }

    // 获取猜你喜欢
    const getGuessLikeBgmList = (count?: number) => {
      // 从已收藏番剧中随机抽取3个，最近的概率更大
      const someFavBgm = bangumiStore.getBgmListByIds(
        getWeightedRandomElements(bgmIds.value, 3)
      )
      const bgmList = bangumiStore.getSimilarBgms({
        comparisonBgms: someFavBgm,
        excludeBgms: bgmIds.value,
        limitCount: count
      })
      return bgmList
    }

    return {
      bgmIds,
      bgmList,
      maxLength,
      limitLength,
      isBgm,
      toggleBgm,
      addBgm,
      getGuessLikeBgmList,
      removeBgm,
      setLimit
    }
  },
  {
    persist: true // 持久化
  }
)
