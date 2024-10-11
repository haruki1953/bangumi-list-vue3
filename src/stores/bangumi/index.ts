import type {
  AboutLi,
  BgmData,
  BgmFile,
  ConfigLink,
  NotifInfo
} from '@/types/bangumi'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDataModule } from './modules/data'
import { useControlModule } from './modules/control'
import { useLoadModule } from './modules/load'

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
      aboutList
    }

    // useModule
    const dataModule = useDataModule(dataDependencies)
    const controlModule = useControlModule(dataDependencies)
    const loadModule = useLoadModule({
      ...dataDependencies,
      dataModule,
      controlModule
    })

    return {
      ...dataModule,
      ...controlModule,
      ...loadModule,
      bgmDatas,
      bgmFiles,
      isLoadingData,
      isFirstLoad,
      version,
      codeVersion,
      notifInfo,
      contact,
      friend,
      aboutList
    }
  },
  {
    persist: true // 持久化
  }
)
