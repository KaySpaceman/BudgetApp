<template>
  <div class="savings-info">
    <div class="progress">
      <!--TODO: Add progress wheel-->
    </div>
    <div class="stats">
      <div class="unassigned">
        <span class="title">Unassigned</span>
        <span class="value">€ 750</span>
      </div>
      <div class="stored">
        <span class="title">Stored</span>
        <span class="value">€ 1500</span>
      </div>
      <div class="goal">
        <span class="title">Goal</span>
        <span class="value">€ 3800</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SavingsInfo',
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.savings-info {
  background: $c-white;
  border-radius: 4px;
  display: flex;
  max-width: 310px;
  margin: 30px 0;
  padding: 15px 20px;

  .stats {
    display: flex;
  }
}
</style>
