const mutations = {
  setMusicList(state: any, musicList: any) {
    state.musicList = musicList;
  },
  setSinger(state: any, singer: any) {
    state.singer = singer;
  },
  setPlaylist(state: any, playlist: any[]) {
    state.playlist = playlist
  },
  setCurrentIndex(state: any, currentIndex: number) {
    state.currentIndex = currentIndex
  },
  setSequenceList(state: any, sequenceList: any[]) {
    state.sequenceList = sequenceList
  },
  setFullScreen(state: any, fullScreen: boolean) {
    state.fullScreen = fullScreen
  },
  setMode (state: any, mode: number) {
    state.mode = mode
  },
  setPlaying(state: any, playing: boolean) {
    state.playing = playing
  },
  setTopList (state: any, topList: any) {
    state.topList = topList
  },
  setSearchHistory(state: any, searchHistory: any) {
    state.searchHistory = searchHistory
  }
};
export default mutations