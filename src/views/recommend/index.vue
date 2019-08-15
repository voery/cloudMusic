<template>
<div class="recommend">
  <MHeader/>
  <TTab/>
  <router-view />
</div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import MHeader from '@/components/mHeader/index.vue'
import TTab from '@/components/tTab/index.vue'
@Component({
  components: {
    MHeader,
    TTab
  }
})
export default class Recommend extends Vue {}
</script>
<style lang="stylus">
</style>