import type {
  AboutLi,
  BgmData,
  BgmFile,
  BgmUpdateInfo,
  ConfigLink,
  NotifInfo
} from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDataModule } from './modules/data'
import { useControlModule } from './modules/control'
import { useLoadModule } from './modules/load'
import {
  bangumiGetQuarterCompleteService,
  bangumiGetQuarterPreviousInfoByKeyService
} from '@/services'
import { useUpdateModule } from './modules/update'

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
    // 代码版本（版本控制优化）
    const codeVersion = ref('')

    // 通知信息
    const notifInfo = ref<NotifInfo | null>(null)
    // 联系信息、友情链接
    const contact = ref<ConfigLink[]>([])
    const friend = ref<ConfigLink[]>([])
    // content in AboutPage
    const aboutList = ref<AboutLi[]>([])

    // 当前季度编号，如202407
    const currentQuarterKey = ref<number | null>(null)
    // 季度信息
    const quarterPreviousInfo = computed(() => {
      if (currentQuarterKey.value) {
        return bangumiGetQuarterPreviousInfoByKeyService(
          currentQuarterKey.value
        )
      }
      return bangumiGetQuarterPreviousInfoByKeyService(
        bangumiGetQuarterCompleteService(new Date()).key
      )
    })

    // 老番上架
    const releaseOldBangumi = ref<string[]>([])
    const releaseOldBangumiDatas = computed(() => {
      return dataModule.getBgmListByIds(releaseOldBangumi.value)
    })
    // 私心推荐
    const personalRecommendationBangumi = ref<string[]>([])
    const personalRecommendationBangumiDatas = computed(() => {
      return dataModule.getBgmListByIds(personalRecommendationBangumi.value)
    })

    // 番剧更新时间
    const bgmLastUpdate = ref<string | null>(null)
    // 番剧更新数据
    const bgmUpdateList = ref<BgmUpdateInfo[]>([])
    // 已读番剧更新，保存Hash
    const bgmUpdateReadHash = ref<string[]>([])

    const dataDependencies = {
      bgmDatas,
      bgmFiles,
      isLoadingData,
      isFirstLoad,
      version,
      codeVersion,
      notifInfo,
      contact,
      friend,
      aboutList,
      currentQuarterKey,
      releaseOldBangumi,
      personalRecommendationBangumi,
      bgmLastUpdate,
      bgmUpdateList,
      bgmUpdateReadHash
    }

    // useModule
    const dataModule = useDataModule(dataDependencies)
    const controlModule = useControlModule(dataDependencies)
    const loadModule = useLoadModule({
      ...dataDependencies,
      dataModule,
      controlModule
    })

    const updateModule = useUpdateModule(dataDependencies)

    return {
      ...dataModule,
      ...controlModule,
      ...loadModule,
      ...updateModule,
      bgmDatas,
      bgmFiles,
      isLoadingData,
      isFirstLoad,
      version,
      codeVersion,
      notifInfo,
      contact,
      friend,
      aboutList,
      quarterPreviousInfo,
      currentQuarterKey,
      releaseOldBangumi,
      releaseOldBangumiDatas,
      personalRecommendationBangumi,
      personalRecommendationBangumiDatas,
      bgmLastUpdate,
      bgmUpdateList,
      bgmUpdateReadHash
    }
  },
  {
    persist: true // 持久化
  }
)
