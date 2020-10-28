<template>
  <v-text-field class="text-field" :class="{ 'wide': wide, 'fill-height': fillHeight }"
                :label="label" :rules="rules" :value="value" v-on="$listeners" placeholder=" "/>
</template>

<script>
export default {
  name: 'TextField',
  data: () => ({}),
  props: {
    value: [String, Number],
    label: String,
    rules: Array,
    wide: Boolean,
    fillHeight: Boolean,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
};
</script>

<style lang="scss">
.text-field.v-input {
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

  &.fill-height {
    height: 100%;

    input,
    .v-input__control,
    .v-input__slot,
    .v-text-field__slot {
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

      input {
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

  .v-input__control {
    .v-messages {
      display: none;
    }
  }
}
</style>
