<template>
  <div>
    <vh-page :options="options">
      <vh-tabel>
        <template v-slot:default="{sum}">
          <h1 v-for="i in sum" :key='i' @click="$router.push('/Hello-2')">{{ msg }}</h1>
        </template>
      </vh-tabel>
    </vh-page>
  </div>
</template>

<script>
import vhTabel from './vh-tabel.vue'
export default {
  name: 'demo-1-2',
  mounted () {
    this.$nextTick(() => {})
  },
  data () {
    return {
      // sum: 15,
      msg: 'Hello Vue 1-2!',
      options: {
        dragBack: false,
        slideBack: false,
        backgroundColor: '#eee',
        header: {
          title: '页面-1-2',
          back: true,
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
