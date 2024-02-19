<template>
  <div id="app">
    <SiteNavigation />
    <router-view />
  </div>
</template>

<script>
import SiteNavigation from './components/SiteNavigation.vue';

export default {
  name: 'App',
  components: {
    SiteNavigation,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
