<template>
  <div class="category-select" data-app>
    <v-select class="select-field" :class="{ 'wide': wide, 'fill-height': fillHeight }"
              :label="label" :value="value" v-on="$listeners" :items="treeToOptions(categoryTree)"
              :item-text="textProperty" :item-value="valueProperty" placeholder=" " dense
              menu-props="{ attach: '.category-select' }">
      <template v-slot:item="data">
        <span :class="'level-' + data.item.Level" v-text="data.item.Name"/>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: 'CategorySelectField',
  data: () => ({}),
  props: {
    value: [String, Number],
    categoryTree: Array,
    textProperty: String,
    valueProperty: String,
    label: String,
    wide: Boolean,
    fillHeight: Boolean,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  methods: {
    treeToOptions(categoryTree = []) {
      return categoryTree.reduce((acc, cur) => {
        if (cur.Children && cur.Children.length > 0) {
          // eslint-disable-next-line no-param-reassign
          cur.disabled = true;
        }

        acc.push(cur);

        return acc.concat(this.treeToOptions(cur.Children));
      }, []);
    },
  },
};
</script>

<style lang="scss">
.category-select {
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
          margin-left: -7px;
          top: 1px
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

  .v-select-list > .v-list-item {
    &.v-list-item--disabled {
      background-color: $c-alice-blue;
    }

    > .level-2 {
      padding-left: 15px;
    }

    > .level-3 {
      padding-left: 30px;
    }
  }
}
</style>
