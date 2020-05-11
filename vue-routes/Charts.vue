<template>
    <div id="app">
        <div class="charts-container">
            <ChartTotal :chart-data="monthlySpending" :chartConfig="chartConfig"/>
        </div>
    </div>
</template>

<script>
  import ChartTotal from './components/ChartTotal.vue';

  export default {
    data: () => {
      return {
        name: 'Charts',
        monthlySpending: {},
        chartConfig: {
          margin: 60,
          height: 600 - 2 * 60,
          width: 1000 - 2 * 60,
          heading: 'Spending per month',
        },
      };
    },
    components: {
      ChartTotal,
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
