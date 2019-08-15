<template>
<div 
  v-show="searches.length"
  class="searchList">
  <transition-group name='list' tag="ul">
    <li class="searchItem"
      v-for="item in searches"
      :key="item"
      @click="selectItem(item)">
      <span class="text">{{item}}</span>
      <span 
        @click.stop="deleteOne(item)"
        class="icon">
        <i class="icon-delete"></i>
      </span>
    </li>
  </transition-group>
</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
})
export default class SearchList extends Vue {

  @Prop({
    type: Array,
    default: []
  }) searches!: any[]

  selectItem (item: string) {
    this.$emit('select', item)
  }
  deleteOne (item: string) {
    this.$emit('delete', item)
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.searchList
  .searchItem
    display flex
    align-items center
    height 35px
    overflow hidden
    font-size 14px
    &.list-enter-active,&.list-leave-active{
      transition all 0.1s
    }
    &.list-enter, &.list-leave-to
      height 0
    .text
      flex 1
      color $color-text
    .icon
      extend-click()
      .icon-delete
        font-size $font-size-medium
        color $color-text
</style>