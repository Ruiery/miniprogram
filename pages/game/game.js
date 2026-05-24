/**
 * 游戏主界面
 * 核心功能：拖拽引擎 + 匹配判定 + 计时/错误系统
 */
const levelsData = require('../../data/levels')
const itemsData = require('../../data/items')
const storage = require('../../utils/storage')
const { GAME_STATUS, ZONE_STATUS } = require('../../utils/constants')

Page({
  data: {
    // 关卡数据
    level: null,
    zones: [],

    // 热区状态
    zoneStates: [],

    // 饰品列表
    accessories: [],

    // 拖拽状态
    draggingGhost: {
      visible: false,
      x: 0,
      y: 0,
      image: '',
      size: 80,
      itemId: null
    },

    // 游戏状态
    errors: 0,
    timeUsed: 0,
    gameStatus: GAME_STATUS.PLAYING,

    // result-modal 组件数据
    showResult: false,
    resultStatus: 'win',
    completedCount: 0,

    // 热区坐标缓存（用于碰撞检测）
    zoneRects: []
  },

  // 当前关卡ID
  levelId: null,

  // 拖拽临时变量
  _dragStartPos: null,
  _dragItemId: null,

  onLoad(options) {
    this.levelId = parseInt(options.levelId) || 1
    this.initLevel()
  },

  onUnload() {
    const timer = this.selectComponent('#game-timer')
    if (timer) timer.destroy()
  },

  /**
   * 初始化关卡
   */
  initLevel() {
    const level = levelsData.find(l => l.id === this.levelId)
    if (!level) {
      wx.showToast({ title: '关卡不存在', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }

    // 构建饰品列表
    const accessories = level.availableItems.map(itemId => ({
      id: itemId,
      ...itemsData[itemId],
      used: false
    }))

    // 构建热区初始状态
    const zoneStates = level.zones.map(zone => ({
      id: zone.id,
      status: ZONE_STATUS.EMPTY,
      matchedItem: null,
      hover: false
    }))

    this.setData({
      level,
      zones: level.zones,
      zoneStates,
      accessories,
      errors: 0,
      timeUsed: 0,
      gameStatus: GAME_STATUS.PLAYING,
      showResult: false,
      resultStatus: 'win',
      completedCount: 0,
      draggingGhost: { visible: false, x: 0, y: 0, image: '', size: 80, itemId: null }
    })

    // 延迟获取热区坐标并启动计时器（等渲染完成）
    setTimeout(() => {
      this.cacheZoneRects()
      const timer = this.selectComponent('#game-timer')
      if (timer) timer.start()
    }, 300)
  },

  // ==================== 拖拽引擎 ====================

  onDragStart(e) {
    if (this.data.gameStatus !== GAME_STATUS.PLAYING) return

    const { itemId } = e.currentTarget.dataset
    const item = this.data.accessories.find(a => a.id === itemId)
    if (!item || item.used) return

    const touch = e.touches[0]
    this._dragItemId = itemId
    this._dragStartPos = { x: touch.clientX, y: touch.clientY }

    this.setData({
      'draggingGhost.visible': true,
      'draggingGhost.x': touch.clientX - 40,
      'draggingGhost.y': touch.clientY - 40,
      'draggingGhost.image': item.image,
      'draggingGhost.size': 80,
      'draggingGhost.itemId': itemId
    })
  },

  onDragMove(e) {
    if (!this.data.draggingGhost.visible) return

    const touch = e.touches[0]
    this.setData({
      'draggingGhost.x': touch.clientX - 40,
      'draggingGhost.y': touch.clientY - 40
    })

    this.checkHover(touch.clientX, touch.clientY)
  },

  onDragEnd(e) {
    if (!this.data.draggingGhost.visible) return

    const touch = e.changedTouches[0]
    const hitZoneId = this.getHitZone(touch.clientX, touch.clientY)

    this.setData({ 'draggingGhost.visible': false })
    this.clearHover()

    if (hitZoneId !== null) {
      this.doMatch(hitZoneId, this._dragItemId)
    }

    this._dragItemId = null
    this._dragStartPos = null
  },

  // ==================== 碰撞检测 ====================

  cacheZoneRects() {
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.zone').boundingClientRect(rects => {
      if (rects && rects.length > 0) {
        this.zoneRects = rects
      }
    }).exec()
  },

  getHitZone(x, y) {
    for (let i = 0; i < this.zoneRects.length; i++) {
      const rect = this.zoneRects[i]
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return this.data.zones[i].id
      }
    }
    return null
  },

  checkHover(x, y) {
    const hitZoneId = this.getHitZone(x, y)
    const zoneStates = this.data.zoneStates.map(zs => {
      if (zs.status !== ZONE_STATUS.EMPTY) return { ...zs, hover: false }
      return { ...zs, hover: zs.id === hitZoneId }
    })
    this.setData({ zoneStates })
  },

  clearHover() {
    const zoneStates = this.data.zoneStates.map(zs => ({ ...zs, hover: false }))
    this.setData({ zoneStates })
  },

  // ==================== 匹配判定 ====================

  doMatch(zoneId, itemId) {
    const zone = this.data.zones.find(z => z.id === zoneId)
    const zoneStateIndex = this.data.zoneStates.findIndex(zs => zs.id === zoneId)

    if (this.data.zoneStates[zoneStateIndex].status !== ZONE_STATUS.EMPTY) return

    if (zone.correctItemId === itemId) {
      this.handleCorrectMatch(zoneStateIndex, itemId)
    } else {
      this.handleWrongMatch(zoneStateIndex)
    }
  },

  handleCorrectMatch(zoneStateIndex, itemId) {
    const item = itemsData[itemId]

    const zoneStates = [...this.data.zoneStates]
    zoneStates[zoneStateIndex] = {
      ...zoneStates[zoneStateIndex],
      status: ZONE_STATUS.CORRECT,
      matchedItem: item,
      hover: false
    }

    const accessories = this.data.accessories.map(a =>
      a.id === itemId ? { ...a, used: true } : a
    )

    const completedCount = zoneStates.filter(zs => zs.status === ZONE_STATUS.CORRECT).length

    this.setData({ zoneStates, accessories, completedCount })

    const allDone = zoneStates.every(zs => zs.status === ZONE_STATUS.CORRECT)
    if (allDone) {
      setTimeout(() => this.handleWin(), 500)
    }
  },

  handleWrongMatch(zoneStateIndex) {
    const newErrors = this.data.errors + 1

    const zoneStates = [...this.data.zoneStates]
    zoneStates[zoneStateIndex] = { ...zoneStates[zoneStateIndex], status: ZONE_STATUS.WRONG }
    this.setData({ errors: newErrors, zoneStates })

    // 触发错误计数器抖动
    const errorComp = this.selectComponent('#error-counter')
    if (errorComp) errorComp.shake()

    setTimeout(() => {
      const restored = [...this.data.zoneStates]
      restored[zoneStateIndex] = { ...restored[zoneStateIndex], status: ZONE_STATUS.EMPTY }
      this.setData({ zoneStates: restored })
    }, 350)

    if (newErrors >= this.data.level.maxErrors) {
      setTimeout(() => this.handleLose('error'), 400)
    }
  },

  // ==================== 胜负结算 ====================

  handleWin() {
    const timer = this.selectComponent('#game-timer')
    const timeUsed = timer ? timer.getElapsed() : this.data.timeUsed

    this.setData({
      gameStatus: GAME_STATUS.WIN,
      showResult: true,
      resultStatus: 'win',
      timeUsed
    })

    if (timer) timer.stop()

    storage.completeLevel(this.levelId, {
      timeUsed,
      errorsUsed: this.data.errors
    })
  },

  handleLose(reason) {
    const timer = this.selectComponent('#game-timer')
    const timeUsed = timer ? timer.getElapsed() : this.data.timeUsed

    this.setData({
      gameStatus: reason === 'timeout' ? GAME_STATUS.LOSE_TIMEOUT : GAME_STATUS.LOSE_ERROR,
      showResult: true,
      resultStatus: reason,
      timeUsed
    })

    if (timer) timer.stop()
  },

  // ==================== 组件事件回调 ====================

  onTimeout() {
    if (this.data.gameStatus === GAME_STATUS.PLAYING) {
      this.handleLose('timeout')
    }
  },

  onTimerTick(e) {
    this.setData({ timeUsed: e.detail.elapsed })
  },

  onMaxErrors() {
    if (this.data.gameStatus === GAME_STATUS.PLAYING) {
      this.handleLose('error')
    }
  },

  onNextLevel() {
    const nextId = this.levelId + 1
    if (nextId <= levelsData.length) {
      this.levelId = nextId
      this.setData({ showResult: false })
      this.initLevel()
    } else {
      wx.showToast({ title: '恭喜通关全部关卡！', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }
  },

  onRetry() {
    this.setData({ showResult: false })
    this.initLevel()
  },

  goBack() {
    wx.navigateBack()
  },

  retryLevel() {
    wx.showModal({
      title: '提示',
      content: '确定要重玩本关吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ showResult: false })
          this.initLevel()
        }
      }
    })
  },

  preventMove() {}
})
