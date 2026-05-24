# Task Plan: 拼图匹配微信小程序开发

## Goal
基于「娘娘爱拼图」参考，开发一个古风饰品拖拽匹配类微信小程序 MVP：玩家在限定时间内将底部饰品拖拽到立绘对应热区，全部匹配正确即通关。纯本地存储，无后端，无广告。

## Current Phase
Phase 8

## Phases

### Phase 1: 项目初始化 + 数据层搭建
- [x] 创建小程序项目骨架（app.js/app.json/app.wxss/project.config.json）
- [x] 搭建目录结构（pages/components/data/utils/images）
- [x] 设计并实现关卡数据结构 data/levels.js（3个关卡）
- [x] 设计并实现饰品数据结构 data/items.js（21件饰品）
- [x] 实现本地存储工具 utils/storage.js（进度读写/初始化）
- [x] 实现常量定义 utils/constants.js
- **Status:** ✅ completed

### Phase 2: 首页/选关页开发
- [x] 首页布局：标题 + 关卡网格
- [x] 关卡卡片：已通关(⭐+成绩) / 可玩(高亮) / 未解锁(🔒)
- [x] 从 storage 读取进度并渲染解锁状态
- [x] 点击已解锁关卡跳转到游戏页 wx.navigateTo
- **Status:** ✅ completed

### Phase 3: 游戏主界面 — 页面骨架
- [x] 游戏页面基础布局（导航栏 + 面包屑 + 提示文字 + 状态栏）
- [x] 立绘展示区域（image 组件加载关卡立绘）
- [x] 热区覆盖层（根据 zones 数据动态生成编号区域 div）
- [x] 底部饰品栏（scroll-view 横向滚动 + 饰品缩略图）
- [x] 页面间参数传递（选关页 → 游戏页传递 levelId）
- **Status:** ✅ completed

### Phase 4: 拖拽引擎开发（核心难点）
- [x] 实现 touchstart/touchmove/touchend 事件绑定
- [x] 拖拽时创建 ghost 元素跟随手指
- [x] 通过 SelectorQuery 获取各 zone 屏幕坐标
- [x] touchmove 时实时碰撞检测（ghost vs zone boundingClientRect）
- [x] 悬停目标 zone 高亮提示
- [x] touchend 释放判定（命中/未命中）
- **Status:** ✅ completed

### Phase 5: 匹配判定 + 游戏逻辑
- [x] 匹配正确逻辑：饰品吸附到 zone + 锁定 + 成功动画
- [x] 匹配错误逻辑：饰品回弹 + 错误数+1 + 抖动反馈
- [x] 全部完成检测 → 触发胜利
- [x] 结算弹窗逻辑（胜利/失败两种状态）
- [x] 页面 onUnload 时清理
- **Status:** ✅ completed

### Phase 6: 组件开发
- [x] timer 组件：倒计时显示、开始/暂停/重置/销毁接口
- [x] error-counter 组件：错误次数显示、超限告警样式
- [x] result-modal 组件：胜利状态（用时+错误+下一关/重玩按钮）
- [x] result-modal 组件：失败状态（原因+重试/返回按钮）
- [x] 组件与页面通信（triggerEvent 事件机制）
- [x] game.wxml / game.js 对接组件接口
- **Status:** ✅ completed

### Phase 7: 进度系统串联
- [x] 通关保存：completed=true + bestTime + bestErrors + completedAt
- [x] 自动解锁下一关
- [x] 返回首页时刷新进度显示
- [x] 首次进入初始化默认进度（第1关解锁）
- **Status:** ✅ completed

### Phase 8: 多关卡数据填充 + UI 打磨
- [x] 图片资源准备（占位图：3立绘 + 21饰品 + 8UI素材）
- [x] 资源规划方案（resource_plan.md）
- [ ] 正式图片资源替换（立绘 + 饰品 + 图标 → 建议AI生图）
- [ ] 过渡动画优化
- [ ] 不同屏幕尺寸适配测试
- **Status:** ✅ 占位图完成，待替换正式资源

## Key Questions
1. 小程序包体积控制？图片资源多的话需要考虑分包或 CDN
2. 拖拽在真机上的触摸坐标精度？需要在真机上验证 touch 事件的 clientX/Y
3. 热区坐标用百分比还是固定像素？建议百分比适配不同宽度

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 微信小程序原生框架 | 个人开发无需跨端抽象，原生最轻量 |
| CSS 绝对定位叠加（非 Canvas） | 拖拽用原生 touch 事件更自然，调试直观 |
| 本地存储 wx.setStorageSync | 无需后端，本地缓存够用 |
| 关卡数据 JS 模块打包 | 打包在小程序包内，更新走版本迭代 |
| 热区坐标用百分比 | 适配不同屏幕宽度 |
| 拖拽交互方式 | 用户选择 B：拖拽饰品到热区 |
| 内联实现拖拽引擎 | game.js 已内联 touch 事件处理，无需独立 drag.js 模块 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (暂无) | | |

## Notes
- 所有代码输出到 /home/crr/miniprogram/
- 设计方案文档：/home/crr/miniprogram/design.md
- 不记录项目细节到 memory（用户要求不记忆此项目）
