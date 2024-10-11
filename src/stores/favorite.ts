import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useBangumiStore } from './bangumi'
import type { BgmData } from '@/types/bangumi'

// 收藏模块
export const useFavoriteStore = defineStore(
  'bangumi-favorite',
  () => {
    // 保存收藏的id
    const favBgmIds = ref<string[]>([])

    // 要用到bangumiStore的数据
    const bangumiStore = useBangumiStore()

    // 计算属性根据id获取收藏的番剧
    const favBgmList = computed(() => {
      return bangumiStore.getBgmListByIds(favBgmIds.value)
    })

    // 切换番剧收藏与否
    const toggleFavBgm = (id: string) => {
      // 先尝试寻找
      const idIndex = favBgmIds.value.findIndex((bgmId) => bgmId === id)
      if (idIndex !== -1) {
        // 如果找到了，移除该id
        favBgmIds.value.splice(idIndex, 1)
      } else {
        // 如果没找到，添加该id
        favBgmIds.value.push(id)
      }
    }

    // 判断番剧是否收藏
    const isFavBgm = (id: string) => {
      return favBgmIds.value.find((bgmId) => bgmId === id)
    }

    // 辅助函数：从数组中随机抽取count个
    const getRandomElements = (arr: string[], count: number) => {
      // 复制数组，以免修改原数组
      const shuffled = arr.slice()
      // 使用Fisher-Yates算法随机打乱数组
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        // 交换元素
        const temp = shuffled[i]
        shuffled[i] = shuffled[j]
        shuffled[j] = temp
      }
      // 返回前count个元素
      return shuffled.slice(0, count)
    }

    // 辅助函数：统计两个番剧中的相同标签数
    const countCommonTags = (bgm: BgmData, favBgm: BgmData) => {
      // 将第一个对象的 tagList 转换为集合
      const tagSet = new Set(bgm.tagList)
      // 遍历第二个对象的 tagList，统计在集合中出现的标签数量
      let commonTagCount = 0
      for (const tag of favBgm.tagList) {
        if (tagSet.has(tag)) {
          commonTagCount++
        }
      }
      return commonTagCount
    }

    // 辅助函数：tagScore计算
    const calcTagScore = (tagCount: number, bgm: BgmData) => {
      // 根据番剧评分计算分数，以提高高分权重
      const bgmScore = parseFloat(bgm.score)
      let calcScore = isNaN(bgmScore) ? 0 : bgmScore

      // 如果为续作则减一分
      if (bgm.tagList.includes('续作')) {
        calcScore -= 1
      }

      // 番剧评分超过7.5按7.5算，降低分数过高的出现几率
      // 7.5分以上的对于观众可以说是同等优秀
      calcScore = bgmScore > 7.5 ? 7.5 : bgmScore

      // 确保为正数
      calcScore = calcScore < 0 ? 0 : calcScore

      // 将 相同标签数 乘 计算的分数
      const tagScore = tagCount * calcScore
      return tagScore
    }

    // 获取猜你喜欢 count为数量
    const getGuessLikeBgmList = (count: number) => {
      // 从已收藏番剧中随机抽取3个
      const someFavBgm = bangumiStore.getBgmListByIds(
        getRandomElements(favBgmIds.value, 3)
      )
      // 将全部番剧map为记录推荐分数的数组
      const bgmTagCountList = bangumiStore.bgmDatas.map((bgm) => {
        let tagCount = 0
        // 当收藏中已存在时，tagCount（tagScore）为零
        if (isFavBgm(bgm.id)) {
          return { bgmId: bgm.id, tagScore: tagCount }
        }
        // 遍历someFavBgm，对比记录相同标签
        someFavBgm.forEach((favBgm) => {
          tagCount += countCommonTags(bgm, favBgm)
        })

        return { bgmId: bgm.id, tagScore: calcTagScore(tagCount, bgm) }
      })
      // 按标签数降序排序
      bgmTagCountList.sort((a, b) => b.tagScore - a.tagScore)
      // 返回前count个番剧
      const bgmList = bangumiStore.getBgmListByIds(
        bgmTagCountList.slice(0, count).map((item) => item.bgmId)
      )
      return bgmList
    }

    // 清除收藏
    const removeFav = () => {
      favBgmIds.value = []
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
