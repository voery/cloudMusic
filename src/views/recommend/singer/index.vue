<template>
<div class="singer" ref="singer">
  <SingerList :data='singers' @select="selectSinger" ref="list"/>
  <router-view></router-view>
</div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import { getSingers } from '@/http'
import Singer from '@/assets/js/singer'
import SingerList from '@/components/common/singerList.vue'
const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOT_SINGERS = 10
@Component({
  components: {
    SingerList
  }
})
export default class Singers extends Vue {
  singers: any[] = []
  $refs!: {
    singer: any,
    list: any
  }

  @State('playlist') playlist!: any[]
  @Mutation('setSinger') setSinger!: any

  @Watch('playlist')
  playlistHandle (newVal: any) {
    this.handlePlaylist(newVal)
  }

  handlePlaylist (playlist: any) {
    const bottom = playlist.length > 0 ? '60px' : ''
    this.$refs.singer.style.bottom = bottom
    // console.log(this.$refs.list)
    this.$refs.list.refresh()
  }
  getSingers () {
    getSingers().then((res: any) => {
      let s = res.artists
      s.map((item: any) => {
      let py = pinyin(item.name[0], {
          style: pinyin.STYLE_FIRST_LETTER
      })
      item.initial = py[0][0].toUpperCase()
      })
      this.singers = this.normalizeSinger(s)
      console.log(this.singers)
    })
  }
  selectSinger (singer: any) {
    // 跳转到详情
    this.$router.push('/recommend/singer/singerDetail')
    this.setSinger(singer)
  }
  private normalizeSinger (list: any) {
    let map:any = {
        hot: {
        title: HOT_NAME,
        items: []
        }
    }
    list.forEach((item:any, index: number) => {
        if (index < HOT_SINGERS) {
        map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / ')
        }))
        }

        const key = item.initial
        if (!map[key]) {
        map[key] = {
            title: key,
            items: []
        }
        }
        map[key].items.push(new Singer({
        id: item.id,
        name: item.name,
        avatar: item.img1v1Url,
        aliaName: item.alias[0]
        }))
    })
    let hot = []
    let ret = []
    for (const key in map) {
        let val = map[key]
        if (val.title.match(/[A-Z]/)) {
        ret.push(val)
        } else if (val.title === HOT_NAME) {
        hot.push(val)
        }
    }
    ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }
  created() {
    console.log('singer')
    this.getSingers()
  }
  mounted() {
    this.handlePlaylist(this.playlist)
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>