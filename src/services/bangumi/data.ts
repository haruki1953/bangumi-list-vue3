import type { BgmData, BgmGroup } from '@/types'
import { parseChsDate } from '@/utils/datetime'

// 将bgmList通过星期进行处理
export const bangumiHandleByWeekdayService = (bgmList: BgmData[]) => {
  // 8 个BgmData数组，代表周日0至周六6，7为其他解析失败的
  const weekData: BgmData[][] = [[], [], [], [], [], [], [], []]
  const weekStrs = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ]
  bgmList.forEach((bgm) => {
    for (let i = 0; i < 7; i++) {
      if (bgm.weekday === weekStrs[i]) {
        weekData[i].push(bgm)
        return
      }
    }
    weekData[7].push(bgm)
  })
  return weekData
}

// isAsc代表是否为正序
// 将番剧按星期排序 不分组
export const bangumiSortByWeekdayService = (
  bgmList: BgmData[],
  isAsc: boolean
) => {
  const weekData = bangumiHandleByWeekdayService(bgmList)
  // 获取当前日期
  const now = new Date()
  // 获取今天是星期几，JavaScript中的Date.getDay()返回的是0（代表周日）到6（代表周六）的整数
  const todayIndex = now.getDay()
  // 制作列表，当前星期在第一
  const weekDataList: BgmData[] = []
  if (isAsc) {
    // 正序
    for (let i = 0; i < 7; i++) {
      let index = todayIndex + i
      index = index < 7 ? index : index - 7
      weekDataList.push(...weekData[index])
    }
  } else {
    // 倒序
    for (let i = 0; i < 7; i++) {
      let index = todayIndex - i
      index = index >= 0 ? index : index + 7
      weekDataList.push(...weekData[index])
    }
  }
  weekDataList.push(...weekData[7])
  return weekDataList
}

// 将番剧按星期分组并排序，输出可显示的分组数组
export const bangumiGroupByWeekdayService = (
  bgmList: BgmData[],
  isAsc: boolean
) => {
  const weekData = bangumiHandleByWeekdayService(bgmList)
  // 获取当前日期
  const now = new Date()
  // 获取今天是星期几，JavaScript中的Date.getDay()返回的是0（代表周日）到6（代表周六）的整数
  const todayIndex = now.getDay()
  // 制作列表，当前星期在第一
  const weekGroupList: BgmGroup[] = []
  const weekLables = [
    ['周', '日'],
    ['周', '一'],
    ['周', '二'],
    ['周', '三'],
    ['周', '四'],
    ['周', '五'],
    ['周', '六'],
    ['其', '它']
  ]
  const pushWeekGroup = (index: number) => {
    weekGroupList.push({
      lable: weekLables[index],
      // bgmList按评分排序
      bgmList: bangumiSortByScoreService(weekData[index], false)
    })
  }
  if (isAsc) {
    // 正序
    for (let i = 0; i < 7; i++) {
      let index = todayIndex + i
      index = index < 7 ? index : index - 7
      pushWeekGroup(index)
    }
  } else {
    // 倒序
    for (let i = 0; i < 7; i++) {
      let index = todayIndex - i
      index = index >= 0 ? index : index + 7
      pushWeekGroup(index)
    }
  }
  // 将其他添加至最后
  pushWeekGroup(7)
  return weekGroupList
}

// 将番剧按AlistPath合并，其中按日期降序排序
export const bangumiMergeByAlistPathService = (
  bgmList: BgmData[]
): BgmData[][] => {
  const map = new Map<string, BgmData[]>()

  // 将 bgmList 中的项按 alistPath 分组
  bgmList.forEach((bgm) => {
    if (!map.has(bgm.alistPath)) {
      map.set(bgm.alistPath, [])
    }
    map.get(bgm.alistPath)!.push(bgm)
  })

  // 并将分组中的番剧按日期降序排序
  return Array.from(map.values()).map((group) =>
    bangumiSortByDateService(group, false)
  )
}

// 将番剧按AlistPath合并，保留项数大于1的分组（至少两个）
export const bangumiMergeByAlistPathAndFilterLengthGt1Service = (
  bgmList: BgmData[]
): BgmData[][] => {
  // 同系列分组
  const mergeByAlistPath = bangumiMergeByAlistPathService(bgmList)

  return mergeByAlistPath.filter((group) => group.length > 1)
}

// 剔除同系列较旧的番剧
export const bangumiListSameAlistPathRemovingOlderBgmService = (
  bgmList: BgmData[]
) => {
  // 同系列分组
  const mergeByAlistPath = bangumiMergeByAlistPathService(bgmList)
  // 分组中保留首个
  return mergeByAlistPath.map((list) => list[0])
}

// 将番剧按星期分组并排序，且将同一系列（alistPath相同）放在一起，按放送最迟的为准
export const bangumiGroupByWeekdayAndMergeByAlistPathService = (
  bgmList: BgmData[],
  isAsc: boolean
) => {
  // 剔除同系列较旧的番剧，并以此分组排序。
  // 这里为了优化性能，就不调用封装好的了（会执行两次bangumiMergeByAlistPathService）
  const mergeByAlistPath = bangumiMergeByAlistPathService(bgmList)
  const listSameAlistPathRemovingOlderBgm = mergeByAlistPath.map(
    (list) => list[0]
  )
  const weekGroupList = bangumiGroupByWeekdayService(
    listSameAlistPathRemovingOlderBgm,
    isAsc
  )

  // 同系列分组，保留项数大于1的分组（至少两个）
  const mergeByAlistPathAndFilterLengthGt1 = mergeByAlistPath.filter(
    (group) => group.length > 1
  )

  // 将同系列中的新番，替换为分组好的
  const groupListAfterAddingOlderBgm = weekGroupList.map((bgmGroup) => {
    const newBgmList: BgmData[] = []
    bgmGroup.bgmList.forEach((bgm) => {
      const needAdd = mergeByAlistPathAndFilterLengthGt1.find(
        (lm) => lm[0]?.alistPath === bgm.alistPath
      )
      if (needAdd) {
        newBgmList.push(...needAdd)
      } else {
        newBgmList.push(bgm)
      }
    })
    return {
      ...bgmGroup,
      bgmList: newBgmList
    }
  })

  return groupListAfterAddingOlderBgm
}

// 按评分排序
export const bangumiSortByScoreService = (
  bgmList: BgmData[],
  isAsc: boolean
) => {
  return bgmList.sort((a, b) => {
    const aValue = parseFloat(a.score)
    const bValue = parseFloat(b.score)

    // 处理评分解析失败
    if (isNaN(aValue) && isNaN(bValue)) {
      return 0 // 两个都无法解析，视为相等
    } else if (isNaN(aValue)) {
      return 1 // a解析失败，将其排在后面
    } else if (isNaN(bValue)) {
      return -1 // b解析失败，将其排在后面
    }

    return isAsc ? aValue - bValue : bValue - aValue
  })
}

// 按评分分组
export const bangumiGroupByScoreService = (
  bgmList: BgmData[],
  isAsc: boolean
) => {
  // 6个分组
  const scoreGroupList: BgmGroup[] = [
    { lable: ['7.5+'], bgmList: [] },
    { lable: ['7.0+'], bgmList: [] },
    { lable: ['6.5+'], bgmList: [] },
    { lable: ['6.0+'], bgmList: [] },
    { lable: ['6.0-'], bgmList: [] },
    // 无评分
    { lable: ['无'], bgmList: [] }
  ]

  // 遍历解析番剧，存入GroupList
  bgmList.forEach((bgm) => {
    const bgmScore = parseFloat(bgm.score)
    if (isNaN(bgmScore)) {
      scoreGroupList[5].bgmList.push(bgm)
    } else if (bgmScore >= 7.5) {
      scoreGroupList[0].bgmList.push(bgm)
    } else if (bgmScore >= 7) {
      scoreGroupList[1].bgmList.push(bgm)
    } else if (bgmScore >= 6.5) {
      scoreGroupList[2].bgmList.push(bgm)
    } else if (bgmScore >= 6) {
      scoreGroupList[3].bgmList.push(bgm)
    } else {
      scoreGroupList[4].bgmList.push(bgm)
    }
  })
  // 组中番剧排序
  scoreGroupList.forEach((group) => {
    group.bgmList = bangumiSortByScoreService(group.bgmList, isAsc)
  })
  // 组排序
  return isAsc ? scoreGroupList.reverse() : scoreGroupList
}

// 按日期排序
export const bangumiSortByDateService = (
  bgmList: BgmData[],
  isAsc: boolean
) => {
  return bgmList.sort((a, b) => {
    const aValue = parseChsDate(a.date)
    const bValue = parseChsDate(b.date)

    // 处理解析失败
    if (!aValue && !bValue) {
      return 0 // 两个都无法解析，视为相等
    } else if (!aValue) {
      return 1 // a解析失败，将其排在后面
    } else if (!bValue) {
      return -1 // b解析失败，将其排在后面
    }

    return isAsc
      ? aValue.getTime() - bValue.getTime()
      : bValue.getTime() - aValue.getTime()
  })
}

// 辅助函数：确定给定日期属于哪个季度、返回lable与groupKey
export const bangumiGetQuarterService = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 修正月份从 1 到 12
  // 前一月的也属于这个季度
  return bangumiGetQuarterByYearMonthService({
    year,
    month,
    includePreviousMonthInQuarter: true
  })
}

// 确定给定日期属于哪个季度，与上一个不同的是，不将前一月算作本季度
export const bangumiGetQuarterCompleteService = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 修正月份从 1 到 12
  return bangumiGetQuarterByYearMonthService({
    year,
    month
  })
}

// 将季度key转为年和月
const bangumiQuarterKeyToYearMonthService = (key: number) => {
  const keyString = key.toString()
  const year = parseInt(keyString.substring(0, 4), 10)
  const month = parseInt(keyString.substring(4, 6), 10)
  return { year, month }
}

// 确定给定key属于哪个季度
export const bangumiGetQuarterByKeyService = (key: number) => {
  const { year, month } = bangumiQuarterKeyToYearMonthService(key)
  return bangumiGetQuarterByYearMonthService({
    year,
    month
  })
}

// 获取key的季度与前三季度的信息，key如202407
export const bangumiGetQuarterPreviousInfoByKeyService = (key: number) => {
  const currentQuarter = bangumiGetQuarterByKeyService(key)
  const previousQuarterList = [3, 6, 9].map((subMonthNum) => {
    let { year: handledYear, month: handledMonth } =
      bangumiQuarterKeyToYearMonthService(currentQuarter.key)
    if (handledMonth - subMonthNum <= 0) {
      handledYear -= 1
      handledMonth += 12
    }
    handledMonth -= subMonthNum
    return bangumiGetQuarterByYearMonthService({
      year: handledYear,
      month: handledMonth
    })
  })
  const previousFirstQuarter = previousQuarterList[0]
  const previousSecondQuarter = previousQuarterList[1]
  const previousThirdQuarter = previousQuarterList[2]
  return {
    currentQuarter,
    previousFirstQuarter,
    previousSecondQuarter,
    previousThirdQuarter
  }
}

// 确定给定年份月份属于哪个季度
const bangumiGetQuarterByYearMonthService = (props: {
  year: number
  // 注意，month为1-12
  month: number
  // 是否将前一月包含在当前季度中
  includePreviousMonthInQuarter?: boolean
}) => {
  let year = props.year
  const month = (() => {
    if (props.includePreviousMonthInQuarter) {
      return props.month + 1
    } else {
      return props.month
    }
  })()
  // 季度字符串
  let quarter
  // 季节字符串
  let season
  // 颜色
  let color
  // 季度标识，方便排序
  let key: number

  if ([13, 0, 1, 2, 3].includes(month)) {
    if (month === 13) {
      year += 1
    }
    quarter = '一月' as const
    season = '冬' as const
    color = 'primary' as const
    key = year * 100 + 1
  } else if ([4, 5, 6].includes(month)) {
    quarter = '四月' as const
    season = '春' as const
    color = 'success' as const
    key = year * 100 + 4
  } else if ([7, 8, 9].includes(month)) {
    quarter = '七月' as const
    season = '夏' as const
    color = 'warning' as const
    key = year * 100 + 7
  } else {
    quarter = '十月' as const
    season = '秋' as const
    color = 'danger' as const
    key = year * 100 + 10
  }
  return {
    year: year.toString(),
    quarter,
    season,
    color,
    key
  }
}

// 按日期分组
export const bangumiGroupByDateService = (
  bgmList: BgmData[],
  isAsc: boolean
) => {
  const dateGroupList: (BgmGroup & { groupKey: number })[] = []
  // 辅助函数：在dateGroupList查找季度，没有则push
  const addBgmToGroup = (bgm: BgmData, groupKey: number, lable: string[]) => {
    const group = dateGroupList.find((group) => group.groupKey === groupKey)
    if (group) {
      group.bgmList.push(bgm)
    } else {
      dateGroupList.push({
        groupKey,
        lable,
        bgmList: [bgm]
      })
    }
  }
  // 遍历解析番剧，存入dateGroupList
  bgmList.forEach((bgm) => {
    const date = parseChsDate(bgm.date)
    // 日期解析失败 放入其他分组 其他分组应该在最后
    // groupKey 升序时为999999，降序时为111111
    const otherKey = isAsc ? 999999 : 111111
    if (!date) {
      addBgmToGroup(bgm, otherKey, ['其', '它'])
      return
    }
    // 日期解析成功，解析季度信息
    const quarterInfo = bangumiGetQuarterService(date)
    // 加入 dateGroupList
    addBgmToGroup(bgm, quarterInfo.key, [quarterInfo.year, quarterInfo.quarter])
  })
  // 为组中的番剧排序
  dateGroupList.forEach((group) => {
    group.bgmList = bangumiSortByDateService(group.bgmList, isAsc)
  })
  // 为组排序，返回
  return dateGroupList.sort(
    (a, b) => (a.groupKey - b.groupKey) * (isAsc ? 1 : -1)
  )
}

// 控制多个组内的总显示数量 showLable为是否显示分组标签
export const bangumiHandleBgmShowNumInGroupListService = (
  groupList: BgmGroup[],
  showNum: number,
  showLable: boolean
) => {
  let count = 0
  const newGroupList: BgmGroup[] = []
  groupList.some((group) => {
    // 显示标签则计数加1
    if (showLable && group.bgmList.length) {
      count += 1
    }
    // 如果加上bgmList.length不超出，则计数，并将组添加至newGroupList
    if (count + group.bgmList.length < showNum) {
      count += group.bgmList.length
      newGroupList.push(group)
      return false
    }
    // 超出（或相等），进行裁切
    const remainingNum = showNum - count
    newGroupList.push({
      lable: group.lable,
      bgmList: group.bgmList.slice(0, remainingNum)
    })
    return true // 退出循环
  })
  return newGroupList
}

// 辅助函数：统计两个番剧中的相同标签数
export const bangumiCountCommonTagsService = (
  bgm: BgmData,
  favBgm: BgmData
) => {
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
export const bangumiCalcTagScoreService = (tagCount: number, bgm: BgmData) => {
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
