<template>
<div id="app">
  <router-view />
  <Player/>
</div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import Player from '@/components/player/index.vue'
@Component({
  components: {
    Player
  }
})
export default class App extends Vue {
  msg: string = 'hello world'
}
</script>
<style lang="stylus">
@import '~assets@/stylus/index.styl'
// @import '~assets@/font-awesome/css/font-awesome.css'
</style>
<style lang="sass">
@import "~assets@/font-awesome/scss/font-awesome.scss"
</style>
