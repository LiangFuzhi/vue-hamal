<template>
  <div>
    <vh-page :options="options">
      <vh-scroller>
        <router-link to="/Hello-2" tag="a">
          <h1 v-for="i in 15" :key='i'>{{ msg }}</h1>
        </router-link>
      </vh-scroller>
    </vh-page>
  </div>
</template>

<script>
export default {
  name: 'demo-1',
  mounted () {
    this.$nextTick(() => {})
  },
  data () {
    return {
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
