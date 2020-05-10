<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
  export default {
    data: () => {
      return {
        name: 'HelloWorld',
      };
    },
    props: {
      msg: String,
    },
  };
</script>

<style scoped>
    h3 {
        margin: 40px 0 0;
    }
</style>
