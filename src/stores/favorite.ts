import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useBangumiStore } from './bangumi'
import { getRandomElements } from '@/utils'

// 收藏模块
export const useFavoriteStore = defineStore(
  'bangumi-favorite',
  () => {
    // 保存收藏的id
    const favBgmIds = ref<string[]>([])

    const maxLength = ref(11)
    const limitLength = ref(true)

    const tryLimit = () => {
      if (!limitLength.value) {
        return
      }
      favBgmIds.value = favBgmIds.value.slice(0, maxLength.value)
    }

    // 要用到bangumiStore的数据
    const bangumiStore = useBangumiStore()

    // 计算属性根据id获取收藏的番剧
    const favBgmList = computed(() => {
      return bangumiStore.getBgmListByIds(favBgmIds.value)
    })

    // 切换番剧收藏与否
    const toggleFavBgm = (id: string) => {
      if (isFavBgm(id)) {
        delBgm(id)
      } else {
        addBgm(id)
      }
    }
    const addBgm = (id: string) => {
      delBgm(id)
      favBgmIds.value.unshift(id)
      tryLimit()
    }
    const delBgm = (id: string) => {
      favBgmIds.value = favBgmIds.value.filter((i) => i !== id)
    }

    // 判断番剧是否收藏
    const isFavBgm = (id: string) => {
      return favBgmIds.value.find((bgmId) => bgmId === id)
    }

    // 清除收藏
    const removeFav = () => {
      favBgmIds.value = []
    }

    // 获取猜你喜欢
    const getGuessLikeBgmList = (count?: number) => {
      // 从已收藏番剧中随机抽取3个
      const someFavBgm = bangumiStore.getBgmListByIds(
        getRandomElements(favBgmIds.value, 3)
      )
      const bgmList = bangumiStore.getSimilarBgms({
        comparisonBgms: someFavBgm,
        excludeBgms: favBgmIds.value,
        limitCount: count
      })
      return bgmList
    }

    return {
      favBgmIds,
      favBgmList,
      isFavBgm,
      toggleFavBgm,
      getGuessLikeBgmList,
      removeFav
    }
  },
  {
    persist: true // 持久化
  }
)
