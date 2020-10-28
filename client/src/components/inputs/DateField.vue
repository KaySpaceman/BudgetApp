<template>
  <div class="date-picker-field">
    <v-menu :close-on-content-click="false" :return-value="value" v-model="showDatePicker"
            transition="scale-transition" offset-y min-width="290px" attach=".date-picker-field">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field :label="label" :class="{ 'wide': wide, 'fill-height': fillHeight }" v-on="on"
                      :value="formattedDate" :attrs="attrs" placeholder=" " readonly
                      :append-icon="appendIcon ? 'mdi-calendar' : ''"/>
      </template>
      <v-date-picker :value="value" v-on="inputListeners" no-title/>
    </v-menu>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'DateField',
  data: () => ({
    showDatePicker: false,
  }),
  props: {
    value: String,
    label: String,
    appendIcon: Boolean,
    wide: Boolean,
    fillHeight: Boolean,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    formattedDate: {
      cache: false,
      get() {
        if (!this.value) {
          return '';
        }

        return DateTime.fromISO(this.value)
          .toLocaleString(DateTime.DATE_SHORT);
      },
    },
    inputListeners() {
      const vm = this;

      return {
        ...this.$listeners,
        input(event) {
          vm.$emit('input', event);
          vm.showDatePicker = false;
        },
      };
    },
  },
};
</script>

<style lang="scss">
.date-picker-field {
  .v-input {
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

    .v-input__icon {
      height: 16px;
      min-width: 16px;
      width: 20px;

      > .v-icon {
        color: $c-cadet-blue-crayola;
        font-size: 16px;
      }
    }
  }
}
</style>
