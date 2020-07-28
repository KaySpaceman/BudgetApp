<template>
  <option :class="'cat-option level-' + item.Level" :value="item.id" v-text="item.Name"
          :disabled="disabled" :selected="current === item.id"/>
</template>

<script>
export default {
  name: 'CategoryOption',
  data: () => ({}),
  props: {
    item: Object,
    current: String,
    disabled: Boolean,
  },
};
</script>
