<template>
<div class="loading">
  <img :src="require('@/assets/image/loading.gif')" width="24" height="24">
</div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
})
export default class Loading extends Vue {
  @Prop({
    type: String,
    default: '正在载入'
  })
  title!: string
}
</script>
<style lang="stylus" scoped>
@import '~assets@/stylus/variabel.styl'
.loading
  width 100%
  height 40px
  text-align center
  img
    margin-top 10px
</style>