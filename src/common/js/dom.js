/*
 * @Author      : Jerrychan
 * @Date        : 2019-01-29 17: 24: 26
 * @LastEditors : Jerrychan
 * @LastEditTime: 2019-01-30 09: 19: 26
 * @Description : dom操作的代码
 */
/**
 * 添加class
 * @param {*} el 
 * @param {*} className 
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}
/**
 * 判断是否有此class
 * @param {*} el 
 * @param {*} className 
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
