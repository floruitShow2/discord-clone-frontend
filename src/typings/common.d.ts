declare namespace Common {
  /**
   * @description 策略模式类型
   * @params [状态, 状态为 true 时执行的回调函数]
   */
  type StrategyAction = [boolean, () => void]
}
