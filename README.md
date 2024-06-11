# 一、项目介绍
这个项目叫 bangumi-list。

自己的番剧小窝用的是alist，这种返璞归真的方法导致了番剧的展示不太优雅。
bangumi-list 将会完善这一方面。

bangumi-list 是一个前端，用于整理与显示番剧数据，通过番剧卡片中的 “下载/观看”按钮 可以跳转到alist对应页面。
bangumi-list 通过请求服务上的一些文件来获取番剧数据，没有真正意义上的后端，番剧数据是通过一个python爬虫生成的（伪后端）。

网站地址： https://bangumi.sakiko.top/

项目地址
- 伪后端（python爬虫）
	https://github.com/haruki1953/crawl_post_generator
- 前端（vue3 + ts + element-plus）
	https://github.com/haruki1953/bangumi-list-vue3
- 开发记录
	https://github.com/haruki1953/240525-bangumi-list-dev-diary

# 二、伪后端
伪后端是通过多个`crawl_info.json`来获取数据的

原本的功能为生成番剧介绍，保存在crawl_info中saveFile所指的readme.md文件中，alist在打开目录时会解析readme.md文件，以此在对应番剧目录展示番剧介绍

现在也可以将爬取的番剧数据保存，根据不同的源文件生成不同的`bgm_data-.json`，同时生成或修改`config.json`（保存最后修改时间，前端以此控制数据缓存）

## 启动前所需的配置
准备crawl_info.json [crawl_info.json数据结构](#crawl_info.json)

### 修改setting.py
```python
# crawl_info.json 保存爬取信息的json文件的路径
crawl_info_json = './test/crawl_info.json'

# 番剧数据文件保存路径
bgmDataSavePath = '/www/wwwroot/pan.sakiko.top/home/data'
# bgmDataSavePath = './data'

# alist网站的基础路径，用于截取alistPath
alistBasePath = '/home/onedrive/Sakiko'
# alist网站网址，用于与截取的路径拼接
alistWebUrl = 'https://bangumi.sakiko.top'
```
- crawl_info_json：在执行main.py不通过参数提供crawl_info时的默认文件路径，可以不配置，我也一般是通过参数来指定crawl_info文件路径
- bgmDataSavePath：爬取后生成的番剧数据文件的保存路径，小窝网站前端存放在 `/www/wwwroot/pan.sakiko.top/home/`，这里设置在其data目录下，前端会请求这里的文件，[config.json](#config.json)与[bgm_data-.json](#bgm_data-.json)都将存放在这里
- alistBasePath、alistWebUrl：生成的番剧数据中需要其对应的alist网站链接，因为之前的crawl_info中只有readme文件的保存路径，我也不想再一个个加了，所以就利用正则从其中截取路径。
	```
	如"saveFile": "/home/onedrive/Sakiko/Bangumi/番剧名/readme.md"
	我的alist是将/home/onedrive/Sakiko作为了主页，alistBasePath设置为这个，
	就会截取出 /Bangumi/番剧名 ，之后会和alistWebUrl拼接形成完整网址
	```

### 准备命令，命令参数说明：
- `sys.argv[1]`（可选）
	指定 `crawl_info.json` 文件的路径。
	示例`python main.py /path/to/crawl_info.json`
- `sys.argv[2]`（可选）
	设定运行模式，可选值为 BL 或 onlyBL
	当不指定时，程序只生成html（根据crawl_info保存在对应文件）
	当值为 BL 时，既保存html，也生成番剧数据（保存在bgmDataSavePath）
	当值为 onlyBL 时，只保存番剧数据

我是用过宝塔面板的计划任务执行的，执行命令如：
```sh
python3 /root/crawl_post_generator/main.py /home/onedrive/crawl_info_24四月.json BL
```


## 相关数据结构
### crawl_info.json
```json
[
    {
        "saveFile": "/home/onedrive/Sakiko/Bangumi/BUCCHIGIRI?!/readme.md",
        "urlList": [
            {
                "source": "bangumi",
                "url": "https://bangumi.tv/subject/436745",
                "alistPath": "/Bangumi/BUCCHIGIRI？!"
            }
            // ...
        ]
    }
    // ...
]
```
为一个数组，每一项中saveFile控制其保存在的文件
- saveFile：控制其保存在的文件
- urlList：数组，每个文件内可保存多条番剧介绍
- source：信息来源，因为这个脚本还可以爬取论坛的帖子（cycg次元茶馆），所以需要此字段进行标注，爬取bangumi时为bangumi
- url：爬取网站的链接
- alistPath（可选），在自动截取名称链接出问题时进行补正
	一般通过saveFile字段就可以截取出正确的alist路径，但极少数情况下会有问题（特殊字符导致alist网址路径与文件系统目录名不一致）。如果发现这种情况，就添加正确的alistPath
	注意：没有网址（在脚本内会拼接alistWebUrl）

### config.json
前端在每次打开时，都会请求config.json
config.json，主要负责保存生成的`bgm_data.json`番剧数据的信息，前端据此请求对应的文件，并通过其中的最后修改时间，来控制在必要时再请求数据

### config.json设计（二期）
 [config.json](public\data\config.json) 
添加了：友情链接，联系信息，公告，版本控制
```json
{
	"version": "标识版本的字符串",
	"notification": {
		"id": "通知的标识",
		"title": "通知标题",
		"message": "通知内容",
		"type": "通知类型"
	},
	"contact": [
		{
			"link": "链接",
			"img": "图标",
			"name": "联系方式名称",
			"isRadiu": 是否圆角
		}
	],
	"friend": [
		{
			"link": "链接",
			"img": "图标",
			"name": "联系方式名称",
			"isRadiu": 是否圆角
		}
	],
	"bgmFileList": [
		{
			"fileName": "文件名，如 bgm_data-crawl_info_24四月.json",
			"lastModified": "最后修改时间",
			"showOnHome": 是否在首页显示（需手动修改）
		}
		// ...
	]
}
```

- version版本控制
	前端判断请求的数据中version不一样，则重置数据

- notification通知公告
	前端获取到通知时，判断其是否和原先保存的id一致。不一致（或没有）则保存并为其加上 isRead: false。
	在layout中初始化数据后，判断isRead为false时显示通知，通过onClose回调来设置isRead=true

- contact联系信息、friend友情链接，将在前端关于页面使用

- bgmFileList番剧数据的信息


### bgm_data-.json
bgm_data-.json保存番剧数据（二期）
```json
[
	{
		"id": "bangumi番剧ID，也在前端里用作id",
		"alistPath": "对应番剧的alist网站路径（二期变为了必须为完整网站路径）如：https://bangumi.sakiko.top/Bangumi/GIRLS%20BAND%20CRY",
		"bgmUrl": "bangumi番剧链接",
		"img": "番剧图片",
		"name": "番剧名（日语）",
		"chineseName": "中文名",
		"episode": "话数",
		"date": "放送开始日期",
		"weekday": "放送星期",
		"score": "评分",
		"tagList": ['标签1', '标签2'],
		"aliasList": ['别名1', '别名2'],
		// 为了精简，后面的没有保存
		"content": "番剧介绍",
		"charsInfo": [
			{
				"img": "角色的图片"
			}
		],
		"comments": [
			{
				"img": "用户头像",
				"name": "用户名",
				"content": "评论内容"
			}
		]
	}
]
```
还是保持精简比较好，评论什么的太大了，没有保存


# 三、前端
**数据番剧数据获取：** 请求获取config.json，并根据其内容获取bgm_data.json，通过判断lastModified在必要时重新获取……
[03-前端](03-前端.md)

### 安装依赖
```sh
pnpm install
```

### 编译和热重载用于开发
```sh
pnpm dev
```

### 类型检查、编译和压缩用于生产
```sh
pnpm build
```

## 相关设置
/index.html 中配置网站图标、TDK标签SEO优化、Discord嵌入
Discord嵌入： https://docs.widgetbot.io/

/src/config/index.js 中配置伪后端文件地址、网站名称、logo图标、联系方式（菜单栏右侧）

关于页面需自行在 /src/view/about/AboutPage.vue 修改

网站通知信息、关于页面中的联系信息、友情链接，在 [config.json](#config.json) 中配置
