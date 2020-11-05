<template>
  <div class="sub-goal">
      <div class="details">
        <div class="properties">
          <span class="name">{{subGoal.Name}} - {{goalPercentage}}</span>
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
        <img class="icon" src="@/assets/Pencil.svg" alt="edit"/>
        <img class="icon" src="@/assets/Delete.svg" alt="delete"/>
        <img class="icon up" src="@/assets/ToEdit.svg" alt="up"/>
        <img class="icon down" src="@/assets/ToEdit.svg" alt="down"/>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

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
  },
  methods: {
    ...mapMutations(['selectVault']),
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
