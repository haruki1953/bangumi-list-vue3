<script setup lang="ts">
// 打开链接
const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>
<template>
  <div class="markdown-content">
    <h2>关于【小祥の小窝】</h2>
    <p>是一个基于onedrive的番剧小窝</p>
    <h2>注意事项🦽</h2>
    <ul>
      <li>
        <strong>关于下载</strong>
        <p>
          建议下载观看，右键点击或长按文件下载，暂不支持文件夹与多个文件下载
        </p>
        <p>
          下载时请尽量使用<code>IDM</code>等多线程下载软件
          <a href="/Soft/IDM/IDM_v6.40.11_Repack.exe">IDM下载</a> |
          <a
            href="/Soft/FDM/Free%20Download%20Manager%20-%20FDM_6.20.1.5546_Apkpure.apk"
            >FDM（安卓）</a
          >
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
        <strong>如果有想看的番剧但小窝里没有怎么办？</strong>
        <p>因为服务器每月流量有限，所以并没有订阅一些冷门新番和大部分老番。</p>
        <p>
          如果想看可以
          <a href="javascript:;">联系我📧</a>，或在
          <a href="https://pan.cycg.xyz/"> 次元图书馆 </a> |
          <a href="https://pan.timero.xyz/onedrive/vcr_lib_001"> ximu's pan </a>
          找找看， 也可以在
          <a href="https://mikanani.me/"> 蜜柑计划 </a> 下载
        </p>
      </li>
      <li>……</li>
    </ul>
    <h2>联系我📧</h2>
    <div class="contact-container">
      <div class="contact-box" style="display: inline-block; margin: 10px">
        <div
          href="https://twitter.com/harukiO_0"
          target="_blank"
          title="haruki🐻"
          style="
            height: 44px;
            display: flex;
            align-items: center;
            text-decoration: none;
          "
        >
          <img
            src="https://static.sakiko.top/sakiko/haruki_korisu_ts.jpg"
            width="44px"
            height="44px"
          />
          <span style="margin: 10px">haruki🐻</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my_avatar {
  width: 44px;
  border-radius: 50%;
}

.markdown-content {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  font-size: 16px;
}

.markdown-content h2 {
  color: var(--color-heading);
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}

.markdown-content strong {
  color: var(--color-heading);
  font-weight: bold;
}

.markdown-content p {
  margin: 10px 0;
}

.markdown-content ul {
  list-style-type: disc;
  padding-left: 20px;
}

.markdown-content li {
  margin-bottom: 10px;
}

.markdown-content a {
  color: var(--el-color-primary);
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

.markdown-content code {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-background-mute);
  border-radius: 3px;
  padding: 2px 4px;
  font-size: 90%;
  transition: all 0.5s;
}
</style>
