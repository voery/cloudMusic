<template>
<div class="searchBox">
  <input type="text" 
    class="box"
    v-model="query"
    :placeholder="placeholder">
    <i class="icon-delete" v-show="query" @click="clear"></i>
</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { debounce } from '@/assets/js/utl'
@Component({
})
export default class SearchBox extends Vue {
  query: string = ''

  @Prop({
    type: String,
    default: '搜索歌曲、歌手'
  }) placeholder!: string

  clear () {
    this.query = ''
  }
  setQuery (query:string) {
    this.query = query
  }

  created() {
    this.$watch('query', debounce((newQuery: any) => {
      this.$emit('query', newQuery)
    }, 300))
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.searchBox
display flex
align-items center
box-sizing border-box
width 100%
height 25px
border-bottom 1px solid rgb(235, 235, 235)
.iconSearch
  font-size 24px
  color $color-text-g
.box
  flex 1
  line-height 25px
  background $color-theme
  color #fff
  font-size $font-size-medium
  bottom none 
  outline medium
  &::placeholder
    color rgba(255, 255, 255, 0.6)
.icon-delete
  position absolute
  right 12px
  font-size 14px
  color rgba(255, 255, 255, 0.8)
  bottom none
</style>