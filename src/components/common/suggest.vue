<template>
  <div class="suggest">
    <div 
      v-show="!searchShow&&query&&songs.length"
      class="searchSuggest">
      <p 
        v-show="showSinger&&showList"
        class="title">
        最佳匹配
      </p>
      <div 
        @click="selectItem(suggest.artists[0])"
        v-if="suggest.artists && showSinger"
        class="searchSuggestItem">
        <img width="50" height="50" :src="suggest.artists[0].img1v1Url">
        <span>
          歌手:
          {{suggest.artists[0].name}}
        </span>
      </div>
      <div 
        @click="selectList(suggest.playlists[0])"
        v-if="suggest.playlists && showList"
        class="searchSuggestItem">
        <img 
          :src="suggest.playlists[0].coverImgUrl"
          width="50"
          height="50">
        <div class="text">
          <p>歌单: {{suggest.playlists[0].name}}</p>
          <p class="singer">
            {{suggest.albums[0].artist.name}}
          </p>
        </div>
      </div>
    </div>
    <ul 
      ref="suggestList"
      v-show="!searchShow"
      class="suggestList">
      <li 
        v-for="(item, index) in songs"
        :key="index"
        @click="selectSong(item)"
        class="suggestItem">
        <div class="icon">
          <i></i>
        </div>
        <div class="name">
          <p class="song">{{item.name}}</p>
          <p class="singer">{{item.singer}}</p>
        </div>
      </li>
      <loading v-show="haveMore && query"/>
    </ul>
    <div class="noResultWrapper" 
      v-show="!haveMore && !songs.length && query">
      抱歉，暂无搜索结果  
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Mutation, Action } from 'vuex-class'
import { getSearchSongs, getSearchSuggest, getSongDetail } from '@/http'
import { createSearchSong } from '@/assets/js/song'
import loading from '@/components/common/loading.vue'
import Singer from '@/assets/js/singer'
@Component({
  components: {
    loading
  }
})
export default class Suggest extends Vue {
  singer: any = {}
  songs: any[]= []
  suggest: any = {}
  searchShow: boolean = true
  page: number = 0
  update: boolean = true
  haveMore: boolean = true

  @Prop({
    type: String,
    default: ''
  }) query!: string
  @Prop({
    type: Boolean,
    default: true
  }) showSinger!: boolean
  @Prop({
    type: Boolean,
    default: true
  }) showList!: boolean

  @Mutation('setSinger') setSinger!: any
  @Mutation('setMusicList') setMusicList!: any
  @Action('insertSong') insertSong!: any

  @Watch('query')
  queryHandle (val: any) {
    this.suggest = {}
    this.songs = []
    if (val === '') {
      this.haveMore = false
      return
    }
    this.searchShow = true
    this.page = 0
    this.haveMore = true
    this.search()
  }

  selectSong ( item: any) {
    getSongDetail(item.id).then((res: any) => {
      item.image = res.songs[0].al.picUrl
      this.insertSong(item)
    })
    this.$emit('select')
  }
  selectList (item: any) {
    const list: any = {}
    list.name = item.name
    list.id = item.id
    list.picUrl = item.coverImgUrl
    list.playCount = item.playCount
    // this.$router.push
    this.setMusicList(list)
    this.$emit('select')
  }
  selectItem (item: any) {
    const singer: any = new Singer({
      id: item.id,
      name: item.name,
      avatar: item.img1v1Url
    })
    // this.$router.push('')
    this.setSinger(singer)
    this.$emit('select')
  }
  search () {
    this.searchShow = false
    this.haveMore = true
    getSearchSongs(this.query, this.page).then((res: any) => {
      if(!res.songs) {
        this.haveMore = false
        return
      }
      let list = res.songs
      let ret: any[] = []
      list.map((item: any) => {
        ret.push(createSearchSong(item))
      })
      this.songs = ret
      this.$emit('refresh')
    })
    this.page += 30
    getSearchSuggest(this.query).then((res:any) => {
      this.suggest = res
    })
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.suggest
  height 100%
  overflow hidden
  .searchSuggest
    .title
      padding-left 20px
      padding-bottom 10px
      color $color-theme
      font-size 11px
    .searchSuggestItem
      display flex
      align-items center
      padding 8px 20px
      border-bottom 1px solid rgb(228, 228, 228)
      font-size $font-size-medium
      img 
        flex 0 0 50px
        padding-right 15px
      .text
        width 100%
        p
          padding 3px 0
          no-wrap()
        .singer
          font-size 12px
          color $color-text
  .suggestList
    padding-bottom 30px
    .suggestItem
      display flex
      padding 3px 20px
      height 50px
      align-items center
      border-bottom 1px solid rgb(228, 228, 228)
      p
        padding 3px 0
      .song
        font-size $font-size-medium-x
        color $color-text
        no-wrap()
      .singer
        font-size 12px
        color $color-text-g
        no-wrap()
    .icon
      [class^="icon-"]
        font-size 14px
        color $color-text
    .name
      flex 1
      font-size $font-size-medium
      color $color-text
      overflow hidden
      .text
        no-wrap()
.noResultWrapper
  position fixed
  overflow hidden
  left 50%
  transform translateX(-50%)
  color $color-text
</style>