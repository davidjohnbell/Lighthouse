<template>
<canvas ref="canvas" width="1280" height="720"></canvas>
</template>

<script>
import GLinit from '../engine/GLinit'

export default {
  data() {
    return {
    }
  },

  methods: {
    test() {

    }
  },

  mounted() {
    let initObject = new GLinit(this.$refs.canvas);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
