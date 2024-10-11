import {
  bangumiGroupByDateService,
  bangumiGroupByScoreService,
  bangumiGroupByWeekdayService,
  bangumiHandleBgmShowNumInGroupListService,
  bangumiSortByDateService,
  bangumiSortByScoreService,
  bangumiSortByWeekdayService
} from '@/services'
import type {
  BangumiStoreDataDependencies,
  BgmData,
  BgmFile,
  BgmGroup
} from '@/types'

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
    return bgmDatas.value.filter((bgm) => idList.includes(bgm.id))
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

  // 以下这些其实没必要放在store中，但因为历史原因还在这里保留

  // 将bgmList通过星期进行处理
  // const handleByWeekday = bangumiHandleByWeekdayService

  // isAsc代表是否为正序
  // 将番剧排序 不分组
  const sortByWeekday = bangumiSortByWeekdayService

  // 将番剧按星期分组并排序，输出可显示的分组数组
  const groupByWeekday = bangumiGroupByWeekdayService

  // 按评分排序
  const sortByScore = bangumiSortByScoreService

  // 按评分分组
  const groupByScore = bangumiGroupByScoreService

  // 辅助函数：确定给定日期属于哪个季度、返回lable与groupKey
  // const getQuarter = bangumiGetQuarterService

  // 按日期排序
  const sortByDate = bangumiSortByDateService

  // 按日期分组
  const groupByDate = bangumiGroupByDateService

  // 控制多个组内的总显示数量 showLable为是否显示分组标签
  const handleBgmShowNumInGroupList = bangumiHandleBgmShowNumInGroupListService

  return {
    findBgmDataById,
    findIndexBgmDataById,
    findBgmFileByName,
    getBgmListByIds,
    bgmListOnHome,
    searchBgm,
    groupByWeekday,
    groupByDate,
    groupByScore,
    sortByWeekday,
    sortByScore,
    sortByDate,
    handleBgmShowNumInGroupList
  }
}
