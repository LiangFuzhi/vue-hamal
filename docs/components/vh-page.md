## vh-page

**基本用法**
``` vue
<template>
  <div>
    <vh-page :options="options">
      <vh-tabel>
        <template v-slot:default="{sum}">
          <h1 @click="$router.push('/Hello-2')">Hello Vue 1-2!</h1>
          <h1 v-for="i in sum" :key='i' @click="$router.push('/Hello-2')">{{ msg }}</h1>
        </div>
      </template>
    </vh-page>
  </div>
</template>

<script>
import vhTabel from './vh-tabel.vue'
export default {
  name: 'demo-1-1',
  mounted () {
    this.$nextTick(() => {})
  },
  data () {
    return {
      // sum: 15,
      msg: 'Hello Vue 1-1!',
      options: {
        back: false,
        backgroundColor: '#eee',
        header: {
          title: '页面-1-1',
          back: false,
          backgroundColor: '#fff',
          color: '#000',
          show: true
        }
      }
    }
  },
  components: {
    vhTabel
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
```
**例子源码**

https://github.com/LiangFuzhi/vue-hamal/blob/master/src/demo/components/Hello-1-1.vue

**属性**

| 参数       | 类型            | 必须?      | 默认值        | 说明                                                          |
| --------- | --------------- | --------- | ------------ | ------------------------------------------------------------ |
| options   | Object          | No        | 往下看 | 配置页面信息     |
| options.dragBack   | Boolean          | No        | true | 右滑拖动返回     |
| options.slideBack   | Boolean          | No        | true | 右滑手势返回     |
| options.backgroundColor   | String          | No        | #fff | 页面背景色     |
| options.lazy   | Boolean          | No        | true | 页面懒加载     |
| options.header   | Object          | No        | {} | 配置页面信息     |

**options默认值**
``` javascript
{
  back: true,
  backgroundColor: '#fff',
  lazy: true,
  header: {}
}
```

**插槽**

| 名称       | 说明            |
| --------- | --------------- |
| top       | 顶部          |
| header    | 导航栏          |
| header-top   | 导航栏顶部          |
| header-title   | 标题          |
| header-right   | 导航栏右边          |
| header-bottom   | 导航栏底部          |
| footer   | 页脚          |
| bottom   | 底部          |
