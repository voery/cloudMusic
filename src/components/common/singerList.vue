<template>
<scroll
  class="singerList"
  ref="listview"
  :listenScroll = "listenScroll"
  @scroll="scroll"
  :probeType="probeType"
  :data='data'>
  <ul>
    <li 
      v-for="group in data"
      :key="group.id"
      class="listGroup"
      ref="listGroup">
      <h2 class="listGroupTitle">{{group.title}}</h2>
      <ul>
        <li
          v-for="item in group.items"
          :key="item.id" 
          @click="selectItem(item)"
          class="listGroupItem">
          <img v-lazy="item.avatar" class="avater">
          <span class="name">{{ item.name }}</span>
        </li>
      </ul>
    </li>
  </ul>
  <div 
    @touchstart='onShortcutStart'
    @touchmove.stop.prevent='onShortcutMove'
    class="listShortcut">
    <ul>
      <li 
        v-for="(item, index) in shortcutList"
        :key="item.id"
        :data-index='index'
        :class="{'current': currentIndex === index}"
        class="item">
          {{item}}
      </li>
    </ul>
  </div>
</scroll>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { getData } from '@/assets/js/dom'
import scroll from '@/components/common/scroll.vue'
const ANCHOR_HEIGHT = 20
@Component({
  components: {
    scroll
  }
})
export default class SingerList extends Vue {
  scrollY: number = -1
  currentIndex: number = 0
  touch: any = {}
  listenScroll: boolean = true
  listHeight: any[] = []
  probeType: number = 3
  $refs!: {
    listview: any,
    listGroup: any
  }

  @Prop({
    type: Array,
    default: []
  })
  data!: any[]

  @Watch('data')
  dataHandle () {
    setTimeout(()=>{
      this.calculateHeight()
    }, 20)
  }
  @Watch('scrollY')
  scrollYHandle (newY: number) {
    const listHeight = this.listHeight
    if( newY > 0 ) {
      this.currentIndex = 0
      return
    }
    for (let i = 0; i < listHeight.length - 1; i++ ) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (-newY >= height1 && -newY < height2) {
        this.currentIndex = i
        return
      }
    }
    this.currentIndex = listHeight.length - 2
  }

  get shortcutList () {
    return this.data.map((group: any) => {
      console.log(group)
      return group.title.substr(0, 1)
    })
  }
  get fixedTitle () {
    if (this.scrollY > 0) {
      return ''
    }
    return this.data[this.currentIndex]
  }

  selectItem (item: any) {
    this.$emit('select', item)
  }
  refresh () {
    this.$refs.listview.refresh()
  }
  scroll (p: any) {
    this.scrollY = p.y
  }
  onShortcutStart (e: any) {
    let anchorIndex = getData(e.target, 'index')
    let firstTouch = e.touches[0]
    this.touch.y1 = firstTouch.pageY
    this.touch.anchorIndex = anchorIndex
    this.scrollTo(anchorIndex)
  }
  onShortcutMove (e: any) {
    let firstTouch = e.touches[0]
    this.touch.y2 = firstTouch.pageY
    let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
    let anchorIndex = parseInt(this.touch.anchorIndex) + delta
    this.scrollTo(anchorIndex)
  }
  private scrollTo (index: number) {
    if (!index && index !== 0) return
    if (index < 0) {
      index = 0
    } else if (index > this.listHeight.length -2) {
      index = this.listHeight.length - 2
    }
    this.scrollY = - this.listHeight[index]
    this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
  }
  private calculateHeight () {
    this.listHeight = []
    const list = this.$refs.listGroup
    let height = 0
    this.listHeight.push( height )
    for (let i = 0; i < list.length; i++ ) {
      let item = list[i]
      height += item.clientHeight
      this.listHeight.push(height)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.singerList
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background
  .listGroup
    .listGroupTitle
      height 20px
      line-height 20px
      padding-left 20px
      margin-bottom 10px
      font-size $font-size-small
      color #fff
      background rgba(0, 0, 0, 0.1)
    .listGroupItem
      display flex
      align-items center
      padding 5px 0
      margin 0 5px
      border-bottom 1px solid rgb(228, 228, 228)
      &:last-child
        border none
        margin-bottom 10px
      .avater
        width 50px
        height 50px
        border-radius 3px
      .name
        margin-left 20px
        color $color-text
        font-size $font-size-medium
  .listShortcut
    position absolute
    z-index 30
    right 3px
    top 50%
    transform translateY(-50%)
    width 20px
    padding 200px 0
    border-radius 3px
    text-align center
    font-family Helvetica
    .item
      padding 5px
      line-height 1
      color $color-text-g
      font-size $font-size-small
      font-weight bold
      &.current
        color $color-theme
  
</style>