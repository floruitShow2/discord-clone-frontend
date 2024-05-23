/**
 * @description 执行策略列表中每一个可能的操作
 * @param actions
 */
export const execStrategyActions = (actions: Common.StrategyAction[]) => {
  actions.forEach((item) => {
    const [flag, action] = item
    if (flag) action()
  })
}
