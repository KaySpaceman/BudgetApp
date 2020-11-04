<template>
  <v-btn-toggle class="button-toggle" mandatory dense v-on="$listeners"
                :value="value">
    <v-btn class="option-button" v-for="option in options" :value="option.value"
           :key="option.value">
      <span class="option-text" v-text="option.text"/>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'ButtonToggle',
  data: () => ({}),
  props: {
    options: Array,
    value: String,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
};
</script>

<style lang="scss">
.button-toggle.v-btn-toggle {
  margin: auto auto 15px;

  .option-button.v-btn.theme--light {
    border-color: $c-cadet-blue-crayola;
    border-width: 1px 1px 1px 0;
    background-color: $c-white;
    width: 65px;
    height: 25px;

    &:first-of-type {
      border-radius: 3px 0 0 3px;
      border-width: 1px;
    }

    &:last-of-type {
      border-radius: 0 3px 3px 0;
    }

    &.v-btn--active {
      background-color: $c-dodger-blue;
      border: 1px solid $c-dodger-blue;

      .option-text {
        color: $c-white;
      }
    }
  }

  .option-text {
    font-family: $f-open-sans;
    font-weight: $fw-bold;
    font-size: 9px;
    line-height: 12px;
    text-align: center;
    color: $c-cadet-blue-crayola;
  }
}
</style>
