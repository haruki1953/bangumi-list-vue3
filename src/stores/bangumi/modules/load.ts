import {
  bangumiGetBgmFileService,
  bangumiGetConfigService
} from '@/apis/bangumi'
import type { BangumiStoreDataDependencies, BgmFile } from '@/types'
import { handleBgmData } from '@/utils/dataHandler'
import { parseDate } from '@/utils/datetime'
import { nextTick } from 'vue'
import type { useDataModule } from './data'
import type { useControlModule } from './control'

export const useLoadModule = (
  dependencies: BangumiStoreDataDependencies & {
    dataModule: ReturnType<typeof useDataModule>
    controlModule: ReturnType<typeof useControlModule>
  }
) => {
  const {
    bgmDatas,
    bgmFiles,
    isLoadingData,
    isFirstLoad,
    // version,
    // codeVersion,
    // notifInfo,
    contact,
    friend,
    aboutList,
    dataModule: { findBgmFileByName, findIndexBgmDataById },
    controlModule: { checkCodeVersion, checkVersion, checkNotif }
  } = dependencies

  // 每次启动时执行，检查现有数据并根据情况请求数据
  const initData = async () => {
    await checkCodeVersion()

    // 正在加载标识
    isLoadingData.value = true

    // 【测试加载动画】等待4秒
    // await new Promise((resolve) => setTimeout(resolve, 4000))

    // 获取config
    const res = await bangumiGetConfigService()

    // 检查版本
    if (res.data.version) {
      checkVersion(res.data.version)
    }
    // 检查通知
    if (res.data.notification) {
      checkNotif(res.data.notification)
    }
    // 保存 联系信息、友情链接、aboutList
    contact.value = res.data.contact || []
    friend.value = res.data.friend || []
    aboutList.value = res.data.aboutList || []

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
      const bgmFile1 = bgmFileList.find((file) => file.fileName === filename1)
      const lastModified1 = parseDate(bgmFile1?.lastModified || '')

      // 获取 filename2 对应的最后修改时间，并将其解析为 Date 对象
      const bgmFile2 = bgmFileList.find((file) => file.fileName === filename2)
      const lastModified2 = parseDate(bgmFile2?.lastModified || '')

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

        // handle bgmData
        const handledBgmData = handleBgmData(bgmData)
        // insert bgmData in bgmDatas
        const existsBgmIndex = findIndexBgmDataById(handledBgmData.id)
        if (existsBgmIndex !== -1) {
          bgmDatas.value[existsBgmIndex] = handledBgmData
        } else {
          bgmDatas.value.push(handledBgmData)
        }
        // 保存番剧id
        idList.push(handledBgmData.id)
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
    bgmDatas.value = bgmDatas.value.filter((bgm) => allIdList.includes(bgm.id))

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
    initData
  }
}
