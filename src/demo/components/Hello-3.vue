<template>
  <div>
    <vh-page :options="options">
      <h1>dragBack: false</h1>
      <h1 v-for="i in 150" :key='i'>{{ msg }}</h1>
    </vh-page>
  </div>
</template>

<script>
export default {
  name: 'demo-3',
  data () {
    return {
      msg: 'Hello Vue 3!',
      options: {
        dragBack: false,
        slideBack: true,
        backgroundColor: '#eee',
        header: {
          title: '页面-3',
          back: true,
          backgroundColor: '#fff',
          color: '#000'
        }
      }
    }
  },
  components: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
</style>
