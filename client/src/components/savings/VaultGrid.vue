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
  max-width: 650px;
  margin: 30px;
}
</style>
