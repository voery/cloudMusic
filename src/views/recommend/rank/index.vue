<template>
<div class="rank" ref="rank">
  <scroll
    class="toplist"
    ref="scroll"
    :data='cloundTopList'>
    <ul>
      <li class="item"
        v-for="item in cloundTopList"
        :key="item.id"
        @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.coverImgUrl" width="100" height="100">
          </div>
          <ul class="songlist">
            <li 
              v-for="(song, index) in item.top"
              :key="index"
              class="song">
              <span>{{index + 1}}</span>
              <span>{{song.name}}{{song.ar[0]? ' - ' + song.ar[0].name : ''}}</span>
            </li>
          </ul>
      </li>
    </ul>
    <div 
      v-show="showLoading"
      class="loadingContent">
      <loading/>
    </div>
  </scroll>
  <router-view></router-view>
</div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import { getTop } from '@/http'
import scroll from '@/components/common/scroll.vue'
import loading from '@/components/common/loading.vue'
const YUNMUSIC_TOP = [0, 1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
@Component({
  components: {
    scroll,
    loading
  }
})
export default class Rank extends Vue {
  cloundTopList: any[] = []
  showLoading: boolean = true

  @Mutation('setTopList') setTopList!: any

  selectItem (item: any) {
    this.$router.push({
      path: `/recommend/rank/rankDetail`
    })
    this.setTopList(item)
  }
  private getTop () {
    YUNMUSIC_TOP.forEach((item: any) => {
      getTop(item).then((res:any)=> {{
        let list = res.playlist
        list.idx = item
        list.top = res.playlist.tracks.slice(0, 3)
        this.cloundTopList.push(list)
        this.showLoading = false
      }})
    })
  }

  created() {
    this.getTop()
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    padding-top 5px
    .item
      display flex
      margin 0 10px
      padding 3px 0
      height 100px
      border-bottom 1px solid rgb(228, 228, 228)
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
        img 
          border-radius 3px
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        overflow hidden
        color $color-text
        font-size $font-size-small-x
        .song
          no-wrap()
          line-height 30px
    .loadingContainer
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
  .loadingContent
    position fixed
    width 100%
    top 70%
    transform translateY(-50%)
</style>