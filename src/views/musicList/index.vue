<template>
<transition name="slide" mode="out-in">
  <div class="musicList">
    <div class="header" ref="header">
      <div class="back" @click="back">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="text">
        <h1 class="title">{{headerTitle}}</h1>
      </div>
    </div>
    <scroll
      class="list"
      @scroll="scroll"
      :listenScroll='listenScroll'
      :probeType = 'probeType'
      :data='listDetail'
      ref="list">
      <div class="musicListWrapper">
        <div class="bgImage" ref="bgImage" :style="bgStyle">
          <div class="filter"></div>
          <div class="text">
            <h2 class="listTitle">{{title}}</h2>
            <p class="playCount">
              <i class="fa fa-headphones"></i>
              {{playCount}}
            </p>
          </div>
        </div>
        <div class="songListWrapper">
          <div class="sequencePlay" v-show="listDetail.length" @click="sequence">
            <i class="iconfont icon-bofangicon"></i>
            <span class="text">播放全部</span>
            <span class="count">
                共 
                {{listDetail.length}}
            </span>
          </div>
          <!-- 歌曲列表 -->
          <SongList
            @select='selectItem'
            :songs='listDetail'
            />
        </div>
      </div>
    </scroll>
    <div class="loadingContent" v-show="!listDetail.length">
      <Loading/>
    </div>
  </div>
</transition>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import { getRecommendListDetail } from '@/http/index'
import { createRecommendListSong } from '@/assets/js/song'
import scroll from '@/components/common/scroll.vue'
import SongList from '@/components/common/songList.vue'
import Loading from '@/components/common/loading.vue'
const RESERVED_HEIGHT = 44
@Component({
  components: {
    scroll,
    SongList,
    Loading
  }
})
export default class MusicList extends Vue {
  musicId!: any
  headerTitle: string = '歌单'
  listDetail: any[] = []
  scrollY:number = 0
  imageHeight: number = 0
  minTranslateY: number = 0
  probeType: number = 3
  listenScroll: boolean = true
  $refs!:{
    bgImage: any
    header: any
  }

  @State('musicList') musicList!: any
  @Action('insertSong') insertSong!: any
  @Action('sequencePlay') sequencePlay!: any
  get playCount () {
    if(!this.musicList.playCount) return
    if(this.musicList.playCount < 1e5)
      return Math.floor(this.musicList.playCount)
    else
      return Math.floor(this.musicList.playCount / 10000) + '万'
  }
  get bgStyle () {
    return `background-image: url(${this.musicList.picUrl})`
  }
  get title () {
    return this.musicList.name
  }

  @Watch('scrollY')
  scrollYHandler (newY: number) {
    const percent = Math.abs(newY / this.imageHeight)
    if(newY < (this.minTranslateY + RESERVED_HEIGHT)) {
      this.headerTitle = this.musicList.name
    } else {
      this.headerTitle = '歌单'
    }
    if (newY < 0) {
      this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`
    } else {
      this.$refs.header.style.background = `rgba(212, 68, 57, 0)`
    }
  }

  back () {
    this.$router.back()
  }
  // 滚动
  scroll (e: any) {
    console.log('scroll', e)
    this.scrollY = e.y
  }
  // 选中插入播放
  selectItem (item: any, index: number) {
    console.log('select item',item)
    this.insertSong(item)
  }
  // 播放所有
  sequence () {
    const list = this.listDetail
    this.sequencePlay({
      list: list
    })
    this.back()
  }
  private getRecommendListDetail () {
    getRecommendListDetail(this.musicId).then((res: any) => {
      console.log('getRecommendListDetail', res)
      this.listDetail = res.playlist.tracks.map((item: any) => {
        console.log('item', item)
        return createRecommendListSong(item)
      })
    })
  }

  created () {
    this.musicId = sessionStorage.getItem('musicId')
    if(!this.musicId){
      this.$router.push('/recommend/recommendList')
    }
    this.getRecommendListDetail()
  }

  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = - this.imageHeight + RESERVED_HEIGHT
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.slide-enter-active, .slide-leave-active
  transition all 0.2s
.slide-enter, .slide-leave-to
  transform translate3d(30%, 0, 0)
  opacity 0
.musicList
  position fixed
  z-index 101
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
  .header
    position fixed
    top 0
    width 100%
    height 44px
    color #fff
    z-index 111
    .back
      position absolute
      top 0
      left 4px
      .fa-angle-left
        padding 5px 10px
        font-size 30px
    .text
      position absolute
      left 38px
      line-height 44px
      font-size $font-size-medium-x
      no-wrap()
  .list
    position fixed
    top 0
    bottom 0
    width 100%
    background $color-background
    .musicListWrapper
      .bgImage
        position relative
        width 100%
        height 0
        padding-top 75%
        transform-origin top
        background-size cover
        background-position 0 30%
        .filter
          position absolute
          top 0
          left 0
          width 100%
          height 100%
          background #000
          opacity 0.2
        .text
          position absolute
          width 80%
          height 40px
          bottom 50px
          left 15px
          color #fff
          .playCount
            position absolute
            bottom -16px
            font-size $font-size-small
        .listTitle
          position absolute
          bottom 0
          font-size $font-size-medium-x
          line-height 18px
          font-weight bold
          letter-spacing 1px
      .songListWrapper
        padding 41px 0 20px 0
        border-radius 10px
        position relative
        top -20px
        background $color-background
        .sequencePlay
          position absolute
          top 0
          display flex
          align-items center
          width 100%
          height 40px
          padding-left 16px
          border-bottom 1px solid rgb(288, 288, 288)
          .iconfont
            font-size 18px
            color $color-text
            padding-right 14px
          .text
            font-size $font-size-medium-x
          .count
            font-size $font-size-medium-x
            color $color-text-g
  .loadingContent
    position fixed
    width 100%
    top 70%
    transform translateY(-50%)
</style>