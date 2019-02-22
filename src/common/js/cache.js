/** 封装搜索结果缓存方法 */
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
//最多缓存15条数据  否则最老的数据被踢出
const SEARCH_MAX_LEN = 15

/**
 * 插入新元素到 arr[0] 并删除重复值，可控制数组最大长度
 * @param  {[type]} arr   要插入到哪个数组
 * @param  {[type]} val   要插入的值
 * @param  {fn} compareFn 比较函数
 * @param  {num} maxLen   数组最大长度
 * @return {[type]}           [description]
 */
function insertArr(arr, val, compareFn, maxLen = SEARCH_MAX_LEN) {
  let index = arr.findIndex(compareFn)
  //表示第一条数据 不用执行下去
  if (index === 0) {
    return
  }
  //删除之前的数据
  if (index > 0) {
    arr.splice(index, 1)
  }
  // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    // pop() 方法用于删除并返回数组的最后一个元素。
    arr.pop()
  }
}

function delArr(arr, compareFn) {
  let index = arr.findIndex(compareFn)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 获取
export function getStorage() {
  return storage.get(SEARCH_KEY, [])
}

// 增加
export function localSave(query) {
  // 当前 localstorage 数组
  let searches = storage.get(SEARCH_KEY, [])

  insertArr(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN) 

  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除
export function localDel(query) {
  // 当前 localstorage 数组
  let searches = storage.get(SEARCH_KEY, [])

  delArr(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空
export function localClear(query) {
  storage.remove(SEARCH_KEY)
  return []
}