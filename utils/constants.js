/**
 * 常量定义
 */

// 游戏状态
const GAME_STATUS = {
  PLAYING: 'playing',
  WIN: 'win',
  LOSE_TIMEOUT: 'lose_timeout',   // 时间耗尽
  LOSE_ERROR: 'lose_error'         // 错误超限
}

// 热区状态
const ZONE_STATUS = {
  EMPTY: 'empty',       // 未填充
  CORRECT: 'correct',   // 已正确匹配
  WRONG: 'wrong'        // 匹配错误（临时状态）
}

// 饰品栏尺寸
const ACCESSORY_BAR = {
  ITEM_WIDTH: 120,      // rpx
  ITEM_HEIGHT: 120,     // rpx
  ITEM_GAP: 16          // rpx
}

// 动画时长（毫秒）
const ANIM_DURATION = {
  SNAP: 200,            // 吸附动画
  RETURN: 300,          // 回弹动画
  SUCCESS: 400,         // 成功闪烁
  ERROR_SHAKE: 300      // 错误抖动
}

module.exports = {
  GAME_STATUS,
  ZONE_STATUS,
  ACCESSORY_BAR,
  ANIM_DURATION
}
