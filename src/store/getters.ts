export const currentSong = (state: any) => {
  return state.playlist[state.currentIndex] || {}
}
export const searchHistory = (state: any) => state.searchHistory