<template>
  <v-menu class="transfer-popout" v-on="$listeners" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <slot :on="on" :attrs="attrs"/>
    </template>
    <div class="transfer-form">
      <select-field v-model="destination" label="Transfer To" text-property="Name"
                    :options="accountsList" value-property="id" no-margin/>
      <toggle-switch v-model="createCopy" label="Create Copy"/>
      <div class="controls">
        <btn row @click="submitForm">Save</btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import ToggleSwitch from '../inputs/ToggleSwitch.vue';
import SelectField from '../inputs/SelectField.vue';
import Btn from '../inputs/Btn.vue';

export default {
  name: 'TransferPopout',
  data: () => ({
    destination: null,
    createCopy: true,
  }),
  props: {
    transaction: Object,
  },
  computed: {
    ...mapState({ accountsList: (state) => state.accounts.accountsList }),
    formData() {
      return {
        destination: this.destination ?? null,
        createCopy: !!this.createCopy,
      };
    },
  },
  methods: {
    ...mapMutations(['selectTransaction']),
    ...mapActions(['fetchAccountList', 'upsertTransaction']),
    submitForm() {
      if (this.validateForm()) {
        // TODO: Update transaction and create copy, if necessary
      }
    },
    validateForm() {
      const { destination, createCopy } = this.formData;

      return typeof destination === 'string' && typeof createCopy === 'boolean'
        && this.accountsList.map((cur) => cur.id).includes(destination);
    },
  },
  created() {
    if (!this.accountsList || this.accountsList.length === 0) {
      this.fetchAccountList();
    }
  },
  components: {
    SelectField,
    ToggleSwitch,
    Btn,
  },
};
</script>

<style lang="scss" scoped>
.transfer-form {
  background: $c-white;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  padding: 10px;

  .controls {
    margin: auto;
  }
}
</style>
