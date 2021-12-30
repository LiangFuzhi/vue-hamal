<template>
  <div>
    <vh-page :options="options">
      <template v-slot:header-right>
        <div @click="click">提交</div>
      </template>
      <vhTabel>
        <h1>dragBack: true</h1>
        <h1 v-for="i in 150" :key='i' @click="$router.push('/Hello-3')">{{ msg }}</h1>
      </vhTabel>
    </vh-page>
  </div>
</template>

<script>
import vhTabel from './vh-tabel.vue'
export default {
  name: 'demo-2',
  data () {
    return {
      msg: 'Hello Vue 2!',
      options: {
        dragBack: true,
        backgroundColor: '#eee',
        header: {
          title: '页面-2',
          back: true,
          backgroundColor: '#fff',
          color: '#000'
        }
      }
    }
  },
  forward () {
    // Object.assign(this.$data, this.$options.data())
  },
  components: {
    vhTabel
  },
  methods: {
    click () {
      this.msg = 'Hello Vue 2-2!'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
