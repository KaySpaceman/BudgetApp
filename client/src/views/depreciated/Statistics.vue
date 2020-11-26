<template>
  <div id="page">
    <h3>
      These chart components are from an older version of this app and will be rewritten later
    </h3>
    <ChartTotal :chartConfig="totalsChartConfig"/>
    <ChartCategorized :chartConfig="categorizedChartConfig"/>
  </div>
</template>

<script>
import ChartTotal from '../../components/depreciated/chart/ChartTotal.vue';
import ChartCategorized from '../../components/depreciated/chart/ChartCategorized.vue';

export default {
  name: 'Charts',
  data: () => ({
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
  }),
  components: {
    ChartTotal,
    ChartCategorized,
  },
};
</script>

<style lang="scss" scoped>
#page {
  margin: 30px;
}
</style>
