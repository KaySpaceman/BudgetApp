<template>
    <div id="app">
        <div class="charts-container">
            <ChartTotal :chart-data="monthlySpending" :chartConfig="totalsChartConfig"/>
            <ChartCategorized :chart-data="categorizedSpending" :chartConfig="categorizedChartConfig"/>
        </div>
    </div>
</template>

<script>
  import ChartTotal from './components/ChartTotal.vue';
  import ChartCategorized from './components/ChartCategorized.vue';

  export default {
    data: () => {
      return {
        name: 'Charts',
        monthlySpending: {},
        categorizedSpending: {},
        totalsChartConfig: {
          margin: 60,
          height: 600 - 2 * 60,
          width: 1000 - 2 * 60,
          heading: 'Spending per month',
        },
        categorizedChartConfig: {
          margin: 60,
          height: 600 - 2 * 60,
          width: 600 - 2 * 60,
          heading: 'Spending per category',
        },
      };
    },
    components: {
      ChartTotal,
      ChartCategorized,
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
        margin-top: 20px;
    }
</style>
