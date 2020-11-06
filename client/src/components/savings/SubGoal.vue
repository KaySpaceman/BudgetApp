<template>
  <div class="sub-goal">
    <div class="details">
      <div class="properties">
        <span class="name">{{ subGoal.Name }} - {{ goalPercentage }}</span>
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
    <div class="actions">
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
  },
  computed: {
    goalPercentage() {
      return Number.parseInt(((this.subGoal.Balance / this.subGoal.Goal) * 100).toFixed(0), 10);
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
  .details {
    display: flex;
    flex-direction: column;
  }

  .actions {
    //display;
  }
}
</style>
