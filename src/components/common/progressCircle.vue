<template>
<div class="progressCircle">
  <svg 
    viewBox="0 0 100 100" 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg">
      <circle class="progressBackground" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progressBar" r="50" cx="50" cy="50" 
      :stroke-dasharray = "dashArray"
      :stroke-dashoffset = "dashOffset"
      fill="transparent"/>
  </svg>
  <slot></slot>
</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
})
export default class ProgressCircle extends Vue {
  dashArray:number = Math.PI * 100
  @Prop({
    type: Number,
    default: 100
  })
  redius!: number
  @Prop({
    type: Number,
    default: 0
  })
  percent!: number

  get dashOffset ():number {
    return (1 - this.percent) * this.dashArray
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.progressCircle
  position relative
  circle
    stroke-width 8px
    transform-origin center
    &.progressBackground
      transform scale(0.9)
      stroke $color-theme-d
    &.progressBar
      transform scale(0.9) rotate(-90deg)
      stroke $color-highlight-background
</style>