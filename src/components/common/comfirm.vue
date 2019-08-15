<template>
  <transition name='confirm'>
    <div class="confirm" v-show="show" @click.stop="hide">
      <div class="confirmWrapper">
        <div class="confirmContent">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operateBtn left"
              @click.stop="cancel">
              {{cancelBtnText}}
            </div>
            <div class="operateBtn"
              @click.stop="confirm">
              {{confirmBtnText}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
})
export default class Confirm extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  show!: boolean
  @Prop({
    type: String,
    detault: ''
  })
  text!: string
  @Prop({
    type: String,
    default: '确定'
  })
  confirmBtnText!: string
  @Prop({
    type: String,
    default: '取消'
  })
  cancelBtnText!: string

  hide () {
    console.log('comfirm hide')
    this.$emit('comfirmHide')
  }
  cancel () {
    this.hide()
  }
  confirm () {
    this.hide()
    this.$emit('confirm')
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.confirm
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  z-index 1000
  background-color rgba(0, 0, 0, 0.3)
  &.confirm-enter-active
    animation confirm-fadein 0.3s
    .confirmContent
      animation confirm-zoom 0.3s
  .confirmWrapper
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    z-index 1001
    .confirmContent
      width 270px
      border-radius 5px
      background $color-background
      .text
        padding 12px 15px
        line-height 22px
        text-align center
        font-size $font-size-medium-x
      .operate
        display flex
        align-items center
        text-align center
        font-size $font-size-medium-x
        .operateBtn
          flex 1
          line-height 22px
          padding 12px 0
          border-top 1px solid $color-background
          color $color-theme
          &.left
            border-right 1px solid $color-background
@keyframes confirm-fadein {
  0% {
    opacity 0
  }
  100% {
    opacity 1
  }
}
@keyframes confirm-zoom {
  0% {
    transform scale(0)
  }
  50% {
    transform scale(1.1)  
  }
  100% {
    transform scale(1)
  }
}
</style> 