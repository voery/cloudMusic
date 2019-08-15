<template>
  <transition name='list'>
    <div class="playlist"
      v-show="showFlag"
      @click="hide">
      <div class="listWrapper"
        @click.stop>
        <div class="listHeader">
          <h1 class="title">
            <!-- 切换播放模式 -->
            <i class="iconfont" @click="changeMode" :class="iconMode"></i>
            <span class="text">
              {{modeText}}
              (
                <span class="count">{{sequenceList.length}}</span>
              )
            </span>
            <!-- 清空列表 -->
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent"
          :data='sequenceList'
          class="listContent"
          :refreshDelay="refreshDelay">
          <transition-group name='list' tag='ul'>
            <li class="item"
              ref="listItem"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item, index)"
              >
              <i class="curent fa" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <!-- 删除 -->
              <span class="delete"
                @click="delectOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="listClose" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <!-- 弹框提示删除情况 -->
      <Confirm :show='confirmShow' @confirm='confirmClear' @comfirmHide='comfirmHide' text='是否清空播放列表' confirmBtnText='清空'/>
    </div>
  </transition>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { State, Mutation, Getter, Action }  from 'vuex-class'
import { playMode }  from '@/assets/js/config'
import { shuffle } from '@/assets/js/utl'
import scroll from '@/components/common/scroll.vue'
import Confirm from '@/components/common/comfirm.vue'
@Component({
  components: {
    scroll,
    Confirm
  }
})
export default class PlayList extends Vue {
  refreshDelay: number = 100
  confirmShow: boolean = false
  @Prop({
    type: Boolean,
    default: false
  }) showFlag!: boolean

  @State('sequenceList') sequenceList!: any[]
  @State('mode') mode!: number
  @State('playlist') playlist!: any[]
  @Mutation('setMode') setMode!: any
  @Mutation('setPlaylist') setPlaylist!: any
  @Mutation('setCurrentIndex') setCurrentIndex!: any
  @Getter('currentSong') currentSong!: any
  @Action('deleteSong') deleteSong!: any
  @Action('deleteSongList') deleteSongList!: any
  get iconMode () { 
    return this.mode === playMode.sequence ? 'icon-next' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
  }
  get modeText () {
    return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
  }
  getCurrentIcon (item: any) {
    return this.currentSong.id === item.id ? 'fa-volume-up' : ''
  }
  // 显示删除确认框
  showConfirm () {
    console.log('showConfirm')
    this.confirmShow = true
  }
  // 隐藏
  comfirmHide () {
    console.log('playlist comfirm hide')
    this.confirmShow = false
  }
  // 清空列表
  confirmClear () {
    this.hide()
    this.deleteSongList()
    this.$emit("stopMusic")
  }
  // 删除一个
  delectOne (item: any) {
    this.deleteSong(item)
    // 没有列表就隐藏和停止播放
    if (!this.playlist.length){
      this.hide()
      this.$emit('stopMusic')
    }
  }
  hide () {
    this.$emit('hide')
  }
  changeMode () {
    let mode = (this.mode + 1) % 3
    this.setMode(mode)
    let list = mode === playMode.random ? shuffle(this.sequenceList) : this.sequenceList
    // 重置播放索引
    this.resetCurrentIndex(list)
    this.setPlaylist(list)
  }
  // 选中播放
  selectItem (item: any, index: number) {
    let sIndex = index
    if (this.mode === playMode.random) {
      sIndex = this.playlist.findIndex((song: any) => {
        return song.id === item.id
      })
    }
    this.setCurrentIndex(sIndex)
  }
  private resetCurrentIndex (list: any[]) {
    let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
    })
    this.setCurrentIndex(index)
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.playlist
  position fixed
  left 0
  right 0
  bottom 0
  top 0
  z-index 210
  background-color rgba(0, 0, 0, 0.3)
  &.list-enter-active, &.list-leave-active
    transition all 0.3s
    .listWrapper
      transition all 0.3s
  &.list-enter, &.list-leave-to
    opacity 0
    .listWrapper
      transform translate3d(0, 100%, 0)
  .listWrapper
    position absolute
    left 0
    bottom 0
    width 100%
    border-radius 8px
    background-color $color-background
    .listHeader
      position relative
      padding 20px 30px 10px 20px
      .title
        display flex
        align-items center
        .iconfont
          margin-right 10px
          font-size 20px
          color $color-text-g
        .text
          flex 1
          font-size $font-size-medium
          color $color-text
          .count
            position relative
            top 1px
        .clear
          extend-click()
          .icon-clear
            font-size $font-size-medium
            color $color-text-g
    .listContent
      max-height 240px
      overflow hidden
      .item
        display flex
        align-items center
        height 40px
        padding 0 30px 0 20px
        overflow hidden
        &.list-enter-active, &.list-leave-active
          transition all 0.1s
        &.list-enter, &.list-leave-to
          height 0
        .fa-volume-up
          color $color-theme
          margin-right 5px
        .text
          no-wrap()
          flex 1
          line-height 20px
          font-size $font-size-medium
          color $color-text
        .delete
          extend-click()
          font-size $font-size-small
          color $color-theme
    .listClose
      text-align center
      line-height 30px
      background $color-background
      font-size $font-size-medium-x
      color $color-text

</style>