<template>
  <div class="vault">
    <div class="top-details">
      <div class="progress">
        <!--TODO: Add percentage wheel-->
        <span class="percentage" v-text="goalPercentage"/>
      </div>
      <div class="details">
        <div class="properties">
          <span class="name" v-text="vault.Name"/>
          <span class="goal">€ {{vault.Balance}} / {{vault.Goal}}</span>
        </div>
        <div class="controls">
          <img class="icon" src="@/assets/ToEdit.svg" alt="edit"
               @click="selectVault(vault)"/>
          <span class="fund">Fund</span>
          <span class="withdraw">Withdraw</span>
        </div>
      </div>
    </div>
    <div class="sub-goals" v-if="vault.Children && vault.Children.length > 0">
      <!--TODO: List sub-goals and open/close-->
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Vault',
  data: () => ({}),
  props: {
    vault: Object,
  },
  computed: {
    goalPercentage() {
      return Number.parseInt(((this.vault.Balance / this.vault.Goal) * 100).toFixed(0), 10);
    },
  },
  methods: {
    ...mapMutations(['selectVault']),
  },
};
</script>

<style lang="scss" scoped>
.vault {
  background-color: $c-white;
  padding: 5px 10px;
}
</style>
