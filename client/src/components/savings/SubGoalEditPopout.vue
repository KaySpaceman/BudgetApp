<template>
  <v-menu class="sub-goal-edit-popout" v-on="$listeners" v-model="isOpen"
          :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"/>
    </template>
    <div class="edit-form">
      <text-field v-model.trim="formData.Name" label="Name" :rules="[validateName]"/>
      <text-field v-model.number="formData.Goal" type="number" label="Goal"
                  :rules="[validateGoal]"/>
      <div class="controls">
        <btn row @click="editSubGoal">Close</btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
import Btn from '../inputs/Btn.vue';
import TextField from '../inputs/TextField.vue';

export default {
  name: 'SubGoalEditPopout',
  data: () => ({
    isOpen: false,
  }),
  props: {
    subGoalMeta: Object,
  },
  computed: {
    formData() {
      return {
        ...this.subGoalMeta,
      };
    },
  },
  model: {
    prop: 'subGoalMeta',
    event: 'change',
  },
  methods: {
    editSubGoal() {
      if (this.validateForm()) {
        this.$emit('change', this.formData);
        this.isOpen = false;
      }
    },
    validateGoal() {
      return this.formData.Goal > 0;
    },
    validateName() {
      return typeof this.formData.Name === 'string' && this.formData.Name.length > 0;
    },
    validateForm() {
      return this.validateGoal() && this.validateName();
    },
  },
  components: {
    TextField,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.edit-form {
  background: $c-white;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  padding: 10px;

  .controls {
    margin: auto auto auto 15px;
  }
}
</style>
