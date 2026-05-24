# Findings & Decisions

## Requirements
- 古风饰品拖拽匹配类微信小程序
- 参考「娘娘爱拼图」玩法：将底部饰品拖拽到立绘上的编号热区
- 限时 + 限制错误次数（5次）
- 拖拽交互方式（非点击交换）
- 纯本地存储，无后端，无广告，无云开发
- 个人全栈开发（睿蕊一人）

## Research Findings
- 参考小程序「娘娘爱拼图」核心玩法：
  - 页面结构：面包屑导航(拼图匹配 > 第N页 > 关卡名) → 提示文字"选择正确的饰品" → 计时器+错误计数 → 立绘+编号热区 → 底部饰品栏横向滚动
  - 功能按钮区域：加时、提示×4、加次数（参考图有这些，但我们不做广告，改为其他获取方式或去掉）
  - 左右翻页切换关卡/页面
- 参考小程序「拼图美人」（美女拼图大闯关）：
  - 点击图块交换位置完成拼图
  - 解锁美图+壁纸下载
  - 益智解压型

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 微信小程序原生框架 (WXML+WXSS+JS) | 个人开发无需跨端抽象层 |
| CSS 绝对定位叠加渲染游戏界面 | 拖拽 touch 事件原生支持好，调试直观 |
| wx.setStorageSync 本地存储 | 无需后端，本地缓存够用 |
| 关卡数据 JS 模块导出 JSON | 打包在小程序包内 |
| 热区坐标用百分比定位 | 适配不同屏幕宽度 |
| 拖拽交互 (touchstart/move/end) | 用户明确选择此方案 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| 图片无法被模型直接查看 | 使用 image 工具分析截图内容 |
| web_search 初始不可用 | 配置 Tavily API Key 解决 |

## Resources
- 设计方案文档: /home/crr/miniprogram/design.md
- 微信小程序官方文档: https://developers.weixin.qq.com/miniprogram/dev/framework/
- 微信小程序 Canvas vs CSS 方案对比: CSS 更适合拖拽场景

## Visual/Browser Findings
- 参考截图分析（娘娘爱拼图）:
  - 顶部：标题"娘娘爱拼图"
  - 面包屑：拼图匹配 → 第4页 → **画中点翠**（当前关卡）
  - 提示："选择正确的饰品"
  - 状态栏：⏱ 时间 05:55 | ❌ 错误次数 0/5
  - 主画面：古风美人立绘，头部饰品区域分为编号热区(1-9)
  - 底部：饰品选择栏（横向滚动），多个饰品缩略图
  - 功能区：🔵加时 | 🟡提示×4 | 🔴加次数
  - 翻页：左右箭头切换页面

---
*Update this file after every 2 view/browser/search operations*
