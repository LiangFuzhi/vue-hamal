<template>
<div>
  <vh-page :options="options">
    <pre class="pre" v-html="html"></pre>
    <div class="footer" slot="footer">
      <div gap="10px 10%">
        <button class="weui-btn weui-btn_primary" @click="onEmpty">清空</button>
      </div>
    </div>
  </vh-page>
</div>
</template>

<script>
export default {
  name: 'log',
  data () {
    return {
      options: {
        dragBack: true,
        backgroundColor: '#fff',
        lazy: false,
        header: {
          title: '错误日志',
          back: true,
          backgroundColor: '#fff',
          color: '#000',
          show: false
        }
      },
      html: ''
    }
  },
  forward () {
    this.onQuery()
  },
  computed: {
  },
  components: {
  },
  methods: {
    onQuery () {
      this.$log.query().then((data) => {
        // alert(data)
        this.html = this.syntaxHighlight(data)
      }).catch((error) => {
        alert(error)
      })
    },
    onEmpty () {
      this.$log.empty()
        .then(() => {
          this.onQuery()
        })
    },
    // 格式化json数据变成页面
    syntaxHighlight (json) {
      if (typeof json !== 'string') {
        json = JSON.stringify(json, null, 2)
      }
      json = json.replace(/&/g, '&amp').replace(/</g, '&lt').replace(/>/g, '&gt')
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        var cls = 'number'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key'
          } else {
            cls = 'string'
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return '<span class="' + cls + '">' + match + '</span>'
      })
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
.footer {
  margin: 10px 10%;
  button {
    width: 100%;
  }
  .weui-btn_primary {
    background-color: #fe484c;
  }
  .weui-btn {
    color: #fff;
    padding-left:14px;
    padding-right:14px;
    font-size: 18px;
    border-top-left-radius:5px;
    border-top-right-radius:5px;
    border-bottom-right-radius:5px;
    border-bottom-left-radius:5px;
    content: "viewport-units-buggyfill; padding-left:14px; padding-right:14px; font-size: 18px; border-radius:5px";
    padding-left:14px;
    padding-right:14px;
    font-size: 18px;
    border-radius:5px;
    line-height: 2.33333333;
    border-width: 0;
    outline: 0;
    -webkit-appearance: none;
  }
}
</style>
