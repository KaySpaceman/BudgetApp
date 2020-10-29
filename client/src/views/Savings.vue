<template>
  <div id="page">
    <div class="content">
      <VaultGrid/>
    </div>
    <div class="sidebar">
      <SavingsInfo/>
    </div>
  </div>
</template>

<script>
import VaultGrid from '../components/savings/VaultGrid.vue';
import SavingsInfo from '../components/savings/SavingsInfo.vue';

export default {
  name: 'Savings',
  data: () => ({}),
  components: {
    VaultGrid,
    SavingsInfo,
  },
};
</script>

<style lang="scss" scoped>
#page {
  display: flex;
  flex-direction: row;

  .content {
    flex-basis: 60%;
  }

  .sidebar {
    flex-basis: 40%;
  }
}
</style>
