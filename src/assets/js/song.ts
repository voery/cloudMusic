export default class Song {
  id: string
  singer: string
  name: string
  album: string
  aliaName: string
  image: string
  sqState: string
  constructor({ id, mid, singer, name, album, duration, image, url, aliaName, sqState }:any) {
    this.id = id
    this.singer = singer
    this.name = name
    this.album = album
    this.aliaName = aliaName
    this.image = image
    this.sqState = sqState
  }
}
function singerName(arr: any[]) {
  let name = []
  arr = arr || []
  name = arr.map((item: any) => {
    return item.name
  })
  return name.join('/')
}
export function createRecommendSong(music: any) {

  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    album: music.album.name,
    sqState: music.album.status,
    aliaName:  music.album.alias[0],
    image: music.album.picUrl
  })
}
export function createRecommendListSong(music: any) {
  return new Song({
    id: music.id,
    singer: singerName(music.ar),
    name: music.name,
    album: music.al.name,
    image: music.al.picUrl
  })
}

export function createSearchSong(music: any) {
  return new Song({
    id: music.id,
    singer: singerName(music.artists),
    name: music.name,
    // aliaName: filiterAliaName(music.alias),
    album: music.album.name
    // image: `http://p1.music.126.net/-2o0OyBFtfCCoBqL1Q-TjA==/${music.album.picId}.jpg`
    // // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songid}.m4a?vkey=${getUrl(musicData.songid)}&guid=3304491888&uin=0&fromtag=66`
  })
}