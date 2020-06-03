<template>
  <div id="app">
    <Navigation/>
    <div id="page-content" class="upload-section">
      <h1>The Budget App</h1>
      <p>Welcome to my spending and budget planing app</p>
      <p>Author: Kristers Lielups</p>
    </div>
  </div>
</template>

<script>
  import Navigation from './components/Navigation.vue';

  export default {
    name: 'Index',
    data: () => {
      return {};
    },
    components: {
      Navigation,
    },
  };
</script>
