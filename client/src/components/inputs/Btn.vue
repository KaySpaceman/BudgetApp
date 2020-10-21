<template>
  <v-btn class="button action-button" :class="{ 'clear': clear, 'in-row': row , 'square': square }"
         v-on="$listeners" :outlined="outlined" depressed>
    <slot/>
  </v-btn>
</template>

<script>
export default {
  name: 'Btn',
  data: () => ({}),
  props: {
    outlined: Boolean,
    clear: Boolean,
    row: Boolean,
    square: Boolean,
  },
};
</script>

<style lang="scss">
.button.action-button.v-btn.theme--light.v-btn--depressed {
  background-color: $c-dodger-blue;
  color: $c-white;
  height: 25px;
  margin: auto 10px 0;
  flex-grow: 1;

  &.in-row:first-of-type {
    margin-left: 0;
  }

  &.in-row:last-of-type {
    margin-right: 0;
  }

  &.clear {
    background-color: transparent;
    color: $c-cadet-blue-crayola;
  }

  &.square {
    min-width: 25px;
    width: 25px;
  }

  .v-btn__content {
    font-family: $f-open-sans;
    font-weight: $fw-bold;
    font-size: 10px;
    line-height: 10px;
  }
}
</style>
