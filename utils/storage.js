/**
 * 本地存储工具封装
 */
const STORAGE_KEYS = {
  PROGRESS: 'puzzle_progress'
}

const storage = {
  /**
   * 获取游戏进度
   * @returns {Object} 进度数据
   */
  getProgress() {
    const data = wx.getStorageSync(STORAGE_KEYS.PROGRESS)
    if (!data) {
      return this.getDefaultProgress()
    }
    return data
  },

  /**
   * 保存游戏进度
   * @param {Object} progress - 进度数据
   */
  saveProgress(progress) {
    wx.setStorageSync(STORAGE_KEYS.PROGRESS, progress)
  },

  /**
   * 获取默认进度（首次使用）
   */
  getDefaultProgress() {
    return {
      currentLevel: 1,
      levels: {
        1: { unlocked: true, completed: false }
      }
    }
  },

  /**
   * 获取指定关卡的状态
   * @param {number} levelId - 关卡ID
   * @returns {Object|null}
   */
  getLevelStatus(levelId) {
    const progress = this.getProgress()
    return progress.levels[levelId] || null
  },

  /**
   * 更新关卡状态（通关时调用）
   * @param {number} levelId - 关卡ID
   * @param {Object} result - 通关结果 { timeUsed, errorsUsed }
   */
  completeLevel(levelId, result) {
    const progress = this.getProgress()
    const levelData = progress.levels[levelId] || {}

    const isNewComplete = !levelData.completed

    progress.levels[levelId] = {
      unlocked: true,
      completed: true,
      bestTime: levelData.bestTime
        ? Math.min(levelData.bestTime, result.timeUsed)
        : result.timeUsed,
      bestErrors: levelData.bestErrors
        ? Math.min(levelData.bestErrors, result.errorsUsed)
        : result.errorsUsed,
      completedAt: levelData.completedAt || Date.now()
    }

    // 自动解锁下一关
    const nextLevelId = levelId + 1
    if (!progress.levels[nextLevelId]) {
      progress.levels[nextLevelId] = { unlocked: true, completed: false }
    }

    progress.currentLevel = Math.max(progress.currentLevel, nextLevelId)
    this.saveProgress(progress)

    return isNewComplete
  },

  /**
   * 重置所有进度（调试用）
   */
  resetProgress() {
    wx.removeStorageSync(STORAGE_KEYS.PROGRESS)
  }
}

module.exports = storage
