import {
  bangumiCalcTagScoreService,
  bangumiCountCommonTagsService,
  bangumiGroupByDateService
} from '@/services'
import type { BangumiStoreDataDependencies, BgmData, BgmFile } from '@/types'

import { computed } from 'vue'

export const useDataModule = (dependencies: BangumiStoreDataDependencies) => {
  const {
    bgmDatas,
    bgmFiles
    // isLoadingData,
    // isFirstLoad,
    // version,
    // codeVersion,
    // notifInfo,
    // contact,
    // friend,
    // aboutList
  } = dependencies

  const findBgmDataById = (id: string) => {
    return bgmDatas.value.find((i) => i.id === id)
  }
  const findIndexBgmDataById = (id: string) => {
    return bgmDatas.value.findIndex((i) => i.id === id)
  }

  const findBgmFileByName = (name: string) => {
    return bgmFiles.value.find((i) => i.fileName === name)
  }

  const getBgmListByIds = (idList: string[]) => {
    return [...new Set(idList)]
      .map((id) => findBgmDataById(id))
      .filter((bgm): bgm is BgmData => bgm !== undefined)
  }

  const bgmListOnHome = computed(() => {
    const idList: BgmFile['bgmIds'] = []
    bgmFiles.value
      .filter((file) => file.showOnHome)
      .forEach((file) => idList.push(...file.bgmIds))
    return getBgmListByIds(idList)
  })

  // 搜索番剧
  const searchBgm = (key: string) => {
    if (!key) {
      // 关键字为空，返回所有
      return bgmDatas.value
    }
    // 搜索key（忽略大小写）
    const lowerKey = key.toLowerCase()

    return bgmDatas.value.filter((bgm) => {
      // 别名需要转小写并逐个搜索
      let isInAlias = false
      bgm.aliasList.some((alias) => {
        if (alias.toLowerCase().includes(lowerKey)) {
          // 匹配到则将isInAlias赋值true 并返回true停止遍历
          isInAlias = true
          return true
        }
      })
      // 在 id、name、chineseName、date、tagList 中搜索
      return (
        isInAlias ||
        bgm.id.includes(lowerKey) ||
        bgm.name.toLowerCase().includes(lowerKey) ||
        bgm.chineseName.toLowerCase().includes(lowerKey) ||
        bgm.date.includes(lowerKey) ||
        // 标签太多就没必要转小写，并且是整体匹配
        bgm.tagList.includes(key)
      )
    })
  }

  // 获取相似番剧
  const getSimilarBgms = (props: {
    // 用于对比的番剧
    comparisonBgms: BgmData[]
    // 排除的番剧id
    excludeBgms: string[]
    // 最大分数（不常用）
    maxAllowedScore?: number
    // 最小分数
    minAllowedScore?: number
    // 数量限制
    limitCount?: number
  }) => {
    const {
      comparisonBgms,
      excludeBgms,
      maxAllowedScore = Infinity, // 设置默认值为无限大
      minAllowedScore = 1, // 设置默认值为1
      limitCount = Infinity // 设置默认值为无限大
    } = props

    // 用于对比的番剧为空，返回bgmDatas，并过滤
    if (comparisonBgms.length === 0) {
      return bgmDatas.value.filter((bgm) => !excludeBgms.includes(bgm.id))
    }

    // 将全部番剧map为记录推荐分数的数组
    const bgmTagCountList = bgmDatas.value.map((bgm) => {
      let tagCount = 0
      // 当排除中已存在时，tagCount（tagScore）为零
      if (excludeBgms.includes(bgm.id)) {
        return { bgmId: bgm.id, tagScore: tagCount }
      }
      // 遍历comparisonBgm，对比记录相同标签
      comparisonBgms.forEach((comparisonBgm) => {
        tagCount += bangumiCountCommonTagsService(bgm, comparisonBgm)
      })

      return {
        bgmId: bgm.id,
        tagScore: bangumiCalcTagScoreService(tagCount, bgm)
      }
    })
    // 按标签数降序排序
    bgmTagCountList.sort((a, b) => b.tagScore - a.tagScore)
    // 返回番剧数据
    const bgmList = getBgmListByIds(
      bgmTagCountList
        .slice(0, limitCount)
        .filter(
          (item) =>
            item.tagScore >= minAllowedScore && item.tagScore <= maxAllowedScore
        )
        .map((item) => item.bgmId)
    )
    return bgmList
  }

  const getQuarterBgms = (quarterkey: number) => {
    const dateGroupBgms = bangumiGroupByDateService(bgmDatas.value, false)
    return (
      dateGroupBgms.find((group) => group.groupKey === quarterkey)?.bgmList ||
      []
    )
  }

  return {
    findBgmDataById,
    findIndexBgmDataById,
    findBgmFileByName,
    getBgmListByIds,
    bgmListOnHome,
    searchBgm,
    getSimilarBgms,
    getQuarterBgms
  }
}
