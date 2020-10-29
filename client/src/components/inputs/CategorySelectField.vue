<template>
  <div class="category-select" :id="`select-${this._uid}`">
    <v-select class="select-field" :label="label" v-on="$listeners" :value="value"
              :class="{ 'wide': wide, 'fill-height': fillHeight, 'no-margin': noMargin }"
              :item-text="textProperty || 'Name'" :item-value="valueProperty || 'id'"
              :items="options" :menu-props="{ absolute: true, nudgeWidth: 145, nudgeBottom: 12 }"
              :attach="`#select-${this._uid}`"
              placeholder=" " dense>
      <template v-slot:item="data">
        <span :class="'level-' + data.item.Level" v-text="data.item.Name"/>
      </template>
    </v-select>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'CategorySelectField',
  data: () => ({}),
  props: {
    value: [String, Number],
    categoryType: String,
    textProperty: String,
    valueProperty: String,
    label: String,
    wide: Boolean,
    noMargin: Boolean,
    fillHeight: Boolean,
    allowAllLevels: Boolean,
  },
  computed: {
    ...mapState({
      spendingCategories: (state) => state.categories.spendingCategories,
      incomeCategories: (state) => state.categories.incomeCategories,
    }),
    ...mapGetters(['allCategories']),
    options() {
      switch (this.categoryType) {
        case 'INCOME':
          return this.treeToOptions(this.incomeCategories);
        case 'SPENDING':
          return this.treeToOptions(this.spendingCategories);
        default:
          return this.treeToOptions(this.allCategories);
      }
    },
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  methods: {
    ...mapActions(['fetchCategories']),
    treeToOptions(categoryTree = []) {
      return categoryTree.reduce((acc, cur) => {
        const option = {
          id: cur.id,
          Name: cur.Name,
          Level: cur.Level,
        };

        if (!this.allowAllLevels && (cur.Children && cur.Children.length > 0)) {
          option.disabled = true;
        }

        acc.push(option);

        return acc.concat(this.treeToOptions(cur.Children));
      }, []);
    },
  },
  created() {
    // TODO: Check and fetch only when accessed
    if (!this.spendingCategories || this.spendingCategories.length === 0) {
      this.fetchCategories({ type: 'SPENDING' });
    }

    if (!this.incomeCategories || this.incomeCategories.length === 0) {
      this.fetchCategories({ type: 'INCOME' });
    }
  },
};
</script>

<style lang="scss">
.category-select {
  position: relative;

  .select-field.v-input {
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

  &:last-child .select-field.v-input {
    margin-bottom: 0;
  }
}
</style>
