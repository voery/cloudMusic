<template>
<div class="player" v-show="playlist.length > 0">
  <transition name="normal">
    <div class="normalPlayer" v-show="fullScreen">
      <div class="background">
        <div class="filter"></div>
        <img :src="currentSong.image" width="100%" height="100%">
      </div>
      <!-- 顶部的title和返回 -->
      <div class="top">
        <div class="back fa fa-angle-left" @click='back'></div>
        <h1 class="title">
          {{currentSong.name || ''}}
        </h1>
        <h2 class="subtitle">
          {{currentSong.singer || ''}}
        </h2>
      </div>
      <!-- 中间的图片和歌词 -->
      <div class="middle"
        @click="changeMiddle">
        <!-- CD部分 -->
        <transition name="middleCd">
          <div class="middleCd"
            v-show="currentShow"
            @touchstart='touchstart'
            @touchmove='touchMove'>
            <div class="cdWrapper">
              <div class="cd" :class="cdCls">
                <img v-lazy="currentSong.image" class="image">
              </div>
            </div>
          </div>
        </transition>
        <!-- 歌词部分 -->
        <transition name="middleLyric">
          <scroll
            class="middleLyric"
            ref="lyricList"
            v-show="!currentShow"
            :data="currentLyric && currentLyric.lines">
            <div 
              v-show="!currentShow"
              class="lyricWrapper">
              <div class="currentLyric" v-if="currentLyric">
                <p class="text"
                  ref="lyricLine"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                  :class="currentLineNum === index && 'current'">
                  {{line.txt}}
                </p>
              </div>
            </div>
            <p class="noLyric"
              v-if='currentLyric===null'>
              {{noLyricContent}}
            </p>
          </scroll>
        </transition>
      </div>
      <!-- 底部控制 -->
      <div class="bottom">
        <!-- 播放时长 -->
        <div class="progressWrapper">
          <span class="time timeL">{{formate(currentTime)}}</span>
          <div class="progressBarWrapper">
            <ProgressBar
              :percent="percent" 
              @percentChangeEnd="percentChangeEnd" 
              @percentChange="percentChange"/>
          </div>
          <span class="time timeR">{{formate(duration)}}</span>
        </div>
        <!-- 播放控制 -->
        <div class="operators">
          <!-- 播放模式 -->
          <div class="icon iconMode">
            <i class="iconfont" :class="iconMode" @click="changeMode"></i>
          </div>
          <!-- 上一曲 -->
          <div class="icon iconPrev">
            <i class="iconfont icon-prev" @click="prev"></i>
          </div>
          <!-- 停止/播放 -->
          <div class="icon iconStop">
            <i class="iconfont" :class="playIcon" @click="togglePlaying"></i>
          </div>
          <!-- 下一曲 -->
          <div class="icon iconNext">
            <i class="iconfont icon-test"></i>
          </div>
          <!-- 收藏 -->
          <div class="icon iconFavorite">
            <i class="iconfont"
              :class="getFavoriteIcon(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <!-- 底部播放信息 -->
  <transition name='mini'>
    <div 
      v-show="!fullScreen"
      class="miniPlayer"
      >
      <div class="img"
        @click="open">
        <img
          :class="cdCls" 
          :src="currentSong.image" 
          height="40" 
          width="40"
          class="play">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name||''"></h2>
        <div class="desc" v-html="currentSong.singer||''"></div>
      </div>
      <!-- 控制按钮 -->
      <div class="control"   @click.stop="togglePlaying">
        <ProgressCircle :radius="radius" :percent="percent">
          <i class="fa" :class="miniIcon"></i>
        </ProgressCircle>
      </div>
      <!-- 显示列表按钮 -->
      <div class="controlMenu" @click="showPlaylist">
        <i class="iconfont icon-caidan1"></i>
      </div>
    </div>
  </transition>
  <playlist ref="playlist" @hide='hidePlaylist' :showFlag='showFlag'/>
  <audio 
    id="musicAudio"
    ref="audio" 
    autoplay
    @ended="end"
    @canplay="ready" 
    @timeupdate="updateTime"></audio>
</div>
</template>
<script lang='ts'>
// 处理歌词的类
import Lyric from 'lyric-parser'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Getter, Mutation } from 'vuex-class'
import { getSong, getLyric } from '@/http'
import { playMode } from '@/assets/js/config'
import { shuffle } from '@/assets/js/utl'
import ProgressBar from '@/components/common/progressBar.vue'
import ProgressCircle from '@/components/common/progressCircle.vue'
import scroll from '@/components/common/scroll.vue'
import playlist from '@/components/common/playlist.vue'
@Component({
  components:{
    ProgressBar,
    ProgressCircle,
    scroll,
    playlist
  }
})
export default class Player extends Vue {
  // 当前播放的时间
  currentTime: number = 0
  // 播放的总时长
  duration: number = 0
  move: boolean = false
  // 
  radius: number = 32
  percent: number = 0
  // 触摸起点
  moveDistanceStart: number = 0
  // 是否显示cd
  currentShow: boolean = true
  // 当前歌曲的歌词
  currentLyric: any = null
  currentLineNum: number = 0
  // 歌曲url
  url: string = ''
  // 是否显示playlist
  showFlag: boolean = false
  // 对$refs 的定义
  $refs!: {
    audio: any,
    lyricList: any,
    lyricLine: any
  }
  /**
   *  vuex
   * playlist 播发歌曲列表
   * sequenceList 顺序播放的列表
   * fullScreen 是否全屏显示播放内容
   * mode 播放的模式
   * currentIndex 当前播放歌曲在列表的索引
   * currentSong 当前播放歌曲的内容
   * playing 是否播放
   *  */
  @State('playlist') playlist!: any[]
  @State('sequenceList') sequenceList!: any[]
  @State('fullScreen') fullScreen!: boolean
  @State('mode') mode!: number
  @State('currentIndex') currentIndex!: number
  @State('playing') playing!: boolean
  @Getter('currentSong') currentSong!: any
  @Mutation('setPlaylist') setPlaylist!: any
  @Mutation('setFullScreen') setFullScreen!: any
  @Mutation('setCurrentIndex') setCurrentIndex!: any
  @Mutation('setMode') setMode!: any
  @Mutation('setPlaying') setPlaying!: any
  // watch
  @Watch('playlist')
  playlistHandler () {
    console.log('watch playlist', this.playlist)
  }
  @Watch('currentSong')
  currentSongHandler (newVal: any, oldVal: any) {
    if(!newVal.id) return
    if(newVal.id === oldVal.id) return
    console.log('get song watch')
    this.getSong(newVal.id)
    this.getLyric(newVal.id)
  }
  @Watch('url')
  urlHandler (newVal: any, oldVal: any) {
    this.$refs.audio.src = newVal
    // 获取播放总时长
    let stop = setInterval(() => {
      this.duration = this.$refs.audio.duration
      if(this.duration) clearInterval(stop)
    }, 150)

  }
  @Watch("currentTime")
  currentTimeHandle () {
    this.percent = this.currentTime / this.duration
  }
  // computed
  get iconMode ():string {
    if (this.mode === playMode.sequence) {
        return 'icon-next'
    } else if (this.mode === playMode.loop) {
        return 'icon-loop'
    } else {
        return 'icon-random'
    }
  }
  // cd是否旋转
  get cdCls () {
    return this.playing ? 'play' : 'play pause'
  }
  get miniIcon () {
    return this.playing ? 'fa-stop' : 'fa-play'
  }
  get playIcon (): string {
    return this.playing ? 'icon-stop' : 'icon-bofangicon'
  }
  get noLyricContent () : string {
    return '正在加载歌词...'
  }
  // motheds
  formate (interval: number) {
    interval = interval | 0
    let minute = interval / 60 | 0
    let second: number | string = interval % 60
    if (second < 10) {
        second = '0' + second
    }
    return minute + ':' + second
  }
  getFavoriteIcon (song: any) {
    return 'icon-dislike'
  }
  back () {
    console.log('click back')
    this.setFullScreen(false)
  }
  open () {
    this.setFullScreen(true)
  }

  hidePlaylist () {
    this.showFlag = false
  }
  showPlaylist () {
    this.showFlag = true
  }

  touchstart (e: any) {
    console.log('touch move start', e.touches[0].clientX)
    this.moveDistanceStart = e.touches[0].clientX
  }
  touchMove (e: any) {
    const moveDistance = 10
    console.log('touch move end', e.touches[0].clientX)
    if (this.moveDistanceStart + moveDistance > e.touches[0].clientX){
      if(this.moveDistanceStart != 0){
        this.prev()// 前一首
      }
      this.moveDistanceStart = 0
    }else if (this.moveDistanceStart - moveDistance < e.touches[0].clientX){
      if(this.moveDistanceStart != 0){
        this.next()// 下一首
      }
      this.moveDistanceStart = 0
    }
  }
  // 歌词和cd切换
  changeMiddle () {
    this.currentShow = !this.currentShow
  }
  // 切换模式 
  changeMode () {
    // 3种模式切换
    const mode = (this.mode + 1) % 3
    this.setMode(mode)
    // 设置播放列表
    let list = mode === playMode.random ? shuffle(this.sequenceList) : this.sequenceList
    this.setPlaylist(list)
    // 重置播放索引
    this.resetCurrentIndex(list)
  }
  // 拖动歌曲时长结束
  percentChangeEnd (percent: number) {
    this.move = false
    const currentTime = this.duration * percent
    this.$refs.audio.currentTime = currentTime
    // 如果没有播放就播放
    if(!this.playing) 
      this.$refs.audio.play(),
      this.setPlaying(true)
    if (this.currentLyric) {
      this.currentLyric.seek(this.currentTime * 1000)
    }
  }
  // 改变歌曲时长中
  percentChange (percent: number) {
    this.move = true
    this.currentTime = this.duration * percent
    // this.$refs.audio.currentTime = this.currentTime
    if (this.currentLyric) {
      this.currentLyric.seek(this.currentTime * 1000)
    }
  }
  // 切换播放
  togglePlaying () {
    this.setPlaying(!this.playing)
    const audio = this.$refs.audio
    // 切换播放状态
    this.playing ? audio.play() : audio.pause()
    if (this.currentLyric) {
      this.currentLyric.togglePlay()
    }
  }
  // 单曲循环
  loop () {
    // 清除时间从新播放
    this.$refs.audio.currentTime = 0
    this.$refs.audio.play()
  }
  // 上一曲
  prev () {
    console.log('prev')
    // 这里只需对index操作，不同模式下的操作在改变模式时去执行
    let index = this.currentIndex - 1
    index = index === -1 ? this.playlist.length - 1 : index
    this.setCurrentIndex(index)
    // 如果没有播放现在播放
    if(!this.playing) this.togglePlaying()
  }
  // 播放下一首
  next () {
    // 如果只有一首
    if(this.playlist.length === 1) {
      this.loop()
      return
    }
    let index = this.currentIndex + 1
    index = index === this.playlist.length ? 0 : index
    // 保存index
    this.setCurrentIndex(index)
    // 如果没有播放现在播放
    if(!this.playing) this.togglePlaying()
  }
  // 歌曲播放结束
  end () {
    this.next()
    // 如果是单曲循环
    if(this.mode === playMode.loop) {
      this.loop()
    }else {
      this.next()
    }
  }
  // audio开始播放是发生事件
  ready () {
    console.log('read')
  }
  // audio的更新
  updateTime (e: any) {
    // 如果在移动控制器就不做更新
    if(this.move) return
    this.currentTime = e.target.currentTime
    // console.log(this.currentTime)
  }
  getSong (id: any) {
    this.url = `http://music.163.com/song/media/outer/url?id=${id}.mp3 `
    // getSong(id).then((res: any) => {
    //   console.log('song', res)
    // })
  }
  getLyric (id: any) {
    // 如果先前有歌词先暂停
    if (this.currentLyric) {
      this.currentLyric.stop()
      this.currentLyric = null
    }
    getLyric(id).then((res: any) => {
      console.log(res, 'lyric')
      this.currentLyric = new Lyric(res.lrc.lyric, this.handleLyric)
      if (this.playing){
        this.currentLyric.play()
        this.currentLineNum = 0
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      console.log(this.currentLyric)
      
    }).catch(() => {
      this.currentLyric = null
      this.currentLineNum = 0
    })
  }
  handleLyric ({lineNum, txt}: {lineNum: number, txt: any}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
  }
  // 私有方法
  private resetCurrentIndex (list: any[]) {
    let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
    })
    this.setCurrentIndex(index)
  }
  // 以下是钩子函数
  created () {
    console.log('playlist', this.playlist)
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.player
  .normalPlayer
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 110
    background $color-background
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86,0.18,0.82,1.32)  
    &.normal-enter,&.normal-leave-to
      opacity 0
    .background
      position absolute
      left -50%
      top -50%
      width 300%
      height 300%
      z-index -1
      opacity 0.6
      filter blur(30px)
      .filter
        position absolute
        width 100%
        height 100%
        background #000
        opacity 0.4
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 40
        font-size 35px
        color $color-theme-l
      .title
        width 70%
        margin 0 auto
        padding-top 10px
        line-height 20px
        text-align center
        font-size $font-size-large
        font-weight bold
        color $color-text-l
        no-wrap()
      .subtitle
        width 70%
        margin 0 auto
        line-height 20px
        text-align center
        font-size $font-size-small-x
        color $color-text-l
        no-wrap()
    .middle
      display flex
      align-items center
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middleCd
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        &.middleCd-enter-active, &.middleCd-leave-active
          transition all 0.3s
        &.middleCd-enter, &.middleCd-leave-to
          opacity 0
        .cdWrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            box-sizing border-box
            border 15px solid rgba(255, 255, 255, .1)
            border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 50%
      .middleLyric
        position absolute
        top 0
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        &.middleLyric-enter-active,&.middleLyric-leave-active
          transition all 0.2s
        &.middleLyric-enter, $.middleLyric-leave-to
          opacity 0
        .lyricWrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 40px
            color $color-text-ggg
            font-size $font-size-medium
            &.current
              color $color-theme
        .noLyric
          position absolute
          width 80%
          text-align center
          line-height 40px
          top 50%
          color $color-text-ggg
          font-size $font-size-large-x 

    .bottom
      position absolute
      bottom 50px
      width 100%
      .progressWrapper
        display flex
        align-items center
        width 80%
        margin 0 auto
        padding 10px 0
        .time
          color $color-text-l
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.timeL
            text-align left
          &.timeR
            text-align right
            color $color-text-gg
        .progressBarWrapper
          flex 1
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme-l
          i
            font-size 30px
          &.iconMode
            font-size 25px
          &.iconMode,&.iconPrev
            text-align right 
          &.iconStop
            text-align center
            i
              font-size 40px
          &.iconFavorite,&.iconNext
            text-align left 
          &.iconLike
            color $color-sub-theme
  .miniPlayer
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background rgba(255,255,255,0.85)
    &.mini-enter-active,&.mini-leave-active
      transition all 0.4s
    &.mini-enter,&.mini-leave-to
      opacity: 0
    .img
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px
      img
        border-radius 50%
        &.play
          animation rotate 10s linear infinite
        &.pause
          animation-play-state paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      overflow hidden
      color $color-text
      .name
        no-wrap()
        margin-bottom 2px
        line-height 14px
        font-size $font-size-medium
      .desc
        no-wrap()
        font-size $font-size-small
    .control,.controlMenu
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini,.icon-pause-mini, .icon-playlist,.iconfont
        font-size: 30px
        color:$color-theme-d
      .iconfont
        position relative
        left -5px
        top -3px
      .fa-play
        color $color-theme-d
        font-size 14px
        position absolute
        left 12px
        top 8.5px
      .fa-stop
        color $color-theme-d
        font-size 12px
        position absolute
        left 10px
        top 10px
@keyframes rotate {
  0% {
    transform rotate(0)  
  }
  100% {
    transform rotate(360deg)
  }
}
</style>