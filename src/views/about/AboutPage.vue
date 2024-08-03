<script setup lang="ts">
import { useBangumiStore, useFavoriteStore, useSettingStore } from '@/stores'

const bangumiStore = useBangumiStore()
const favoriteStore = useFavoriteStore()

// 防止用户多次点击重载数据，
// 重载之后页面会自动刷新所以此处只需能点一次
let isResetting = false
const resetData = () => {
  if (isResetting) {
    ElMessage({
      type: 'warning',
      offset: 66,
      message: '正在重载数据'
    })
    return
  }
  isResetting = true
  ElMessage({
    type: 'success',
    offset: 66,
    message: '开始重载数据'
  })
  bangumiStore.removeData()
  bangumiStore.initData()
}

const removeFav = () => {
  favoriteStore.removeFav()
  ElMessage({
    type: 'success',
    offset: 66,
    message: '收藏已清空'
  })
}

const settingStore = useSettingStore()
</script>
<template>
  <div class="markdown-content">
    <h2>关于【番剧小窝】🎉</h2>
    <ul>
      <li>
        <strong>关于下载</strong>
        <p>
          建议下载观看，右键点击或长按文件下载，暂不支持文件夹与多个文件下载
        </p>
        <p>
          下载时请尽量使用<code>IDM</code>等多线程下载软件
          <a href="/Soft/IDM/" target="_blank"> IDM </a>
          |
          <a href="/Soft/FDM/" target="_blank"> FDM </a>
        </p>
        <p>
          下载超时时可以在<code>IDM</code>右键下载文件刷新下载地址，然后重新回到本站右键点击对应文件下载
        </p>
      </li>
      <li>
        <strong>关于新番更新</strong>
        <p>一般在当天半夜更新，建议次日早上看</p>
        <p>部分新番因巴哈姆特没有，字幕组更新会较晚</p>
      </li>
      <li>
        <strong>可以拼接截图字幕的小工具：</strong>
        <a href="javascript:;" @click="$router.push('/utils-sub-crop')">
          字幕拼接小工具🎬
        </a>
      </li>
      <li>
        <strong>如果出现bug</strong>
        可以尝试
        <a href="javascript:;" @click="resetData"> 点击此处重载数据 </a>
      </li>
      <li>
        <strong>如果收藏的番剧太多</strong>
        可以
        <a href="javascript:;" @click="removeFav"> 点击此处清空收藏 </a>
      </li>
      <li>
        <strong>关于番剧卡片下方的番剧名是否显示</strong>
        ，
        <a href="javascript:;" @click="settingStore.toggleShowBgmName">
          切换番剧名 显示/隐藏
        </a>
      </li>
    </ul>
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
