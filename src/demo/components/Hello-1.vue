<template>
  <!-- <div>
    <vh-page :options="options">
      <vh-tabel>
        <router-link to="/Hello-2" tag="a" slot-scope="{sum}">
          <h1 v-for="i in sum" :key='i'>{{ msg }}</h1>
        </router-link>
      </vh-tabel>
    </vh-page>
  </div> -->
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import vhTabel from './vh-tabel.vue'
export default {
  name: 'demo-1',
  mounted () {
    this.$nextTick(() => {})
  },
  data () {
    return {
      // sum: 15,
      msg: 'Hello Vue 1!',
      options: {
        back: false,
        backgroundColor: '#eee',
        header: {
          title: '页面-1',
          back: false,
          backgroundColor: '#fff',
          color: '#000'
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
