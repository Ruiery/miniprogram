/**
 * result-modal 组件
 * 功能：胜利/失败结算弹窗
 * 事件：nextLevel、retry、back
 */
Component({
  properties: {
    // 弹窗显示状态
    visible: {
      type: Boolean,
      value: false
    },
    // 结果状态：win | timeout | error
    status: {
      type: String,
      value: 'win'
    },
    // 关卡名称
    levelName: {
      type: String,
      value: ''
    },
    // 已用时间（秒）
    timeUsed: {
      type: Number,
      value: 0
    },
    // 错误次数
    errorsUsed: {
      type: Number,
      value: 0
    },
    // 最大错误数
    maxErrors: {
      type: Number,
      value: 5
    },
    // 已匹配数（失败时显示进度）
    matchedCount: {
      type: Number,
      value: 0
    },
    // 总热区数
    totalZones: {
      type: Number,
      value: 0
    }
  },

  data: {
    timeDisplay: '00:00'
  },

  observers: {
    'timeUsed'(val) {
      this.setData({
        timeDisplay: this.formatTime(val || 0)
      })
    }
  },

  methods: {
    /**
     * 下一关
     */
    onNext() {
      this.triggerEvent('nextLevel')
    },

    /**
     * 重试
     */
    onRetry() {
      this.triggerEvent('retry')
    },

    /**
     * 返回选关
     */
    onBack() {
      this.triggerEvent('back')
    },

    /**
     * 阻止弹窗遮罩层滚动穿透
     */
    preventMove() {},

    /**
     * 格式化时间
     */
    formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0')
      const s = (seconds % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    }
  }
})
