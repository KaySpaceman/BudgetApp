<template>
    <option :class="'cat-option level-' + item.Level" :value="item.IdString" v-text="item.Name"
            :disabled="disabled" :selected="current === item.IdString"/>
</template>

<script>
  export default {
    name: 'CategoryOption',
    data: () => {
      return {};
    },
    props: {
      item: Object,
      current: String,
      disabled: Boolean,
    },
  };
</script>
