<template>
<div class="recommendList">
  <scroll class="recommendContent" ref="scroll" :data='playList'>
    <div>
      <div class="decorate"></div>
      <div class="sliderWrapper"></div>
      <div class="recommendSongList">
        <h1 class="title">推荐歌单</h1>
        <ul>
          <li
            v-for="(item, i) in playList"
            :key="i"
            class="item"
            @click="selectList(item)"
            >
            <div class="icon">
              <div class="gradients"></div>
              <img v-lazy="item.picUrl" alt="">
            </div>
            <p class="playCount">
              <i class="fa fa-headphones"></i>
              <span>
                {{Math.floor(item.playCount / 10000) > 0.01 ? Math.floor(item.playCount / 10000) + '万' : Math.floor(item.playCount)}}
              </span>
            </p>
            <div class="text">
              <p class="name">
                {{item.name}}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="recommendNewsong">
        <h1 class="title">最新音乐</h1>
        <ul>
          <li
            v-for="(item, i) in recommendMusic"
            :key="i"
            class="item"
            @click="selectSong(item)">
            <div class="newsongText">

              <div class="name">
                {{item.name}}
                <span class="attach" v-if="item.aliaName">{{item.aliaName}}</span>
              </div>
              <div class="author">
                <i class="author-icon"></i>
                {{item.singer}} - {{item.name}}
              </div>
            </div>
            <div class="newsongPlay">
              <span class="iconfont icon-bofangicon"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </scroll>
</div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation, Action } from 'vuex-class'
import scroll from '@/components/common/scroll.vue'
import { getRecommendList, getRecommendMusic, getBanner } from '@/http'
import { createRecommendSong } from '@/assets/js/song.ts'
import MusicList from '../../musicList/index.vue';
@Component({
  components: {
    scroll
  }
})
export default class RecommendList extends Vue {
  playList: any[] = []
  banner: any[] = []
  recommendMusic: any = []

  @Mutation('setMusicList') setMusicList: any
  @Action('insertSong') insertSong: any
  selectList (item: any) {
    this.$router.push({
      path: '/musicList'
    })
    sessionStorage.setItem('musicId', item.id)
    this.setMusicList(item)
  }
  selectSong (item: any) {
    console.log(item)
    this.insertSong(item)
  }
  private getRecommendList () {
    getRecommendList().then((res: any) => {
      if(res && res.length > 0){
        this.playList = res
      }
    })
  }
  private getRecommendMusic () {
    this.recommendMusic = []
    getRecommendMusic().then((res: any) => {
      if(res && res.length > 0){
        res.map((item: any) => {
          console.log(item)
          this.recommendMusic.push(createRecommendSong(item.song))
        })
      }
    })
  }
  created() {
    this.getRecommendList()
    this.getRecommendMusic()
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.recommendList
  position fixed
  top 88px
  bottom 0
  z-index 100
  .recommendContent
    width 100%
    height 100%
    overflow hidden
    .recommendSongList
      width 100%
      >h1
        height 40px
        line-height 40px
        color #2e3030
        font-weight 700
        padding-left 1.5%
        border-left 3px solid #d34439
      .item
        display inline-block
        vertical-align top
        width 30%
        padding 0 1%
        position relative
        font-size 0
        .icon
          position relative
          display inline-block
          width 100%
          margin-bottom 5px
          .gradients
            position absolute
            top 0
            width 100%
            height 100%
            border-radius 3px
            background linear-gradient(rgba(109, 109, 109, 0.4), rgba(255,255,255,0))
          img
            width 100%
            height 100%
            border-radius 3px
        .playCount
          position absolute
          top 3px
          right 10px
          color #fff
          font-size 10px
        .text
          font-size 11px
          margin-bottom 10px
          height 40px
          line-height 16px
          overflow hidden
          color rgb(46, 48, 48)

    .recommendNewsong
      width 100%
      > h1
        height 40px
        line-height 40px
        color #2e3030
        font-weight 700
        padding-left 1.5%
        border-left 3px solid #d34439
      .item
        display flex
        flex 1 1 auto
        position relative
        padding-left 10px
        height 55px
        .newsongText
          flex 1
          padding 6px 0
          width 0
          .name
            line-height 25px
            font-size 17px
          .author
            line-height 17px
            font-size 12px
            color #888
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            word-break normal
        .newsongPlay
          padding 0 10px
          line-height 55px
          .iconfont
            font-size $font-size-large-x
            color $color-text-icon
</style>