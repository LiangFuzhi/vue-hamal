<template>
  <vh-scroller ref="vhScroller" @on-loading="onLoading" @on-refresh="onRefresh">
    <slot :sum="sum"></slot>
  </vh-scroller>
</template>

<script>
export default {
  name: '',
  mixins: [],
  components: {},
  data () {
    return {
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      sum: 15
    }
  },
  computed: {},
  props: {},
  watch: {},
  created () {},
  mounted () {
  },
  updated () {},
  filters: {},
  methods: {
    onRefresh () {
      console.log('触发刷新')
      setTimeout(() => {
        this.sum = 15
        this.$refs.vhScroller.onReset()
      }, 1000)
    },
    onLoading () {
      console.log('触发加载更多')
      setTimeout(() => {
        if (this.sum > 50) {
          this.$refs.vhScroller.onPauseLoading()
        } else {
          this.sum += 10
          this.$refs.vhScroller.onRecoveryLoading()
        }
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>

</style>
