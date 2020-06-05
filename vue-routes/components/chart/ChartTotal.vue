<template>
    <div class="chart-container chart-bars">
        <h1 class="chart-heading" v-text="chartConfig.heading"/>
        <svg id="svg-totals" class="chart chart-bars"/>
    </div>
</template>

<script>
  export default {
    data: () => {
      return {
        name: 'ChartTotal',
      };
    },
    mounted: function () {
      const svg = d3.select('#svg-totals')
        .attr('width', this.chartConfig.width + this.chartConfig.margin * 2)
        .attr('height', this.chartConfig.height + this.chartConfig.margin * 2)
        .append('g')
        .attr('transform', `translate(${this.chartConfig.margin}, ${this.chartConfig.margin})`);

      const axisX = d3.scaleBand()
        .range([0, this.chartConfig.width])
        .domain(this.chartData.map((dataPoint) => dataPoint.date))
        .padding(0.2);

      const axisY = d3.scaleLinear()
        .domain([0, d3.max(this.chartData.map((dataPoint) => dataPoint.value))])
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
        .data(this.chartData)
        .enter()
        .append('rect')
        .attr('x', (dataPoint) => axisX(dataPoint.date))
        .attr('y', (dataPoint) => axisY(dataPoint.value))
        .attr('width', axisX.bandwidth())
        .attr('height', (dataPoint) => this.chartConfig.height - axisY(dataPoint.value))
        .attr('fill', '#5263b3');
    },
    props: {
      chartData: Array,
      chartConfig: Object,
    },
  };
</script>
