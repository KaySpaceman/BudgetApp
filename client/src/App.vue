<template>
  <div id="app">
    <div id="nav">
      <Navigation/>
    </div>
    <div id="content-wrapper">
      <TopBar/>
      <router-view id="content"/>
    </div>
  </div>
</template>

<script>
import Navigation from './components/global/Navigation.vue';
import TopBar from './components/global/TopBar.vue';

export default {
  name: 'App',
  components: {
    Navigation,
    TopBar,
  },
};
</script>

<style lang="scss">
* {
  font-family: $f-open-sans;
  line-height: 25px;
  letter-spacing: -0.333333px;
  color: $c-earie-black;
}
</style>
