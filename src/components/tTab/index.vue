<template>
<div class="tTab">
    <router-link to="/recommend/recommendList" tag="div" class="tab-item">
        <span>推荐音乐</span>
    </router-link>
    <router-link to="/recommend/rank" tag="div" class="tab-item">
        <span>热歌榜</span>
    </router-link>
    <router-link to="/recommend/singer" tag="div" class="tab-item">
        <span>歌手</span>
    </router-link> 
</div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
@Component({
})
export default class TTab extends Vue {}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.tTab
  display flex
  height 44px
  line-height 44px
  width 100%
  font-size $font-size-medium
  background $color-theme-t
  .tab-item
    flex 1
    text-align center
    color $color-text-t
    span 
      padding-bottom 3px
    &.router-link-active
      span
        font-weight bold
        color $color-text-t
        border-bottom 2px solid $color-text-t
</style> 