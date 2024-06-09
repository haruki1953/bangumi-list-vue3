import {
  bangumiGetBgmFileService,
  bangumiGetConfigService
} from '@/apis/bangumi'
import type {
  BgmData,
  BgmFile,
  BgmGroup,
  ConfigLink,
  ConfigNotifInfo,
  NotifInfo
} from '@/types/bangumi'
import { parseChsDate, parseDate } from '@/utils/datetime'
import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'

// 番剧数据模块
export const useBangumiStore = defineStore(
  'bangumi-bgmData',
  () => {
    const bgmDatas = ref<BgmData[]>([]) // 番剧数据
    const bgmFiles = ref<BgmFile[]>([]) // 番剧文件信息
    const isLoadingData = ref(false) // 是否正在加载数据
    const isFirstLoad = ref(true) // 是否是第一次加载，默认为true
    // 版本控制
    const version = ref('')
    // 通知信息
    const notifInfo = ref<NotifInfo | null>(null)
    // 联系信息、友情链接
    const contact = ref<ConfigLink[]>([])
    const friend = ref<ConfigLink[]>([])

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

    // 按评分分组
    const groupByScore = (bgmList: BgmData[], isAsc: boolean) => {
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
        group.bgmList = sortByScore(group.bgmList, isAsc)
      })
      // 组排序
      return isAsc ? scoreGroupList.reverse() : scoreGroupList
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

    // 辅助函数：确定给定日期属于哪个季度、返回lable与groupKey
    const getQuarter = (date: Date) => {
      let year = date.getFullYear()
      const month = date.getMonth() + 1 // 修正月份从 1 到 12
      // 季度字符串
      let quarter: string
      // 组标识，方便排序
      let groupKey: number

      // 前一月的也属于这个季度
      if ([12, 1, 2].includes(month)) {
        if (month === 12) {
          year += 1
        }
        quarter = '一月'
        groupKey = year * 100 + 1
      } else if ([3, 4, 5].includes(month)) {
        quarter = '四月'
        groupKey = year * 100 + 4
      } else if ([6, 7, 8].includes(month)) {
        quarter = '七月'
        groupKey = year * 100 + 7
      } else {
        quarter = '十月'
        groupKey = year * 100 + 10
      }
      return {
        lable: [year.toString(), quarter],
        groupKey
      }
    }

    // 按日期分组
    const groupByDate = (bgmList: BgmData[], isAsc: boolean) => {
      const dateGroupList: (BgmGroup & { groupKey: number })[] = []
      // 辅助函数：在dateGroupList查找季度，没有则push
      const addBgmToGroup = (
        bgm: BgmData,
        groupKey: number,
        lable: string[]
      ) => {
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
        const quarterInfo = getQuarter(date)
        // 加入 dateGroupList
        addBgmToGroup(bgm, quarterInfo.groupKey, quarterInfo.lable)
      })
      // 为组中的番剧排序
      dateGroupList.forEach((group) => {
        group.bgmList = sortByDate(group.bgmList, isAsc)
      })
      // 为组排序，返回
      return dateGroupList.sort(
        (a, b) => (a.groupKey - b.groupKey) * (isAsc ? 1 : -1)
      )
    }

    // 控制多个组内的总显示数量 showLable为是否显示分组标签
    const handleBgmShowNumInGroupList = (
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

    // 清除数据
    const removeData = () => {
      bgmDatas.value = []
      bgmFiles.value = []
      isFirstLoad.value = true
      notifInfo.value = null
      contact.value = []
      friend.value = []
    }

    // 检查版本 版本不一致则清除数据并同步版本
    const checkVersion = (newVersion: string) => {
      if (version.value !== newVersion) {
        version.value = newVersion
        // 清除数据
        removeData()
      }
    }

    // 检查通知
    const checkNotif = (newNotif: ConfigNotifInfo) => {
      // 不一致（或没有）则保存，并为其加上 isRead: false
      if (!notifInfo.value || notifInfo.value.id !== newNotif.id) {
        notifInfo.value = {
          id: newNotif.id,
          title: newNotif.title,
          message: newNotif.message,
          type: newNotif.type,
          isRead: false
        }
      }
    }

    // 显示通知 checkRead 为是否检查已读
    const showNotif = (checkRead: boolean) => {
      // 没有通知直接返回
      if (!notifInfo.value) return
      if (checkRead) {
        // 已读则返回
        if (notifInfo.value.isRead) return
      }
      // 标记已读的回调函数，关闭时标记已读
      const markRead = () => {
        if (!notifInfo.value) return
        notifInfo.value.isRead = true
      }
      // 显示通知
      ElNotification({
        title: notifInfo.value.title,
        message: notifInfo.value.message,
        type: notifInfo.value.type,
        onClose: markRead,
        offset: 60 // 偏移菜单栏的高
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

      // 检查版本
      checkVersion(res.data.version)
      // 检查通知
      checkNotif(res.data.notification)
      // 保存 联系信息、友情链接
      contact.value = res.data.contact
      friend.value = res.data.friend

      // 拿到bgmFileList
      const { bgmFileList } = res.data

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
          if (existsBgmIndex !== -1) {
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

      // 加载完毕
      isLoadingData.value = false

      // 如果是第一次加载数据，可能有显示问题，刷新页面
      if (isFirstLoad.value) {
        isFirstLoad.value = false
        await nextTick() // 确保更新
        window.location.reload()
      }

      // 测试
      // removeData()
    }

    return {
      bgmDatas,
      bgmFiles,
      isLoadingData,
      isFirstLoad,
      version,
      notifInfo,
      contact,
      friend,
      removeData,
      showNotif,
      initData,
      findBgmDataById,
      getBgmListByIds,
      bgmListOnHome,
      groupByWeekday,
      groupByDate,
      groupByScore,
      sortByWeekday,
      sortByScore,
      sortByDate,
      handleBgmShowNumInGroupList,
      searchBgm
    }
  },
  {
    persist: true // 持久化
  }
)
