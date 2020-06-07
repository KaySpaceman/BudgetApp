<template>
    <div class="chart chart-categorized">
        <h2 class="chart-heading" v-text="chartConfig.heading"/>
        <svg id="svg-categorized" class="chart chart-sunburst"/>
        <div class="controls">
            <TimeIntervalSelect :items="availableIntervals" :interval="interval" v-model="interval"/>
        </div>
    </div>
</template>

<script>
  import TimeIntervalSelect from './TimeIntervalSelect.vue';

  export default {
    data: () => {
      return {
        name: 'ChartCategorized',
        availableIntervals: {
          'monthly': 'Monthly',
          'quarterly': 'Quarterly',
          'semiannual': 'Semiannual',
          'annual': 'Annual',
        },
        interval: 'quarterly',
      };
    },
    props: {
      chartData: Object,
      chartConfig: Object,
    },
    watch: {
      interval: function (newInterval) {
        $.post('/charts/data/categorized', { timeInterval: newInterval }, (data) => {
          this.$emit('update-data', data);
          this.updateStarburst();
        })
          .fail(() => {
            alert('Failed to fetch new chart data');
          });
      },
    },
    methods: {
      updateStarburst: function () {
        d3.select('#svg-categorized')
          .selectAll('g')
          .remove();

        this.$nextTick(() => {
          this.drawStarburst();
        });
      },
      partition: function (data) {
        return d3.partition()
          .size([2 * Math.PI, this.chartConfig.radius])
          (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value));
      },
      color: function (data) {
        return d3.scaleOrdinal(
          d3.quantize(
            d3.interpolateRainbow,
            (data.children || []).length + 1,
          ))();
      },
      format: function (data) {
        return d3.format(',d')(data);
      },
      drawStarburst: function () {
        const partitions = this.partition(this.chartData);

        const arc = d3.arc()
          .startAngle(d => d.x0)
          .endAngle(d => d.x1)
          .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
          .padRadius(this.chartConfig.radius / 2)
          .innerRadius(d => d.y0)
          .outerRadius(d => d.y1 - 1);

        const svg = d3.select('#svg-categorized')
          .attr('width', this.chartConfig.width + this.chartConfig.margin * 2)
          .attr('height', this.chartConfig.height + this.chartConfig.margin * 2)
          .append('g')
          .attr('fill-opacity', 0.6)
          .attr('transform', `translate(${this.chartConfig.width / 2}, ${this.chartConfig.height / 2})`);

        svg.selectAll('path')
          .data(partitions.descendants()
            .filter(d => d.depth))
          .enter()
          .append('path')
          .attr('fill', d => {
            while (d.depth > 1) d = d.parent;
            return this.color(d);
          })
          .attr('d', arc)
          .append('title')
          .text(d => `${d.ancestors()
            .map(d => d.data.name)
            .reverse()
            .join('/')}\n${this.format(d.value)}`);

        svg.append('g')
          .attr('pointer-events', 'none')
          .attr('text-anchor', 'middle')
          .attr('font-size', 10)
          .attr('font-family', 'sans-serif')
          .selectAll('text')
          .data(partitions.descendants()
            .filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
          .enter()
          .append('text')
          .attr('transform', function (d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
          })
          .attr('dy', '0.35em')
          .text(d => d.data.name);
      },
    },
    mounted: function () {
      this.chartConfig.radius = this.chartConfig.width / 2;
      this.drawStarburst();
    },
    components: {
      TimeIntervalSelect,
    },
  };
</script>
