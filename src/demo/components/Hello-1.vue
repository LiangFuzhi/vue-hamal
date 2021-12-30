<template>
  <!-- <div>
    <vh-page :options="options">
      <vh-tabel>
          <h1 v-for="i in sum" :key='i' @click="$router.push('/Hello-2')">{{ msg }}</h1>
      </vh-tabel>
    </vh-page>
  </div> -->
  <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
  </router-view>
</template>

<script>
// import vhTabel from './vh-tabel.vue'
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
        dragBack: false,
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
    // vhTabel
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
