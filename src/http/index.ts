import axios from 'axios'
import qs from 'querystring'
import { HOST }  from './config'
// axios配置
const axiosIns: any = axios.create({
  timeout: 20000,
  withCredentials: false
})
axiosIns.interceptors.response.use((res: any): any => {
  if(res.data && res.data.code){
    if(res.data.code != 200){
      console.error('服务返回失败')
    }else {
      if (res.data.result)
        return res.data.result
      return res.data
    }
  }else{
    return res.data
  }
  return res
}, (error: any) => {console.error(error)})
axiosIns['all'] = axios.all
axiosIns['spread'] = axios.spread

export function getBanner () {
  const url = HOST + '/banner'
  return axiosIns.get(url)
}

export function getRecommendList () {
  const url = HOST + '/personalized'
  return axiosIns.get(url)
}

export function getRecommendMusic () {
  const url = HOST + '/personalized/newsong'
  return axiosIns.get(url)
}

export function getRecommendListDetail (id: any) {
  const url = HOST + `/playlist/detail?id=${id}`
  return axiosIns.get(url)
}

export function getSong(id: any) {
  const url = HOST + `/song/music?id=${id}`

  return axiosIns.get(url)
}

export function getLyric(id: any) {
  const url = HOST + `/lyric?id=${id}`
  return axiosIns.get(url)
}

export function getTop(id: any) {
  const url = HOST + `/top/list?idx=${id}`

  return axiosIns.get(url)
}
export function getSingers() {
  const url = HOST + '/top/artists?limit=100'
  return axiosIns.get(url)
}
export function getSingerDetail(singerId: string) {
  const url = HOST + `/artists?id=${singerId}`

  return axiosIns.get(url)
}
export function getSearchHot() {
  const url = HOST + `/search/hot`

  return axiosIns.get(url)
}
export function getSearchSinger(name: string) {
  const url = HOST + `/search?keywords=${name}&type=100`

  return axiosIns.get(url)
}

export function getSearchSongs(name: string, page: number) {
  const url = HOST + `/search?keywords=${name}&offset=${page}`

  return axiosIns.get(url)
}

export function getSearchSuggest(name: string) {
  const url = HOST + `/search/suggest?keywords=${name}`

  return axiosIns.get(url)
}
export function getSongDetail(id: any) {
  const url = HOST + `/song/detail?ids=${id}`

  return axiosIns.get(url)
}