/**
 * timer 组件
 * 功能：倒计时显示、开始/暂停/重置/销毁
 * 事件：timeout（倒计时结束）、tick（每秒滴答）
 */
Component({
  properties: {
    timeLimit: {
      type: Number,
      value: 300
    }
  },

  data: {
    remainingTime: 0,
    displayTime: '00:00',
    warning: false
  },

  lifetimes: {
    attached() {
      this._elapsed = 0
      this._timer = null
      this._running = false
      this.setData({
        remainingTime: this.properties.timeLimit,
        displayTime: this.formatTime(this.properties.timeLimit)
      })
    },
    detached() {
      this.destroy()
    }
  },

  methods: {
    /**
     * 启动倒计时
     */
    start() {
      if (this._running) return
      this._running = true
      this._elapsed = 0

      this._timer = setInterval(() => {
        this._elapsed++
        const remaining = Math.max(0, this.properties.timeLimit - this._elapsed)

        this.setData({
          remainingTime: remaining,
          displayTime: this.formatTime(remaining),
          warning: remaining <= 10
        })

        // 触发 tick 事件
        this.triggerEvent('tick', { remaining, elapsed: this._elapsed })

        // 倒计时结束
        if (remaining <= 0) {
          this.stop()
          this.triggerEvent('timeout')
        }
      }, 1000)
    },

    /**
     * 暂停（保留状态）
     */
    pause() {
      if (this._timer) {
        clearInterval(this._timer)
        this._timer = null
      }
      this._running = false
    },

    /**
     * 停止并重置
     */
    stop() {
      this.pause()
      this._elapsed = this.properties.timeLimit
    },

    /**
     * 完全销毁（组件卸载时自动调用）
     */
    destroy() {
      this.pause()
    },

    /**
     * 获取当前已用时间
     */
    getElapsed() {
      return this._elapsed
    },

    /**
     * 格式化时间（秒 → MM:SS）
     */
    formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, '0')
      const s = (seconds % 60).toString().padStart(2, '0')
      return `${m}:${s}`
    }
  }
})
