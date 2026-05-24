App({
  onLaunch() {
    // 初始化本地进度数据
    const progress = wx.getStorageSync('puzzle_progress')
    if (!progress) {
      this.initDefaultProgress()
    }
  },

  // 首次使用时初始化默认进度
  initDefaultProgress() {
    const defaultProgress = {
      currentLevel: 1,
      levels: {
        1: { unlocked: true, completed: false }
      }
    }
    wx.setStorageSync('puzzle_progress', defaultProgress)
  },

  globalData: {
    userInfo: null
  }
})
