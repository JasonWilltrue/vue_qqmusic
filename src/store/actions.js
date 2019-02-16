import * as types from './mutations-types.js'
import {
  utilsArray
} from "common/js/utils";

//找到新列表中的指定索引
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  // 避免随机播放时，点击歌单，播放歌曲乱序
  if (state.mode === 2) {
    let randomList = utilsArray.shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)


}

// 随机播放全部按钮
export const randomPlay = function ({
  commit
}, {
  list
}) {
  commit(types.SET_MODE, 2) //随机播放
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYLIST, utilsArray.shuffle(list))
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
}
