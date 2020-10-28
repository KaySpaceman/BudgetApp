<template>
  <v-switch class="switch" :value="value" :label="label" v-on="$listeners" flat dense>
    <slot/>
  </v-switch>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  data: () => ({}),
  props: {
    label: String,
    value: Boolean,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
};
</script>

<style lang="scss">
.switch.v-input {
  height: 25px;
  margin: 0 10px;
  padding: 0;

  .v-input__slot {
    flex-direction: column;

    .v-label {
      color: $c-cadet-blue-crayola;
      font-family: $f-open-sans;
      font-weight: $fw-bold;
      font-size: 9px;
      line-height: 9px;
      text-transform: uppercase;
      order: 0;
      top: -2px;
    }

    .v-input--selection-controls__input {
      order: 1;
      margin-top: 7px;
    }
  }
}
</style>
