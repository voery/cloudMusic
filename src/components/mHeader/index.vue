<template>
<header class="mHeader">
  <!-- <i class="iconfont icon-list"></i> -->
  <h1>
    {{headerMsg}}
  </h1>
  <router-link to="/search" class="search" tag="div">
    <i class="iconfont icon-search"></i>
  </router-link>
</header>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
@Component({
})
export default class MHeader extends Vue {
  headerMsg: string = '云音乐'
}
</script>
<style lang="stylus" scoped>
.mHeader
  background #d34439
  height 44px
  line-height 44px
  color #fff
  position relative
  .icon-list,.icon-search
    font-size 20px
    position absolute
    width 44px
    text-align center
    cursor pointer
  h1
    text-align center
  .icon-search
    right 0
    top 0
    display block
    height: 100%
    line-height 44px
</style>