<template>
<transition name='search'>
  <div class="search" ref="searchWrapper">
    <div class="searchBoxWrapper">
      <i class="fa fa-angle-left" @click="$router.back()"></i>
      <SearchBox
        ref="searchBox"
        @query='onQueryChange'/>
    </div>
    <scroll
      ref="scroll"
      :pullup='pullup'
      :data='searchHistory'
      class="searchScrollWrapper"
      @scrollEnd='searchMore'>
      <div ref="search">
        <div 
          v-show="!query"
          class="searchHots">
          <p class="title">热门搜索</p>
          <span 
            v-for="item in hots"
            @click="addQuery(item.first)"
            :key="item.id"
            class="searchHotsItem">
            {{item.first}}
          </span>
        </div>
        <div 
          v-show="!query"
          class="shortcutWrapper">
          <div 
            v-show="searchHistory.length"
            class="searchHistory">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span 
                @click="showConfirm"
                class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <SearchList
              @select='addQuery'
              @delete='deleteSearchHistory'
              :searches='searchHistory'
              />
          </div>
        </div>
        <div class="searchResult">
          <suggest
            @select="saveSearch"
            @refresh='refresh'
            ref="suggest"
            :query='query'
            />
        </div>
      </div>
    </scroll>
    <confirm
      ref="confirm"
      @confirm='clearSearchHistory'
      text='是否清空历史记录'
      confirmBtnText='清空'/>
    <router-view></router-view>
  </div>
</transition>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { getSearchHot } from '@/http'
import scroll from '@/components/common/scroll.vue'
import confirm from '@/components/common/comfirm.vue'
import SearchBox from '@/components/common/searchBox.vue'
import SearchList from '@/components/common/searchList.vue'
import suggest from '@/components/common/suggest.vue'
@Component({
  components: {
    scroll,
    confirm,
    SearchBox,
    SearchList,
    suggest
  }
})
export default class Search extends Vue {
  pullup: boolean = true
  hots: any[] = []
  query: string = ''
  $refs!: {
    confirm: any,
    searchWrapper: any,
    scroll: any,
    searchBox: any,
    suggest: any
  }

  @Action('saveSearchHistory') saveSearchHistory!: any
  @Action('deleteSearchHistory') deleteSearchHistory!: any
  @Action('clearSearchHistory') clearSearchHistory!: any
  @Getter('searchHistory') searchHistory!: any[]
  
  handlePlaylist (playlist: any) {

  }
  showConfirm () {
    this.$refs.confirm.show()
  }
  refresh () {
    setTimeout(()=> {
      this.$refs.scroll.refresh()
    }, 20)
  }
  addQuery (query:string) {
    this.$refs.searchBox.setQuery(query)
  }
  saveSearch () {
    this.saveSearchHistory(this.query)
  }
  searchMore () {
    this.$refs.suggest.searchMore()
  }
  private onQueryChange (query: string) {
    this.query = query
  }
  private getSearchHot() {
    getSearchHot().then((res: any) => {
      this.hots = res.hots || []
    })
  }
  created () {
    this.getSearchHot()
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.search-enter-active, .search-leave-active
  transition all 0.3s
.search-enter, .search-leave-to
  transform translate3d(50%, 0, 0)
  opacity 0
.search
  position fixed
  z-index 100
  width 100%
  top 0
  bottom 0
  background $color-background
  .searchBoxWrapper
    padding 10px 40px 10px 43px
    background $color-theme
    .fa
      position absolute
      left 5px
      top 3px
      padding 3px 10px
      font-size 30px
      color #fff
  .searchScrollWrapper
    height 100%
    overflow hidden
    .searchHots
      margin 0 20px
      .title
        padding 15px 5px 0 5px
        height 30px
        line-height 30px
        font-size $font-size-small-x
        color $color-text-g
      span
        display inline-block
        padding 3px 5px
        margin 4px
        border 0.8px solid $color-text-ggg
        border-radius 5px
        line-height 20px
        color $color-text
        font-size $font-size-medium
    .shortcutWrapper
      position relative
      margin 0 auto 
      .searchHistory
        position relative
        margin 10px 25px
        .title
          display flex
          align-items center
          height 30px
          font-size $font-size-small-x
          color $color-text-g
          .text
            flex 1
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text
    .searchResult
      position relative
      width 100%
      top 10px
      bottom 0
</style>