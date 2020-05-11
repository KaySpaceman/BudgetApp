<template>
    <div class="chart chart-categorized">
        {{chartData}}
    </div>
</template>

<script>
  export default {
    data: () => {
      return {
        name: 'ChartCategorized'
      };
    },
    props: {
      chartData: Object,
    },
  };
</script>

<style scoped>
    h3 {
        margin: 40px 0 0;
    }
</style>
