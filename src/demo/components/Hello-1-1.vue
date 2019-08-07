<template>
  <div>
    <vh-page :options="options">
      <vh-tabel>
        <div slot-scope="{sum}">
          <router-link to="/home/Hello-1-2" tag="a">
            <h1>Hello Vue 1-2!</h1>
          </router-link>
          <router-link to="/Hello-2" tag="a">
            <h1 v-for="i in sum" :key='i'>{{ msg }}</h1>
          </router-link>
        </div>
      </vh-tabel>
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
