<template>
  <div class="savings-info">
    <div class="progress">
      <doughnut-chart :percent="goalPercentage" :width="50" :height="50"/>
    </div>
    <div class="stats">
      <div class="metric unassigned">
        <span class="name">Unassigned</span>
        <span class="value">€ {{ unassignedSavings }}</span>
      </div>
      <div class="metric stored">
        <span class="name">Stored</span>
        <span class="value">€ {{ storedSavings }}</span>
      </div>
      <div class="metric goal">
        <span class="name">Goal</span>
        <span class="value">€ {{ savingsGoal }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import DoughnutChart from '../charts/Doughnut.vue';

export default {
  name: 'SavingsInfo',
  data: () => ({}),
  computed: {
    ...mapState({
      unassignedSavings: (state) => state.users.UnassignedSavings,
      storedSavings: (state) => state.vaults.storedSavings,
      savingsGoal: (state) => state.vaults.savingsGoal,
    }),
    goalPercentage() {
      return Number.parseInt(((this.storedSavings / this.savingsGoal) * 100).toFixed(0), 10) || 0;
    },
  },
  methods: {
    ...mapActions(['loginUser']),
  },
  created() {
    // TODO: Remove once authentication is implemented
    if (!this.unassignedSavings) {
      this.loginUser({
        email: 'test@test.com',
        password: 'test123',
      });
    }
  },
  components: {
    DoughnutChart,
  },
};
</script>

<style lang="scss" scoped>
.savings-info {
  background: $c-white;
  border-radius: 4px;
  display: flex;
  max-width: 310px;
  height: 60px;
  margin: 30px 0;
  padding: 0 15px;

  .progress {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto 15px;
    height: 50px;
    width: 50px;
  }

  .stats {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
    align-items: center;

    .metric {
      display: flex;
      flex-flow: column;
      align-items: center;
      width: 60px;

      .name {
        font-weight: $fw-semi-bold;
        font-size: 10px;
        line-height: 14px;
        color: $c-cadet-blue-crayola;
        text-transform: uppercase;
      }

      .value {
        font-weight: $fw-semi-bold;
        font-size: 14px;
        line-height: 19px;
        color: $c-dodger-blue;
      }
    }
  }
}
</style>
