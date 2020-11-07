<template>
  <div class="sub-goal">
    <div class="details">
      <div class="properties">
        <span class="name">{{ subGoal.Name }} - {{ goalPercentage }} %</span>
        <div class="progress">
          <span class="balance" v-text="subGoal.Balance" v-if="subGoal.Balance < subGoal.Goal"/>
          <span class="divider" v-if="subGoal.Balance < subGoal.Goal"> / </span>
          <span class="goal" v-text="subGoal.Goal"/>
        </div>
      </div>
      <div class="progress-bar">
        <div class="fill" :style="{ width: `${goalPercentage}%` }"/>
        <div class="background"/>
      </div>
    </div>
    <div class="actions" v-if="!noActions">
      <sub-goal-edit-popout v-model="subGoalMeta" v-slot="slot">
        <img class="icon" src="@/assets/Pencil.svg" alt="edit" v-on="slot.on"/>
      </sub-goal-edit-popout>
      <img class="icon" src="@/assets/Delete.svg" alt="delete" @click="$emit('delete')"/>
    </div>
  </div>
</template>

<script>
import SubGoalEditPopout from './SubGoalEditPopout.vue';

export default {
  name: 'SubGoal',
  data: () => ({}),
  props: {
    subGoal: Object,
    noActions: Boolean,
  },
  computed: {
    goalPercentage() {
      return Number.parseInt(((this.subGoal.Balance / this.subGoal.Goal) * 100)
        .toFixed(0), 10)
        || 0;
    },
    subGoalMeta: {
      get() {
        const { Name, Goal } = this.subGoal;

        return {
          Name,
          Goal,
        };
      },
      set(newValues) {
        this.$emit('change', { ...this.subGoal, ...newValues });
      },
    },
  },
  model: {
    prop: 'subGoal',
    event: 'change',
  },
  components: {
    SubGoalEditPopout,
  },
};
</script>

<style lang="scss" scoped>
.sub-goal {
  display: flex;

  .details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .properties {
      display: flex;
      font-size: 8px;
      line-height: 11px;
      font-weight: $fw-semi-bold;
      color: $c-earie-black;

      .progress {
        margin: 0 5px 0 auto;

        .balance,
        .divider {
          color: $c-cadet-blue-crayola;
        }
      }
    }

    .progress-bar {
      height: 5px;
      width: 100%;
      position: relative;

      .fill,
      .background {
        position: absolute;
        border-radius: 3px;
        width: 100%;
        height: 100%;
      }

      .fill {
        transition: width 2s;
        background-color: $c-dodger-blue;
        z-index: 1;
      }

      .background {
        background-color: $c-off-white;
      }
    }
  }

  .actions {
    margin-left: 5px;

    .icon {
      margin: auto 2px;
      cursor: pointer;
      height: 11px;

      &:hover {
        filter: brightness(0%);
      }
    }
  }
}
</style>
