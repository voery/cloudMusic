<template>
<transition name='slide'>
  <div class="rankDetail">
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
      :data='topDetailList'
      @scroll="scroll"
      :probe-type='probeType'
      :listen-scroll='listenScroll'
      ref="list">
      <div class="rankDetailWrapper">
        <div 
          :style="bgStyle"
          ref="bgImage"
          class="bgImage">
          <div class="filter"></div>
          <div class="text">
            <h2 class="listTitle">
              {{title}}
            </h2>
            <div class="update">
              {{updateTime}}
            </div>
          </div>
        </div>
        <div class="songListWrapper">
          <div 
            v-show="topDetailList.length!==0"
            class="sequencePlay"
            @click="sequence"
            >
            <i class="iconfont icon-bofangicon"></i>
            <span class="text">播放全部</span>
            <span class="count">
              (共{{ topDetailList.length }} 首)
            </span>
          </div>
        </div>
        <SongList
          class="topSongList"
          :songs='topDetailList'
          @select="selectItem"
          />
      </div>
      <div class="loadingContent" v-show="!topDetailList.length">
        <loading/>
      </div>
    </scroll>
  </div>
</transition>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getTop } from '@/http'
import { createRecommendListSong } from '@/assets/js/song'
import { State, Action } from 'vuex-class'
import scroll from '@/components/common/scroll.vue'
import SongList from '@/components/common/songList.vue'
import loading from '@/components/common/loading.vue'
const RESERVED_HEIGHT = 44
@Component({
  components: {
    scroll,
    SongList,
    loading
  }
})
export default class RankDetail extends Vue {
  headerTitle: string = '排行榜'
  topDetailList: any[] = []
  minTranslateY: number = 0
  imageHeight: number = 0
  scrollY: number = 0
  probeType: number = 0
  listenScroll: boolean = false
  $refs!: {
    list: any,
    header: any,
    bgImage: any
  }


  @State('topList') topList!: any
  @Action('sequencePlay') sequencePlay!: any
  @Action('insertSong') insertSong!: any
  @Watch('topList')
  topListHandle () {
    if(this.topList.tracks) {
      this.getTop()
      if(this.$refs.list) this.handlePlaylist()
    }
  }
  @Watch('scrollY')
  scrollYHandle (newY: number) {
    const percent = Math.abs(newY / this.imageHeight)
    if(newY < (this.minTranslateY + RESERVED_HEIGHT -20)) {
        this.headerTitle = this.title()
    } else {
        this.headerTitle = '排行榜'
    }
    if(newY < 0 ) {
        this.$refs.header.style.background = `rgba(212,68,57,${percent})`
    } else {
        this.$refs.header.style.background = `rgba(212,68,57,0)`
    }
  }
  get headerTitleTouchDown () {
    return this.topList.name
  }
  get bgStyle () {
    return `background-image: url(${this.topList.coverImgUrl})`
  }
  get title () {
    return this.headerTitleTouchDown
  }
  get updateTime () {
    const time = new Date(this.topList.updateTime)
    return `最近更新: ${ time.getMonth() + 1 }月${ time.getDate()}日`
  }
  // 播放所有
  sequence () {
    const list = this.topDetailList
    this.sequencePlay({
      list: list
    })
    this.back()
  }
  selectItem (item: any) {
    this.insertSong(item)
  }
  handlePlaylist () {
    const bottom = this.topDetailList && this.topDetailList.length > 0 ? '60px' : ''
    console.log(this.$refs.list)
    this.$refs.list.$el.style.bottom = bottom
    this.$refs.list.refresh()
  }
  scroll ( p: any ) {
    this.scrollY = p.y
  }
  back () {
    console.log('back')
    this.$router.back()
  }
  private getTop () {
    this.topList.tracks.map((res: any) => {
      this.topDetailList.push(createRecommendListSong(res))
    })
    console.log(this.topDetailList.length)
    
  }

  created () {
    console.log(this.topList)
    // this.getTop()
    if(this.topList.tracks) {
      this.getTop()
      if(this.$refs.list) this.handlePlaylist()
    } else {
      this.$router.push('/recommend/rank')
    }
    this.probeType = 3
    this.listenScroll = true
  }
  mounted() {
    this.handlePlaylist()
    this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTranslateY = - this.imageHeight + RESERVED_HEIGHT
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.slide-enter-active,.slide-leave-active 
  transition all 0.2s
.slide-enter, .slide-leave-to
  transform translate3d(30%, 0, 0)
  opacity 0
.rankDetail
  position fixed
  z-index 100
  top 0
  bottom 0
  left 0
  right 0
  background $color-background
  .header
    position fixed
    top 0
    width 100%
    height 44px
    color #fff
    z-index 100
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
    .rankDetailWrapper
      .bgImage
        position relative
        width 100%
        height 0
        padding-top 75%
        transform-origin top 
        background-size cover
        background-position  0 30%
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
          left 20px
          color #fff
          .listTitle
            position absolute
            bottom 0
            font-style italic
            font-size $font-size-large
            line-height 18px
            font-weight bold
            letter-spacing 1px
            .music
              position absolute
              top -20px
              left 5px
              font-style italic
              font-weight bold
              font-size $font-size-medium
          .update
            position absolute
            top 45px
            left 7px
            line-height 14px
            font-size $font-size-small
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
          border-bottom 1px solid rgb(228, 228, 228)
          .iconfont
            font-size 18px
            color $color-text
            padding-right 14px
          .text
            font-size $font-size-medium-x
          .count
            font-size $font-size-medium
            color $color-text-g
      .topSongList
        position relative
        top -20px
  .loadingContent
    position fixed
    width 100%
    top 70%
    transform translateY(-50%)
</style>