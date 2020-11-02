<template>
  <div id="page">
    <div class="content">
      <VaultGrid/>
    </div>
    <div class="sidebar">
      <SavingsInfo/>
      <VaultForm/>
    </div>
  </div>
</template>

<script>
import VaultGrid from '../components/savings/VaultGrid.vue';
import SavingsInfo from '../components/savings/SavingsInfo.vue';
import VaultForm from '../components/savings/VaultForm.vue';

export default {
  name: 'Savings',
  data: () => ({}),
  components: {
    VaultForm,
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
    flex-grow: 1;
  }

  .sidebar {
    padding-right: 30px;
  }
}
</style>
