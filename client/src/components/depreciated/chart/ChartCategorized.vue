<template>
  <div class="chart chart-categorized">
    <h2 class="chart-heading" v-text="chartConfig.heading"/>
    <svg id="svg-categorized" class="chart chart-sunburst"/>
    <div class="controls">
      <select-field v-model="timeInterval" label="Interval" :options="availableIntervals" wide
                    @change="fetchCategorizedSpending(timeInterval)"/>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as d3 from 'd3';
import { mapActions, mapState } from 'vuex';
import SelectField from '../../inputs/SelectField';

export default {
  data: () => ({
    name: 'ChartCategorized',
    availableIntervals: [
      { value: 'LAST_MONTH', text: 'Monthly' },
      { value: 'LAST_QUARTER', text: 'Quarterly' },
      { value: 'LAST_HALF_YEAR', text: 'Semiannual' },
      { value: 'LAST_YEAR', text: 'Annual' },
    ],
    timeInterval: 'LAST_QUARTER',
  }),
  props: {
    chartConfig: Object,
  },
  watch: {
    categorizedSpending() {
      this.updateStarburst();
    },
  },
  computed: {
    ...mapState({ categorizedSpending: (state) => state.charts.categorizedSpending }),
  },
  methods: {
    ...mapActions(['fetchCategorizedSpending']),
    updateStarburst() {
      d3.select('#svg-categorized')
        .selectAll('g')
        .remove();

      this.$nextTick(() => {
        this.drawStarburst();
      });
    },
    partition(data) {
      return d3.partition()
        .size([2 * Math.PI, this.chartConfig.radius])(d3.hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value));
    },
    format(data) {
      return d3.format(',d')(data);
    },
    drawStarburst() {
      const partitions = this.partition(this.categorizedSpending);

      const arc = d3.arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(this.chartConfig.radius / 2)
        .innerRadius((d) => d.y0)
        .outerRadius((d) => d.y1 - 1);

      const svg = d3.select('#svg-categorized')
        .attr('width', this.chartConfig.width + this.chartConfig.margin * 2)
        .attr('height', this.chartConfig.height + this.chartConfig.margin * 2)
        .append('g')
        .attr('fill-opacity', 1)
        .attr('transform',
          `translate(${this.chartConfig.width / 2}, ${this.chartConfig.height / 2})`);

      svg.selectAll('path')
        .data(partitions.descendants()
          .filter((d) => d.depth))
        .enter()
        .append('path')
        .attr('fill', (d) => '#0295FF')
        .attr('d', arc)
        .append('title')
        .text((d) => `${d.ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join('/')}\n${this.format(d.value)}`);

      svg.append('g')
        .attr('pointer-events', 'none')
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('font-weight', 600)
        .attr('font-family', 'sans-serif')
        .selectAll('text')
        .data(partitions.descendants()
          .filter((d) => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
        .enter()
        .append('text')
        .attr('transform', (d) => {
          const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
          const y = (d.y0 + d.y1) / 2;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr('dy', '0.35em')
        .text((d) => d.data.name);
    },
  },
  created() {
    if (!this.categorizedSpending || this.categorizedSpending.length === 0 ) {
      this.fetchCategorizedSpending(this.timeInterval);
    }
  },
  mounted() {
    this.chartConfig.radius = this.chartConfig.width / 2;
    this.drawStarburst();
  },
  components: {
    SelectField,
  },
};
</script>
