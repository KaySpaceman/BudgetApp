<template>
  <div id="app">
    <div id="nav">
      <Navigation/>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  components: {
    Navigation,
  },
};
</script>
