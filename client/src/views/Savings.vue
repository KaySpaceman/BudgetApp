<template>
  <div id="page">
    <div class="content">
      <vault-grid/>
    </div>
    <div class="sidebar">
      <savings-info/>
      <vault-form/>
      <savings-transfer-form/>
    </div>
  </div>
</template>

<script>
import VaultGrid from '../components/savings/VaultGrid.vue';
import SavingsInfo from '../components/savings/SavingsInfo.vue';
import VaultForm from '../components/savings/VaultForm.vue';
import SavingsTransferForm from '../components/savings/SavingsTransferForm.vue';

export default {
  name: 'Savings',
  data: () => ({}),
  components: {
    SavingsTransferForm,
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
