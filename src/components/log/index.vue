/*
 * @Author: LFZ
 * @Date: 2019-04-17 18:15:04
 * @Last Modified by: LFZ
 * @Last Modified time: 2019-04-17 18:15:04
 * @Description: 错误日志
 */
<template>
<div>
  <vh-page :options="{title:'错误日志'}">
    <div slot="main">
      <pre class="pre" v-html="html"></pre>
    </div>
    <div slot="footer">
      <box gap="10px 10%">
        <x-button type="primary" @click.native="onEmpty">清空</x-button>
      </box>
    </div>
  </vh-page>
</div>
</template>

<script>
import vhPage from '../../page/index.vue'
import {XButton, Box} from 'vux'
export default {
  name: "demo1",
  data() {
    return {
      html: ""
    }
  },
  forward() {
    this.onQuery()
  },
  activated() {

  },
  deactivated() {

  },
  computed: {

  },
  components: {
    vhPage,XButton,Box
  },
  methods: {
    onQuery(){
      this.$log.query().then((data) => {
        this.html = this.syntaxHighlight(data)
      })
    },
    onEmpty(){
      this.$log.empty()
      .then(()=>{
        this.$vux.toast.show({
          text: '清空成功'
        })
        this.onQuery()
      })
    },
    //格式化json数据变成页面
    syntaxHighlight(json) {
      if (typeof json != 'string') {
        json = JSON.stringify(json, null, 2);
      }
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  padding: 10px;
  .string {
    color: #3ab54a;
  }

  .number {
    color: darkorange;
  }

  .boolean {
    color: blue;
  }

  .null {
    color: magenta;
  }

  .key {
    color: #92278f;
  }
}

</style>
