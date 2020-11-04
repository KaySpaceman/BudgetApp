<template>
  <div :id="`color-picker-${this._uid}`" class="color-picker" :class="{ 'no-margin': noMargin}">
    <span class="label" v-text="label"/>
    <v-menu :close-on-content-click="false" offset-y absolute
            :attach="`#color-picker-${this._uid}`" nudge-width="250" left>
      <template v-slot:activator="{ on, attrs }">
        <div class="current-color" :style="{ backgroundColor: value }" v-on="on" :attrs="attrs"/>
      </template>
      <v-color-picker :value="value" v-on="inputListeners" mode="hexa" hide-canvas
                      hide-mode-switch flat/>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',
  data: () => ({}),
  props: {
    label: String,
    value: String,
    noMargin: Boolean,
  },
  model: {
    prop: 'value',
    event: 'select',
  },
  computed: {
    inputListeners() {
      const vm = this;

      return {
        ...this.$listeners,
        input(event) {
          const hex = event;
          if (hex) {
            vm.$emit('select', hex);
          }
        },
      };
    },
  },
};
</script>

<style lang="scss">
.color-picker {
  display: flex;
  flex-direction: column;
  margin: 0 10px 15px;
  padding: 0;
  position: relative;

  &.no-margin {
    margin-bottom: 0;
  }

  .label {
    color: $c-cadet-blue-crayola;
    font-family: $f-open-sans;
    font-weight: $fw-bold;
    font-size: 9px;
    line-height: 9px;
    text-transform: uppercase;
  }

  .current-color {
    background-color: $c-dodger-blue;
    border-radius: 2px;
    margin: auto auto 0;
    height: 25px;
    width: 25px;
  }

  .v-color-picker {
    .v-color-picker__hue {
      margin: auto;
    }

    .v-color-picker__alpha,
    .v-color-picker__input > span {
      display: none;
    }

    .v-color-picker__input > input {
      color: $c-cadet-blue-crayola;
      font-family: $f-open-sans;
      font-weight: $fw-bold;
      font-size: 12px;
      line-height: 12px;
      padding: 5px;
      margin: auto;
      width: 90px;
    }
  }
}
</style>
