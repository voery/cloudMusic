import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEANGTH = 15

function insertArray(arr: any[], val: any, compare: any, maxLen: number) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearch(query: string) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item: any) => {
    return item === query
  }, SEARCH_MAX_LEANGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray(arr: any[], compare: any) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function deleteSearch(query: any) {
  // 首先获取
  let searches = storage.get(SEARCH_KEY, [])

  deleteFromArray(searches, (item:any) => {
    return item === query
  })
  console.log('delet', searches)

  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}