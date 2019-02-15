export const utilsNumber = {
  /**
   * 返回一个 [min, max] 之间的随机整数
   * @param  {number} min 下界
   * @param  {number} max 上界
   */
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

export const utilsArray = {
  /**
   * 克隆数组
   * @param  {array} arr 原数组
   * @return {array}     新数组
   */
  cloneArr(arr) {
    // 从第一个字符就开始 copy
    // slice(start,end) 方法可从已有的数组中返回选定的元素。
    return arr.slice(0)
  },

  /**
   * 洗牌函数
   * @param  {Array} arr 原数组
   * @param  {boolean} flag 是否改变原数组，默认不改变
   * @return {Array}     新数组
   */
  shuffle(arr, flag = false) {
    let newArr = []
    flag ? (newArr = arr): (newArr = this.cloneArr(arr))

    for (let i = 0; i < newArr.length; i++) {
      let    j    = utilsNumber.getRandom(0, i)
      let    temp = newArr[i]
      newArr[i]   = newArr[j]
      newArr[j]   = temp
    }
    return newArr
  },

  /**
   * 随机获取数组成员
   * @param  {array} arr 传入数组
   * @return {[type]}    一个随机成员
   */
  randomMember(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }
}
