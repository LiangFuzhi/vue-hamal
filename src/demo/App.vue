<template>
  <div>
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted: function () {
    this.$nextTick(function () {
    })
  },
  data () {
    return {}
  },
  computed: {
  },
  watch: {
  },
  methods: {
  }
}
</script>
