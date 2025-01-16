<script setup lang="ts">
import { useBangumiStore, useSettingStore } from '@/stores'
import FavoriteHistorySettingDialog from './components/FavoriteHistorySettingDialog.vue'
import { ref } from 'vue'
import UpdateSettingDialog from './components/UpdateSettingDialog.vue'
import { sakiMessage } from '@/utils'

const bangumiStore = useBangumiStore()

// 防止用户多次点击重载数据，
// 重载之后页面会自动刷新所以此处只需能点一次
let isResetting = false
const resetData = () => {
  if (isResetting) {
    sakiMessage({
      type: 'warning',
      offset: 66,
      message: '正在重载数据'
    })
    return
  }
  isResetting = true
  sakiMessage({
    type: 'success',
    offset: 66,
    message: '开始重载数据'
  })
  bangumiStore.removeData()
  bangumiStore.initData()
}

const settingStore = useSettingStore()

const refFavoriteHistorySettingDialog = ref<InstanceType<
  typeof FavoriteHistorySettingDialog
> | null>(null)
const refUpdateSettingDialog = ref<InstanceType<
  typeof UpdateSettingDialog
> | null>(null)
</script>
<template>
  <div class="markdown-content">
    <FavoriteHistorySettingDialog
      ref="refFavoriteHistorySettingDialog"
    ></FavoriteHistorySettingDialog>
    <UpdateSettingDialog ref="refUpdateSettingDialog"></UpdateSettingDialog>
    <h2>关于【小祥の小窝】🎉</h2>
    <p>是一个基于onedrive的番剧小窝</p>
    <!-- <h2>注意事项🦽</h2> -->
    <ul>
      <li>
        <strong>关于下载</strong>
        <p>
          建议下载观看，右键点击或长按文件下载。 下载时请尽量使用
          <a
            href="https://www.freedownloadmanager.org/zh/download.htm"
            target="_blank"
          >
            FDM
          </a>
          等多线程下载软件。
        </p>
      </li>
      <li>
        <strong>关于首页当季新番是否显示同系列番剧</strong>，
        <a
          href="javascript:;"
          @click="settingStore.toggleIsHomeShowSameAlistPathBgm"
        >
          同系列番剧 显示/隐藏
        </a>
      </li>
      <li>
        <strong>关于【番剧更新】</strong>
        <p>
          一般在当天半夜更新，建议次日早上看。部分新番因巴哈姆特没有，字幕组更新会较晚。
        </p>
        <p>
          番剧更新后，可能需要等待 10 分钟左右，因为 AList 对 OneDrive
          文件的刷新有一定的间隔时间。
        </p>
        <a href="javascript:;" @click="refUpdateSettingDialog?.open">
          点击此处设置番剧更新提示
        </a>
      </li>
      <li>
        <strong>关于【番剧收藏】与【历史记录】的设置</strong>
        ，
        <a href="javascript:;" @click="refFavoriteHistorySettingDialog?.open">
          点击此处设置
        </a>
      </li>
      <li>
        <strong>关于相似番剧【猜你喜欢/更多番剧】的显示与数量</strong>
        ，
        <a href="javascript:;" @click="settingStore.toggleShowSimilarBgms">
          是否显示 显示/隐藏
        </a>
        |
        <a href="javascript:;" @click="settingStore.toggleLimitSimilarBgms">
          数量控制 开启/关闭
        </a>
      </li>
      <li>
        <strong>关于番剧卡片下方的【番剧名】是否显示</strong>
        ，
        <a href="javascript:;" @click="settingStore.toggleShowBgmName">
          切换番剧名 显示/隐藏
        </a>
      </li>
      <li>
        <strong>关于左下角嵌入的【Discord】是否显示</strong>
        ，显示时可能会有性能问题
        <a href="javascript:;" @click="settingStore.toggleShowDiscord">
          切换 Discord 显示/隐藏
        </a>
      </li>
      <li>
        <strong>如果通知没有来得及看</strong>
        可以
        <a href="javascript:;" @click="bangumiStore.showNotif(false)">
          点击此处查看通知
        </a>
      </li>
      <li>
        <strong>如果出现bug</strong>
        可以尝试
        <a href="javascript:;" @click="resetData"> 点击此处重载数据 </a>
      </li>
      <li>
        <strong>如果想看的番剧小窝里没有</strong>
        <p>因为服务器每月流量有限，所以并没有订阅一些冷门新番和大部分老番。</p>
        <p>
          如果想看可以
          <a href="javascript:;">联系我📧</a>，或在
          <a href="https://pan.cycg.xyz/" target="_blank"> 次元图书馆 </a> |
          <a href="https://pan.timero.xyz/onedrive/vcr_lib_001" target="_blank">
            ximu's pan
          </a>
          找找看， 也可以在
          <a href="https://mikanani.me/" target="_blank"> 蜜柑计划 </a> 下载。
        </p>
      </li>
      <li v-for="(item, index) in bangumiStore.aboutList" :key="index">
        <template v-for="(tag, i) in item" :key="i">
          <template v-if="tag.tag === 'b'">
            <strong>{{ tag.content }}</strong>
          </template>
          <template v-else-if="tag.tag === 'p'">
            <p>{{ tag.content }}</p>
          </template>
          <template v-else-if="tag.tag === 'a'">
            <a :href="tag.link || 'javascript:;'" target="_blank">
              {{ tag.content }}
            </a>
          </template>
          <template v-else>
            {{ tag.content }}
          </template>
        </template>
      </li>
    </ul>
    <template v-if="bangumiStore.contact.length">
      <h2>联系我📧</h2>
      <div class="link-container">
        <div
          class="link-box"
          v-for="(item, index) in bangumiStore.contact"
          :key="index"
        >
          <a class="avatar-name" :href="item.link" target="_blank">
            <img
              class="avatar"
              :class="{ radiu: item.isRadiu || false }"
              :src="item.img"
            />
            <span class="name">{{ item.name }}</span>
          </a>
        </div>
      </div>
    </template>
    <template v-if="bangumiStore.friend.length">
      <h2>友情链接🌈</h2>
      <div class="link-container">
        <div
          class="link-box"
          v-for="(item, index) in bangumiStore.friend"
          :key="index"
        >
          <a class="avatar-name" :href="item.link" target="_blank">
            <img
              class="avatar"
              :class="{ radiu: item.isRadiu || false }"
              :src="item.img"
            />
            <span class="name">{{ item.name }}</span>
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.link-box {
  display: inline-block;
  margin: 10px;
  .avatar-name {
    height: 44px;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--color-text);
    .avatar {
      width: 44px;
      height: 44px;
      &.radiu {
        border-radius: 50%;
      }
    }
    .name {
      margin: 10px;
      transition: all 0.5s;
    }
  }
}

.markdown-content {
  max-width: 920px;
  margin: 0 auto;
  padding: 10px 30px;
  padding-bottom: 20px;
  border-radius: 20px;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  font-size: 16px;
  background-color: var(--color-background-soft);
  transition: background-color 0.5s;
}

@media (max-width: 500px) {
  .markdown-content {
    padding: 10px;
    padding-top: 5px;
  }
}

.markdown-content h2 {
  color: var(--color-heading);
  margin: 20px 5px 10px 5px;
  font-weight: bold;
  transition: all 0.5s;
}

.markdown-content strong {
  color: var(--color-heading);
  font-weight: bold;
  transition: all 0.5s;
}

.markdown-content p {
  margin: 10px 5px;
}

.markdown-content ul {
  list-style-type: disc;
  padding-left: 20px;
}

.markdown-content li {
  margin-bottom: 15px;
}

.markdown-content a {
  color: var(--el-color-primary);
  text-decoration: none;
  display: inline-block;
}

.markdown-content a:hover {
  text-decoration: underline;
}

.markdown-content code {
  background-color: var(--color-background);
  border: 1px solid var(--color-background-mute);
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 90%;
  transition: all 0.5s;
}
</style>
