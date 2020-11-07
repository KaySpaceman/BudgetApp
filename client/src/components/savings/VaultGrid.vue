<template>
  <div class="vault-grid">
    <Vault v-for="vault in vaultList" :vault="vault" :key="vault.id"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Vault from './Vault.vue';

export default {
  name: 'VaultGrid',
  data: () => ({}),
  computed: {
    ...mapState({ vaultList: (state) => state.vaults.vaultList }),
  },
  methods: {
    ...mapActions(['fetchVaultList']),
  },
  created() {
    if (!this.vaultList || this.vaultList.length === 0) {
      this.fetchVaultList();
    }
  },
  components: {
    Vault,
  },
};
</script>

<style lang="scss" scoped>
.vault-grid {
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr;
  grid-template-rows: 100px;
  grid-auto-columns: 1fr;
  grid-auto-rows: 100px;
  margin: 30px;

  @media (min-width: 1050px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1350px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
