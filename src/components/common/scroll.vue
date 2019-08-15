<template>
  <div class="scrollBox" ref="wrapper">
    <slot></slot>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import BScroll from 'better-scroll'
import { setTimeout } from 'timers';
@Component({
})
export default class Scroll extends Vue {
  scroll: any = null
  @Prop({
    type: Number,
    default: 1
  })probeType!: number
  @Prop({
    type: Boolean,
    default: true
  })click!: boolean
  @Prop({
    type: Array,
    default: []
  })data!: any[]
  @Prop({
    type: Boolean,
    default: false
  })listenScroll!: boolean
  @Prop({
    type: Boolean,
    default: false
  })pullup!: boolean
  @Prop({
    type: Number,
    default: 20
  })refreshDelay!: number
  // methods
  private initScrol () {
    if(!this.$refs.wrapper) return
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      click: this.click
    })
    if (this.listenScroll) {
        this.scroll.on('scroll', (pos: any) => {
            console.log('emit')
            this.$emit('scroll', pos)
        })
    }
    if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                this.$emit('scrollEnd')
            }
        })
    }
  }
  enable () {
    this.scroll && this.scroll.enable()
  }
  disable () {
    this.scroll && this.scroll.disable()
  }
  refresh () {
    this.scroll && this.scroll.refresh()
  }
  scrollTo () {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
  }
  scrollToElement () {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }
  // mounted
  mounted() {
    // this.$nextTick(() => {
      this.initScrol()
    // })
  }
  // watch
  @Watch('data')
  dataHandle () {
    setTimeout(() => {
      this.refresh()
    }, this.refreshDelay)
  }
}
</script>
<style lang="stylus" scoped>
</style>