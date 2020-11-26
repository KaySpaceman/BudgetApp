<template>
  <div class="chart-container chart-bars">
    <h2 class="chart-heading" v-text="chartConfig.heading"/>
    <svg id="svg-totals" class="chart chart-bars"/>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { mapActions, mapState } from 'vuex';

export default {
  data: () => ({
    name: 'ChartTotal',
  }),
  watch: {
    totalSpending() {
      this.drawBarChart();
    },
  },
  computed: {
    ...mapState({ totalSpending: (state) => state.charts.totalSpending }),
  },
  props: {
    chartConfig: Object,
  },
  methods: {
    ...mapActions(['fetchTotalSpending']),
    drawBarChart() {
      const svg = d3.select('#svg-totals')
        .attr('width', this.chartConfig.width + this.chartConfig.margin * 2)
        .attr('height', this.chartConfig.height + this.chartConfig.margin * 2)
        .append('g')
        .attr('transform', `translate(${this.chartConfig.margin}, ${this.chartConfig.margin})`);

      const axisX = d3.scaleBand()
        .range([0, this.chartConfig.width])
        .domain(this.totalSpending.map((dataPoint) => dataPoint.x))
        .padding(0.2);

      const axisY = d3.scaleLinear()
        .domain([0, d3.max(this.totalSpending.map((dataPoint) => dataPoint.y))])
        .range([this.chartConfig.height, 0]);

      svg.append('g')
        .attr('transform', `translate(0, ${this.chartConfig.height})`)
        .call(d3.axisBottom(axisX))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

      svg.append('g')
        .call(d3.axisLeft(axisY));

      svg.selectAll('bar')
        .data(this.totalSpending)
        .enter()
        .append('rect')
        .attr('x', (dataPoint) => axisX(dataPoint.x))
        .attr('y', (dataPoint) => axisY(dataPoint.y))
        .attr('width', axisX.bandwidth())
        .attr('height', (dataPoint) => this.chartConfig.height - axisY(dataPoint.y))
        .attr('fill', '#0295FF');
    },
  },
  created() {
    if (!this.totalSpending || this.totalSpending.length === 0) {
      this.fetchTotalSpending();
    }
  },
  mounted() {
    if (this.totalSpending && this.totalSpending.length > 0) {
      this.drawBarChart();
    }
  },
};
</script>
