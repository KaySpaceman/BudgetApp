<template>
  <div class="doughnut-chart">
    <span class="value" v-text="percent"/>
    <canvas :id="`canvas-${this._uid}`" :width="width || 72" :height="height || 72">
    </canvas>
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
  name: 'DoughnutChart',
  data: () => ({
    chart: {},
  }),
  props: {
    percent: Number,
    colorHex: String,
    cutoutPercentage: Number,
    height: Number,
    width: Number,
  },
  computed: {
    data() {
      return [this.percent, 100 - this.percent];
    },
    backgroundColor() {
      return [this.colorHex || '#0295FF', 'transparent'];
    },
    borderColor() {
      return ['#fff', 'transparent'];
    },
  },
  watch: {
    data(newData) {
      this.chart.data.datasets[0].data = newData;
      this.chart.update();
    },
    backgroundColor(newBackgrounds) {
      this.chart.data.datasets[0].backgroundColor = newBackgrounds;
      this.chart.update();
    },
    borderColor(newBorders) {
      this.chart.data.datasets[0].borderColor = newBorders;
      this.chart.update();
    },
  },
  mounted() {
    const canvas = document.getElementById(`canvas-${this._uid}`);

    this.chart = new Chart.Chart(canvas, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor,
          borderColor: this.borderColor,
        }],
      },
      options: {
        cutoutPercentage: this.cutoutPercentage || 60,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.doughnut-chart {
  position: relative;

  .value {
    position: absolute;
    font-weight: $fw-extra-bold;
    font-size: 16px;
    line-height: 22px;
    color: $c-charcoal;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
</style>
