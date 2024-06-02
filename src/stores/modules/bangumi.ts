import {
  bangumiGetBgmFileService,
  bangumiGetConfigService
} from '@/apis/bangumi'
import type { BgmData, BgmFile } from '@/types/bangumi'
import { parseDate } from '@/utils/datetime'
import { defineStore } from 'pinia'
import { ref } from 'vue'

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

    const getBgmListByIds = (idList: string[]) => {
      return bgmDatas.value.filter((bgm) => idList.includes(bgm.id))
    }

    const findBgmFileByName = (name: string) => {
      return bgmFiles.value.find((i) => i.fileName === name)
    }

    // 每次启动时执行，检查现有数据并根据情况请求数据
    const initData = async () => {
      // 正在加载标识
      isLoadingData.value = true

      // 【测试加载动画】等待4秒
      await new Promise((resolve) => setTimeout(resolve, 4000))

      // 获取config
      const res = await bangumiGetConfigService()
      const { bgmFileList } = res.data
      console.log(bgmFileList)

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
          if (lastModified1 === null && lastModified2 === null) {
            return 0 // 两个日期都无法解析，视为相等
          } else if (lastModified1 === null) {
            return -1 // filename1 的日期解析失败，将其视为较小的值
          } else if (lastModified2 === null) {
            return 1 // filename2 的日期解析失败，将其视为较小的值
          }

          // 将日期对象转换为时间戳进行比较
          return lastModified1.getTime() - lastModified2.getTime()
        })
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
      getBgmListByIds
    }
  },
  {
    persist: true // 持久化
  }
)
