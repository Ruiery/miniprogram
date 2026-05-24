const levelsData = require('../../data/levels')
const storage = require('../../utils/storage')

Page({
  data: {
    levels: []
  },

  onLoad() {
    this.loadLevels()
  },

  onShow() {
    // 每次显示时刷新进度（从游戏页返回时需要更新）
    this.loadLevels()
  },

  /**
   * 加载关卡列表并合并进度状态
   */
  loadLevels() {
    const progress = storage.getProgress()
    const levels = levelsData.map(level => {
      const statusData = progress.levels[level.id]
      let status = 'locked'

      if (statusData && statusData.unlocked) {
        status = statusData.completed ? 'completed' : 'current'
      }

      return {
        id: level.id,
        name: level.name,
        status: status,
        bestTime: statusData ? statusData.bestTime : null,
        bestErrors: statusData ? statusData.bestErrors : null,
        bestTimeStr: statusData && statusData.bestTime
          ? this.formatTime(statusData.bestTime)
          : ''
      }
    })

    this.setData({ levels })
  },

  /**
   * 点击关卡卡片
   */
  onLevelTap(e) {
    const { id } = e.currentTarget.dataset
    const progress = storage.getProgress()
    const levelStatus = progress.levels[id]

    if (!levelStatus || !levelStatus.unlocked) {
      wx.showToast({ title: '请先完成前一关', icon: 'none' })
      return
    }

    wx.navigateTo({
      url: `/pages/game/game?levelId=${id}`
    })
  },

  /**
   * 格式化时间（秒 → MM:SS）
   */
  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
})
