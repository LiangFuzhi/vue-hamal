## vh-header
**基本用法**
``` vue
<template>
  <vh-header :options="config">标题</vh-header>
</template>

<script>
export default {
  data () {
    return {
      config: {
        title: '页面-1-1',
        back: false,
        backgroundColor: '#fff',
        color: '#000',
        show: true
      }
    }
  }
}
</script>
```

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
  back: true,
  backgroundColor: '#fff',
  color: '#000',
  show: true,
  title: ''
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
