<template>
  <div>
    <vh-page :options="{title:'页面-3',back:true}">
      <!-- <router-link slot="main" to="/Hello-2" tag="a"> -->
        <h1 v-for="i in 15" :key='i'>{{ msg }}</h1>
      <!-- </router-link> -->
    </vh-page>
  </div>
</template>

<script>
export default {
  name: 'demo-3',
  data () {
    return {
      msg: 'Hello Vue 3!'
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
