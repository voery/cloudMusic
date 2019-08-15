<template>
<div class="progressBar" ref="progressBar" @click="progressClick">
  <div class="barInner">
    <!-- 拖动后显示 -->
    <div class="progress" ref="progress"></div>
    <!-- 拖动的按钮 -->
    <div class="progresBtnWraper"
      ref="progressBtn"
      :class="touch.initiated&&'touchActive'"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend.prevent="progressTouchEnd">
      <div class="progressBtn"></div>
    </div>
  </div>
</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
const progressBtnWidth = 13
@Component({
})
export default class ProgressBar extends Vue {
  touch: any = {
    initiated: false
  }
  @Prop({
    type: Number,
    default: 0
  }) percent!: number
  $refs!:{
    progress: any,
    progressBar: any,
    progressBtn: any
  }
  @Watch('percent')
  percentHandle (newPercent: number){
    if(newPercent >= 0 && !this.touch.initiated){
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = newPercent * barWidth
      this.offset(offsetWidth)
    }
  }
  progressClick (e: any) {
    const rect = this.$refs.progressBar.getBoundingClientRect()
    // rect.left 元素距离左边的距离
    // e.pageX 点击距离左边的距离
    const offsetWidth = e.pageX - rect.left
    // console.log(rect, e.pageX)
    this.offset(offsetWidth)
    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
    const percent = this.$refs.progress.clientWidth / barWidth
    this.$emit('percentChangeEnd', percent)
  }
  progressTouchStart (e: any) {
    this.touch.initiated = true
    this.touch.startX = e.touches[0].pageX
    this.touch.left = this.$refs.progress.clientWidth
  }
  progressTouchMove (e: any) {
    if(!this.touch.initiated) return
    this.triggerPercent()
    const deltaX = e.touches[0].pageX - this.touch.startX
    const offsetWidth = Math.min(Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)))
    this.offset(offsetWidth)
  }
  progressTouchEnd (e: any) {
    this.touch.initiated = false
    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
    const percent = this.$refs.progress.clientWidth / barWidth
    this.$emit('percentChangeEnd', percent)
  }
  private triggerPercent () {
    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
    const percent = this.$refs.progress.clientWidth / barWidth
    this.$emit('percentChange', percent)
  }
  private offset (offsetWidth: number) {
    this.$refs.progress.style.width = `${offsetWidth}px`
    this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.progressBar
  height 30px
  .barInner
    position relative
    top 13px
    height 4px
    background rgba(0, 0, 0, 0.3)
    .progress
      position absolute
      height 100%
      background linear-gradient(90deg, $color-theme, $color-theme-b)
    .progresBtnWraper
      position absolute
      left -8px
      top -13px
      width 30px
      height 30px
      &.touchActive
        .progressBtn
          width 19px
          top: 4px
          height 19px
          border-width 5px
      .progressBtn
        position relative
        top 7px
        left 7px
        box-sizing border-box
        width 16px
        height 16px
        border 3px solid $color-theme-b
        border-radius 50%
        background $color-theme-l
</style>