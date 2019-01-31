/*
 * @Author      : Jerrychan
 * @Date        : 2019-01-29 17: 24: 26
 * @LastEditors : Jerrychan
 * @LastEditTime: 2019-01-31 09: 24: 31
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
/**
 * 获取/设置 自定义属性 data-${name} = val
 * 如果传入了 val 就设置自定义属性 `data-${name}` 的值为 val
 * 如果没有传入了 val 就获取自定义属性 `data-${name}` 的值
 */
export function getData(el, name, val) {
  if (val) {
    return el.setAttribute(`data-${name}`, val);
  } else {
    return el.getAttribute(`data-${name}`);
  }
}
