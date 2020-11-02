<template>
  <div class="vault" :class="{ 'expanded': showSubGoals }">
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
          <img class="icon" src="@/assets/Minus.svg" alt="withdraw" @click="deFundVault(vault)"/>
          <img class="icon" src="@/assets/Plus.svg" alt="fund" @click="fundVault(vault)"/>
          <img class="icon" src="@/assets/Checkmark.svg" alt="close" @click="closeVault(vault)"/>
          <img class="icon" src="@/assets/ToEdit.svg" alt="edit" @click="selectVault(vault)"/>
          <img class="icon sub-goal-toggle" @click="showSubGoals = !showSubGoals"
               src="@/assets/ToEdit.svg" alt="toggle sub-goals">
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

      .percentage {
        font-weight: $fw-extra-bold;
        font-size: 16px;
        line-height: 22px;
        color: $c-charcoal;
      }
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
}
</style>
