<template>
  <div class="vault" :class="{ 'expanded': showSubGoals }">
    <div class="top-details">
      <div class="progress">
        <doughnut-chart :percent="goalPercentage" :color-hex="vault.Color"/>
      </div>
      <div class="details">
        <div class="properties">
          <span class="name" v-text="vault.Name"/>
          <span class="goal">€ {{vault.Balance}} / {{vault.Goal}}</span>
        </div>
        <div class="controls">
          <vault-transfer-popout :id="vault.id" :balance="vault.Balance" withdrawal v-slot="slot">
            <img class="icon" src="@/assets/Minus.svg" alt="withdraw" v-on="slot.on"/>
          </vault-transfer-popout>
          <vault-transfer-popout :id="vault.id" v-slot="slot">
            <img class="icon" src="@/assets/Plus.svg" alt="fund" v-on="slot.on"/>
          </vault-transfer-popout>
          <img class="icon" src="@/assets/Checkmark.svg" alt="close"
               @click="deleteVault(vault.id)"/>
          <img class="icon" src="@/assets/ToEdit.svg" alt="edit" @click="selectVault(vault)"/>
          <img class="icon sub-goal-toggle" @click="showSubGoals = !showSubGoals"
               src="@/assets/ToEdit.svg" alt="toggle sub-goals" v-if="vault.Children.length > 0">
        </div>
      </div>
    </div>
    <div class="sub-goals" v-if="showSubGoals">
      <sub-goal v-for="subGoal in vault.Children" :key="subGoal.id" :sub-goal="subGoal" no-actions/>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import VaultTransferPopout from './VaultTransferPopout.vue';
import SubGoal from './SubGoal.vue';
import DoughnutChart from '../charts/Doughnut.vue';

export default {
  name: 'Vault',
  data: () => ({
    showSubGoals: false,
  }),
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
    ...mapActions(['deleteVault']),
  },
  components: {
    DoughnutChart,
    SubGoal,
    VaultTransferPopout,
  },
};
</script>

<style lang="scss" scoped>
.vault {
  background-color: $c-white;
  border-radius: 3px;
  padding: 10px;
  place-self: stretch;
  position: relative;
  display: flex;
  flex-flow: column;

  &.expanded {
    grid-row-end: span 2;

    .top-details > .details > .controls > .icon.sub-goal-toggle {
      transform: rotate(-90deg);
    }
  }

  .top-details {
    display: flex;
    flex-wrap: nowrap;

    .progress {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
      height: 72px;
      width: 72px;
    }

    .details {
      display: flex;
      flex-flow: column;
      flex-grow: 1;

      .properties {
        text-align: right;
        font-weight: $fw-semi-bold;

        .name {
          display: block;
          font-size: 14px;
          line-height: 19px;
          color: $c-earie-black;
        }

        .goal {
          font-size: 12px;
          line-height: 16px;
          color: $c-cadet-blue-crayola;
        }
      }

      .controls {
        display: flex;
        justify-content: flex-end;
        margin: auto 0 10px;

        .icon {
          cursor: pointer;
          margin: 0 2px;
          height: 10px;
          width: 10px;

          &:hover {
            filter: brightness(0%);
          }

          &:last-child {
            margin-right: 0;
          }

          &:first-child {
            margin-left: 0;
          }

          &.sub-goal-toggle {
            position: absolute;
            bottom: 5px;
            transform: rotate(90deg);
            right: calc(50% - 5px);
          }
        }
      }
    }
  }

  .sub-goals {
    padding: 0 15px 15px;
    flex-grow: 1;
    overflow: scroll;
  }
}
</style>
