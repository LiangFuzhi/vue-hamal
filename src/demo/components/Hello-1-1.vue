<template>
  <div>
    <vh-page :options="options">
      <vh-tabel>
        <template v-slot:default="{sum}">
          <h1 @click="$router.push('/Hello-1-2')">Hello Vue 1-2!</h1>
          <h1 v-for="i in sum" :key='i' @click="$router.push('/Hello-2')">{{ msg }}</h1>
        </template>
      </vh-tabel>
    </vh-page>
  </div>
</template>

<script>
import vhTabel from './vh-tabel.vue'
export default {
  name: 'demo-1-1',
  mounted () {
    this.$nextTick(() => { })
  },
  data () {
    return {
      // sum: 15,
      msg: 'Hello Vue 1-1!',
      options: {
        dragBack: false,
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
