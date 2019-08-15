import { saveSearch, deleteSearch, clearSearch }  from '@/assets/js/cache'
function findIndex(list: any[], song: any) {
  return list.findIndex((item:any) => {
    return item.id === song.id;
  })
}
export const insertSong = ({commit,state}:any, song: any) => {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 当前播放
  let currentSong = playlist[currentIndex]
  // 查找播放列表中是否有插入的
  let fpIndex = playlist.length > 0 ? findIndex(playlist, song) : 0
  if(fpIndex > -1){// 如果歌单中有
    playlist.splice(fpIndex, 1)
    if(currentIndex < fpIndex){
      currentIndex++
    }
  }else {
    currentIndex++
  }
  playlist.splice(currentIndex, 1, song)
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  let fsIndex =sequenceList.length > 0 ? findIndex(sequenceList, song) : 0;

  sequenceList.splice(currentSIndex, 0, song);
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fpIndex, 1);
    } else {
      sequenceList.splice(fpIndex + 1, 1);
    }
  }
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit("setSequenceList", sequenceList)
  commit('setFullScreen', true)
  commit('setPlaying', true)
}
// 删除歌曲
export const deleteSong = ({commit, state}: {commit: any, state: any}, song: any) => {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex: number = state.currentIndex
  // 删除的歌曲在播放列表的索引
  let pIndex = findIndex(playlist, song)
  let sIndex = findIndex(sequenceList, song)
  playlist.splice(pIndex, 1)
  sequenceList.splice(sIndex, 1)
  // 播放状态
  const playing = playlist.length > 0
  {(currentIndex > pIndex || currentIndex === playlist.length ) && currentIndex--}
  commit('setPlaylist', playlist)
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlaying', playing)

}
// 清空列表
export const deleteSongList = ({ commit, state }: { commit: any, state: any }, song: any) => {
  commit('setPlaylist', [])
  commit('setSequenceList', [])
  commit('setCurrentIndex', -1)
  commit('setPlaying', false)
}

// 选中播放
export const sequencePlay = function ({ commit, state }:{ commit: any, state: any}, { list, index }: {list: any[], index: number}) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const len = playlist.length

  playlist = playlist.concat(list)
  sequenceList = sequenceList.concat(list)
  currentIndex = len + 1
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit("setSequenceList", sequenceList)
  commit('setFullScreen', true)
  commit('setPlaying', true)
}

export const saveSearchHistory = function ({ commit }: {commit: any}, query: any) {
  commit('setSearchHistory', saveSearch(query))
}

export const deleteSearchHistory = function ({ commit }: {commit: any}, query: any) {
  commit('setSearchHistory', deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }: {commit: any}) {
  commit('setSearchHistory', clearSearch())
}