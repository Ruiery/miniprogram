/**
 * error-counter 组件
 * 功能：错误次数显示
 * 事件：maxReached（错误达到上限）
 */
Component({
  properties: {
    errors: {
      type: Number,
      value: 0,
      observer(newVal) {
        // 错误数变化时检查是否达到上限
        if (newVal >= this.properties.maxErrors) {
          // 下一帧触发，确保数据更新完成
          setTimeout(() => {
            this.triggerEvent('maxReached')
          }, 50)
        }
      }
    },
    maxErrors: {
      type: Number,
      value: 5
    }
  },

  data: {
    danger: false
  },

  // 错误图标抖动动画
  methods: {
    /**
     * 播放抖动动画
     */
    shake() {
      // 通过切换样式触发抖动
      this.setData({ danger: true })
      setTimeout(() => {
        this.setData({ danger: false })
      }, 300)
    }
  }
})
