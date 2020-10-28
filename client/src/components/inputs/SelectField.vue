<template>
  <v-select class="select-field" :label="label" :value="value" v-on="$listeners"
            :class="{ 'wide': wide, 'fill-height': fillHeight, 'no-margin': noMargin }"
            :items="options" :item-text="textProperty" :item-value="valueProperty"
            placeholder=" " dense/>
</template>

<script>
export default {
  name: 'SelectField',
  data: () => ({}),
  props: {
    value: [String, Number],
    options: Array,
    textProperty: String,
    valueProperty: String,
    label: String,
    wide: Boolean,
    fillHeight: Boolean,
    noMargin: Boolean,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
};
</script>

<style lang="scss">
.select-field.v-input {
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
  margin-top: 0;
  padding-top: 14px;

  &:last-of-type {
    margin-bottom: 0;
  }

  input {
    height: 25px;
  }

  &.wide {
    width: 125px;
  }

  &.no-margin {
    margin-bottom: 0;
  }

  &.fill-height {
    height: 100%;

    input,
    .v-input__control,
    .v-input__slot {
      height: 100%;
    }
  }

  &.error--text {
    .v-input__slot {
      border-color: $c-red-pigment;
      border-width: 2px;
    }
  }

  .v-input__slot {
    border: 1px solid $c-cadet-blue-crayola;
    box-sizing: border-box;
    border-radius: 2px;
    margin: 0;

    &:before,
    &:after {
      display: none;
    }

    & > div {
      .v-label {
        color: $c-cadet-blue-crayola;
        font-family: $f-open-sans;
        font-weight: $fw-bold;
        font-size: 12px;
        line-height: 12px;
        text-transform: uppercase;
        top: 2px;
      }

      .v-select__selection {
        color: $c-cadet-blue-crayola;
        font-family: $f-open-sans;
        font-weight: $fw-bold;
        font-size: 12px;
        line-height: 12px;
        padding: 5px;
        margin: auto;
      }
    }
  }

  .v-list--dense .v-list-item {
    min-height: 30px;
  }

  .v-input__control {
    .v-messages {
      display: none;
    }

    .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon {
      margin-top: 0;
    }
  }
}
</style>
