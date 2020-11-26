<template>
  <v-app>
    <div id="nav">
      <Navigation/>
    </div>
    <div id="content-wrapper">
      <TopBar/>
      <router-view id="page"/>
    </div>
  </v-app>
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

#app > .v-application--wrap {
  display: flex;
  flex-direction: row;
  height: 100vh;

  #nav {
    height: 100%;
    width: 250px;
  }

  #content-wrapper,
  #content {
    background-color: $c-alice-blue;
    min-height: 100%;
    flex-grow: 1;
  }

  #content-wrapper {
    overflow: scroll;
  }
}
</style>
