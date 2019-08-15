import { loadSearch } from '@/assets/js/cache'
const state = {
  musicList: <any>{},
  singer: <any>{},
  playlist: <any[]>[],
  sequenceList: <any[]>[],
  currentIndex: <number>0,
  fullScreen: <boolean>false,
  mode: <number>1,// 默认是循环播放
  playing: <boolean>false,// 是否在播放
  topList: <any>{},
  searchHistory: <any[]>loadSearch()
};
export default state