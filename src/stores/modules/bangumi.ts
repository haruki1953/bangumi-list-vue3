import {
  bangumiGetBgmFileService,
  bangumiGetConfigService
} from '@/apis/bangumi'
import type {
  BgmData,
  BgmFile,
  BgmGroup,
  WeekData,
  WeekKey
} from '@/types/bangumi'
import { parseChsDate, parseDate } from '@/utils/datetime'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 番剧数据模块
export const useBangumiStore = defineStore(
  'bangumi-bgmData',
  () => {
    const bgmDatas = ref<BgmData[]>([]) // 番剧数据
    const bgmFiles = ref<BgmFile[]>([]) // 番剧文件信息
    const isLoadingData = ref(false) // 是否正在加载数据

    const findBgmDataById = (id: string) => {
      return bgmDatas.value.find((i) => i.id === id)
    }
    const findIndexBgmDataById = (id: string) => {
      const index = bgmDatas.value.findIndex((i) => i.id === id)
      if (index === -1) return undefined
      return index
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

    // 将bgmList通过星期进行处理
    const handleByWeekday = (bgmList: BgmData[]) => {
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
    // 将番剧排序 不分组
    const sortByWeekday = (bgmList: BgmData[], isAsc: boolean) => {
      const weekData = handleByWeekday(bgmList)
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
    const groupByWeekday = (bgmList: BgmData[], isAsc: boolean) => {
      const weekData = handleByWeekday(bgmList)
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
          bgmList: sortByScore(weekData[index], false)
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

    // 按评分排序
    const sortByScore = (bgmList: BgmData[], isAsc: boolean) => {
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

    // 按日期排序
    const sortByDate = (bgmList: BgmData[], isAsc: boolean) => {
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

    // 每次启动时执行，检查现有数据并根据情况请求数据
    const initData = async () => {
      // 正在加载标识
      isLoadingData.value = true

      // 【测试加载动画】等待4秒
      // await new Promise((resolve) => setTimeout(resolve, 4000))

      // 获取config
      const res = await bangumiGetConfigService()
      const { bgmFileList } = res.data
      // console.log(bgmFileList)

      // 从bgmFiles中去掉bgmFileList里没有的番剧文件
      bgmFiles.value = bgmFiles.value.filter((item) =>
        bgmFileList.find((i) => i.fileName === item.fileName)
      )

      // 遍历bgmFileList，记录需要获取数据的文件名（不存在或已更改），
      // 对于不存在的需要在bgmFiles初始化占位数据
      let needGetFilenames: string[] = []
      bgmFileList.forEach((item) => {
        // 尝试寻找已在bgmFiles存在的
        const existsFile = findBgmFileByName(item.fileName)

        // 存在且未更改则直接返回
        if (existsFile && existsFile.lastModified === item.lastModified) return

        // 不存在或已更改 将文件名记录至 needGetFilenames
        needGetFilenames.push(item.fileName)

        // 不存在 在bgmFiles初始化占位数据
        if (!existsFile) {
          // （真正填充数据在获取番剧数据后）
          const fileInfo: BgmFile = {
            fileName: item.fileName,
            lastModified: '',
            showOnHome: false,
            bgmIds: []
          }
          bgmFiles.value.push(fileInfo)
        }
      })

      // 将记录的文件名按照 bgmFileList 中的时间排序
      // 日期晚的放在后面 这样在更新bgmDatas可以保证数据最新
      needGetFilenames = needGetFilenames.sort((filename1, filename2) => {
        // 获取 filename1 对应的最后修改时间，并将其解析为 Date 对象
        const lastModified1 = parseDate(
          bgmFileList.find((file) => file.fileName === filename1)
            ?.lastModified || ''
        )

        // 获取 filename2 对应的最后修改时间，并将其解析为 Date 对象
        const lastModified2 = parseDate(
          bgmFileList.find((file) => file.fileName === filename2)
            ?.lastModified || ''
        )

        // 处理日期解析失败的情况
        if (!lastModified1 && !lastModified2) {
          return 0 // 两个日期都无法解析，视为相等
        } else if (!lastModified1) {
          return -1 // filename1 的日期解析失败，将其视为较小的值
        } else if (!lastModified2) {
          return 1 // filename2 的日期解析失败，将其视为较小的值
        }

        // 将日期对象转换为时间戳进行比较
        return lastModified1.getTime() - lastModified2.getTime()
      })
      // console.log(needGetFilenames)
      // console.log(bgmFiles.value)

      // 根据 needGetFilenames 请求获取全部数据
      const requests = needGetFilenames.map((filename) =>
        bangumiGetBgmFileService(filename)
      )
      const resList = await Promise.all(requests)

      // 遍历获取的 resList
      resList.forEach((res, index) => {
        const resBgmList = res.data
        const bgmFile = findBgmFileByName(needGetFilenames[index])
        const idList: BgmFile['bgmIds'] = []

        // 遍历番剧数据列表，添加入bgmDatas，存在则替换
        resBgmList.forEach((bgmData) => {
          if (!bgmData.id) return // id不正常则返回
          const existsBgmIndex = findIndexBgmDataById(bgmData.id)
          if (existsBgmIndex) {
            bgmDatas.value[existsBgmIndex] = bgmData
          } else {
            bgmDatas.value.push(bgmData)
          }
          // 保存番剧id
          idList.push(bgmData.id)
        })

        // 更新对应bgmFiles的bgmIds
        if (bgmFile) {
          bgmFile.bgmIds = idList
        }
      })

      // 遍历 bgmFileList 同步 bgmFiles 的所有信息
      bgmFileList.forEach((newFileInfo) => {
        const fileInfo = findBgmFileByName(newFileInfo.fileName)
        if (!fileInfo) return
        fileInfo.lastModified = newFileInfo.lastModified
        fileInfo.showOnHome = newFileInfo.showOnHome
      })

      // 从 bgmList 去除所有 bgmIds 都不包含的
      const allIdList: BgmFile['bgmIds'] = []
      bgmFiles.value.forEach((i) => allIdList.push(...i.bgmIds))
      bgmDatas.value = bgmDatas.value.filter((bgm) =>
        allIdList.includes(bgm.id)
      )

      isLoadingData.value = false
    }

    return {
      bgmDatas,
      bgmFiles,
      isLoadingData,
      initData,
      getBgmListByIds,
      bgmListOnHome,
      groupByWeekday,
      sortByWeekday,
      sortByScore,
      sortByDate
    }
  },
  {
    persist: true // 持久化
  }
)
