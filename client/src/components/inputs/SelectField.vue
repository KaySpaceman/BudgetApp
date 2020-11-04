<template>
  <div :id="`select-${this._uid}`" class="select-field">
    <v-select :label="label" v-on="$listeners" placeholder=" " dense
              :class="{ 'wide': wide, 'fill-height': fillHeight, 'no-margin': noMargin }"
              :value="value" :items="options" :item-text="textProperty" :item-value="valueProperty"
              :attach="`#select-${this._uid}`"
              :menu-props="{ absolute: true, nudgeWidth: 145, nudgeBottom: 12 }"/>
  </div>
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
.select-field {
  position: relative;

  .v-select.v-input {
    width: 80px;
    height: 40px;
    margin-bottom: 15px;
    margin-top: 0;
    padding-top: 14px;

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

    .v-input__control {
      .v-messages {
        display: none;
      }

      .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon {
        margin-top: 0;
      }
    }
  }

  .v-list--dense > .v-list-item {
    min-height: 30px;
  }

  .v-select-list > .v-list-item {
    font-size: 12px;
    white-space: nowrap;
  }

  &:last-child .select-field.v-input {
    margin-bottom: 0;
  }
}
</style>
