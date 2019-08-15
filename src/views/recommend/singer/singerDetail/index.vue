<template>
<transition name='slide'>
  <div class="musicList">
    <div 
      ref="header"
      class="header">
      <div 
        @click="$router.back()"
        class="back">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="text">
        <h1 class="text">{{headerTitle}}</h1>
      </div>
    </div>
    <scroll
      :listen-scroll='listenScroll'
      ref="list"
      @scroll='scroll'
      :probe-type='probeType'
      :data='songs'
      class="list">
      <div class="musicListWrapper">
        <div 
          :style="bgStyle"
          ref="bgImage"
          class="bgImage">
          <div class="filter"></div>
          <div class="text">
            <h2 class="listTitle">{{title}}</h2>
          </div>
        </div>
        <div class="songListWrapper">
          <div 
            v-show="listDetail.length"
            class="sequencePlay"
            @click='sequence'>
            <i class="iconfont icon-bofangicon"></i>
            <span class="text">播放全部</span>
            <span class="count">
              (共{{listDetail.length}}首)
            </span>
          </div>
        </div>
        <songList
          @select="selectItem"
          :songs='listDetail'
          />
      </div>
      <div class="loadingContent">
        <loading/>
      </div>
    </scroll>
  </div>
</transition>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation, Action } from 'vuex-class'
import { getSingerDetail } from '@/http'
import { createRecommendListSong } from '@/assets/js/song'
import scroll from '@/components/common/scroll.vue'
import songList from '@/components/common/songList.vue'
import loading from '@/components/common/loading.vue'
const RESERVED_HEIGHT = 44
@Component({
  components: {
    scroll,
    songList,
    loading
  }
})
export default class SingerDetail extends Vue {
  headerTitle: string = '歌手'
  songs: any[] = []
  listDetail: any[] = []
  listenScroll: boolean = true
  probeType: number = 3
  scrollY: number = 0
  imageHeight: number = 0
  minTranslateY: number = 0
  $refs!: {
    bgImage: any
  }
  @State('singer') singer: any
  @Action('sequencePlay') sequencePlay: any
  @Action('insertSong') insertSong!: any

  get headerTitleTouchDown () {
    return this.singer.aliaName ? this.singer.name + `(${this.singer.aliaName})` : this.singer.name
  }
  get bgStyle () {
    return `background-image: url(${this.singer.avatar})`
  }
  get title () {
    return this.headerTitleTouchDown
  }
  
  sequence () {
    this.sequencePlay({
      list: this.listDetail
    })
  }
  selectItem (item: any, index: number) {
    this.insertSong(item)
  }
  scroll (p: any) {
    this.scrollY = p.y
  }
  private getDetail () {
    if (!this.singer.id){
      this.$router.push('/recommend/singer')
      return
    }
    getSingerDetail(this.singer.id).then((res: any) => {
      console.log('detail', res)
      let list = res.hotSongs
      list.forEach((item: any) => {
        this.listDetail.push(createRecommendListSong(item))
      })
    })
  }
  created() {
    console.log(this.singer)
    this.getDetail()

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
.slide-enter-active,.slide-leave-active 
  transition all 0.2s
.slide-enter, .slide-leave-to
  transform translate3d(30%, 0, 0)
  opacity 0
.loadingContent
  width 100%
  height 100%
.musicList
  position fixed
  z-index 100
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
    .musicListWrapper
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
          bottom 40px
          left 20px
          color #fff
          .listTitle
            position relative
            bottom 0
            font-size $font-size-large-s
            line-height 18px
            font-weight bold
            letter-spacing 1px
      .songListWrapper
        padding 41px 0 20px
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
</style>