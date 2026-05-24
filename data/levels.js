/**
 * 关卡数据配置
 * 每个关卡包含：立绘、热区（编号区域）、可用饰品池
 */
const levels = [
  {
    id: 1,
    name: "画中点翠",
    chapter: "拼图匹配",
    page: 4,
    timeLimit: 355,
    maxErrors: 5,
    characterImage: "/images/characters/level_1.png",
    characterWidth: 750,
    characterHeight: 900,

    // 热区定义（相对于立绘的百分比坐标）
    zones: [
      { id: 1, x: 280, y: 80, width: 80, height: 60, correctItemId: "a001" },
      { id: 2, x: 370, y: 85, width: 70, height: 55, correctItemId: "a002" },
      { id: 3, x: 340, y: 140, width: 90, height: 50, correctItemId: "a003" }
    ],

    // 本关饰品池（底部可选饰品，含正确项+干扰项）
    availableItems: ["a001", "a002", "a003", "a004", "a005", "a006"]
  },
  {
    id: 2,
    name: "凤冠霞帔",
    chapter: "拼图匹配",
    page: 5,
    timeLimit: 300,
    maxErrors: 5,
    characterImage: "/images/characters/level_2.png",
    characterWidth: 750,
    characterHeight: 900,

    zones: [
      { id: 1, x: 270, y: 75, width: 85, height: 65, correctItemId: "a007" },
      { id: 2, x: 365, y: 80, width: 75, height: 55, correctItemId: "a008" },
      { id: 3, x: 320, y: 135, width: 95, height: 55, correctItemId: "a009" },
      { id: 4, x: 290, y: 190, width: 80, height: 50, correctItemId: "a010" }
    ],

    availableItems: ["a007", "a008", "a009", "a010", "a011", "a012", "a013"]
  },
  {
    id: 3,
    name: "簪花仕女",
    chapter: "拼图匹配",
    page: 6,
    timeLimit: 300,
    maxErrors: 5,
    characterImage: "/images/characters/level_3.png",
    characterWidth: 750,
    characterHeight: 900,

    zones: [
      { id: 1, x: 275, y: 80, width: 82, height: 58, correctItemId: "a014" },
      { id: 2, x: 368, y: 82, width: 72, height: 56, correctItemId: "a015" },
      { id: 3, x: 330, y: 142, width: 88, height: 52, correctItemId: "a016" },
      { id: 4, x: 295, y: 195, width: 78, height: 48, correctItemId: "a017" },
      { id: 5, x: 360, y: 200, width: 70, height: 45, correctItemId: "a018" }
    ],

    availableItems: ["a014", "a015", "a016", "a017", "a018", "a019", "a020", "a021"]
  }
]

module.exports = levels
