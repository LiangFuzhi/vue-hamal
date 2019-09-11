## vh-scroller
**基本用法**
``` html
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
```
**例子源码**

https://github.com/LiangFuzhi/vue-hamal/blob/master/src/demo/components/vh-tabel.vue

**属性**

| 参数       | 类型            | 必须?      | 默认值        | 说明                                                          |
| --------- | --------------- | --------- | ------------ | ------------------------------------------------------------ |
| options   | Object          | No        | 往下看 | 配置导航栏信息     |
| options.backgroundColor   | String          | No        | #fff | 导航来背景色     |
| options.color   | String          | No        | #000 | 导航栏颜色颜色     |
| options.show   | Boolean          | No        | true | 显示导航栏     |
| options.title   | String          | No        |  | 标题     |

**options默认值**
``` javascript
{
  up: {
    deltaY: 60, // 悬停位置
    trigger: 50, // 触发位置
    text: ['下拉刷新', '释放刷新', '正在刷新', '刷新成功'],
    delay: 500, // 延时执行动画
    duration: 300, // 动画时间
    loading: false, // 加载中
    state: 0 // 状态码对应text下标
  },
  down: {
    deltaY: 60, // 悬停位置
    trigger: 50, // 触发位置
    text: ['上拉加载更多', '正在加载更多', '我是有底线的'],
    loading: false, // 加载中
    pause: false, // 暂停
    state: 0 // 状态码对应text下标
  }
}
```
**插槽**

| 名称       | 说明            |
| --------- | --------------- |
| up       | 下拉的内容          |
| down   | 拉到底部的内容          |

**事件**

| 名称       | 说明            |
| --------- | --------------- |
| on-refresh       | 正在刷新          |
| on-loading    | 正在加载          |

暂停
``` javascript
this.$refs.vhScroller.onPauseLoading()
```

恢复
``` javascript
this.$refs.vhScroller.onRecoveryLoading()
```