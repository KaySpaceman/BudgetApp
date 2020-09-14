<template>
  <div id="app">
    <div id="page-content" class="chart-page">
      <div class="page-header">
        <h1 class="page-title">Charts</h1>
        <div class="controls">
          <span class="toggle" :class="{ active :activeChart === 'total' }"
                @click="toggleCharts('total')">
            Total
          </span>
          <span class="toggle" :class="{ active :activeChart === 'categorized' }"
                @click="toggleCharts('categorized')">
            Categorized
          </span>
        </div>
      </div>
      <ChartTotal :chart-data="monthlySpending" :chartConfig="totalsChartConfig"
                  v-if="activeChart === 'total'"/>
      <ChartCategorized :chart-data="categorizedSpending" :chartConfig="categorizedChartConfig"
                        v-on:update-data="updateCategorizedData"
                        v-if="activeChart === 'categorized'"/>
    </div>
  </div>
</template>

<script>
import ChartTotal from '../components/chart/ChartTotal.vue';
import ChartCategorized from '../components/chart/ChartCategorized.vue';

export default {
  name: 'Charts',
  data: () => ({
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
    activeChart: 'total',
  }),
  methods: {
    updateCategorizedData(data) {
      this.categorizedSpending = data;
    },
    toggleCharts(chartCode) {
      this.activeChart = chartCode;
    },
  },
  components: {
    ChartTotal,
    ChartCategorized,
  },
};
</script>
