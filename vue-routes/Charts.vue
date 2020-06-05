<template>
    <div id="app">
        <Navigation/>
        <div id="page-content" class="charts-container">
            <ChartTotal :chart-data="monthlySpending" :chartConfig="totalsChartConfig"/>
            <ChartCategorized :chart-data="categorizedSpending" :chartConfig="categorizedChartConfig"
                              v-on:update-data="updateCategorizedData"/>
        </div>
    </div>
</template>

<script>
  import ChartTotal from './components/chart/ChartTotal.vue';
  import ChartCategorized from './components/chart/ChartCategorized.vue';
  import Navigation from './components/Navigation.vue';

  export default {
    name: 'Charts',
    data: () => {
      return {
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
    methods: {
      updateCategorizedData: function (data) {
        this.categorizedSpending = data;
      },
    },
    components: {
      Navigation,
      ChartTotal,
      ChartCategorized,
    },
  };
</script>
