<template>
<div class="songList">
  <ul>
    <li class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)">
      <p class="count">{{index + 1}}</p>
      <div class="content">
        <h2 class="name">{{song.name}}</h2>
        <p class="desc">{{getDesc(song)}}</p>
      </div>
    </li>
  </ul>
</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
})
export default class SongList extends Vue {

  @Prop({
    type: Array
  })
  songs!: any[]

  // 选中播放一首歌
  selectItem (item: any, index: number) {
    this.$emit('select', item, index)
  }
  getDesc (song: any) {
    return song.aliaName ? `${song.singer} - ${song.aliaName}`: `${song.singer}`
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
@import '~assets@/stylus/mixin.styl'
.songList
  .item
    position relative
    display flex
    align-items center
    box-sizing border-box
    height 60px
    border-bottom 1px solid rgb(288, 288, 288)
    .count
      flex 0 0 50px
      width 50px
      text-align center
      color $color-text-g
    .content
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-top 4px
        width 80%
        color $color-text
        no-wrap()
      .desc
        no-wrap()
        width 80%
        font-size 12px
        color $color-text-g
</style>