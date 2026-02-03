# 成语智慧阁

一个功能完整、用户友好的成语学习与查询网站，采用传统中国风格设计，配以萤火虫金色发光背景特效。

## 功能特性

### 核心功能
- **成语查询**：支持前缀匹配查询，智能提示，搜索历史
- **成语详情**：展示拼音、解释、出处、例句
- **成语接龙**：经典接龙游戏，积分系统，提示功能
- **收藏管理**：收藏夹管理，学习进度跟踪，导出功能

### 设计特色
- **传统中国色**：朱砂红、墨黑、米宣白、古铜金
- **萤火虫背景**：温暖的金色光点自然飘动
- **毛玻璃效果**：现代透明设计融入传统元素
- **响应式布局**：适配桌面、平板、手机

## 技术栈

- **前端**：原生 HTML5 / CSS3 / JavaScript (ES6+)
- **字体**：思源宋体 / 思源黑体 (Google Fonts)
- **API**：Alapi 成语词典 API
- **存储**：LocalStorage 本地存储

## 项目结构

```
idiom-learning-portal/
├── index.html              # 主页面
├── css/
│   └── main.css            # 样式文件
├── js/
│   ├── config.js           # 配置文件
│   ├── firefly.js          # 萤火虫背景特效
│   ├── storage.js          # 本地存储模块
│   ├── api.js              # API调用模块
│   ├── ui.js               # UI交互模块
│   ├── search.js           # 搜索功能模块
│   ├── game.js             # 游戏模块
│   └── main.js             # 主入口
└── README.md               # 项目说明
```

## 配置说明

### API Token
在 `js/config.js` 中配置 API Token：

```javascript
const CONFIG = {
    api: {
        baseUrl: 'https://v3.alapi.cn/api/idiom',
        token: 'your_token_here',
        timeout: 10000
    }
};
```

## 本地运行

1. 克隆或下载项目
2. 在浏览器中打开 `index.html`
3. 或使用本地服务器：

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 性能优化

- Canvas 萤火虫动画使用 requestAnimationFrame
- 图片懒加载
- CSS 动画优化
- LocalStorage 数据压缩

## 无障碍支持

- 支持 prefers-reduced-motion
- 键盘导航
- 清晰的焦点状态
- 适当的颜色对比度

## 许可证

MIT License

## 致谢

- [Alapi](https://www.alapi.cn/) 提供成语词典 API
- [Google Fonts](https://fonts.google.com/) 提供中文字体
