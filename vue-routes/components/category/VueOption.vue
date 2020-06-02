<template>
    <option :class="'cat-option level-' + item.Level" :value="item.IdString" v-text="item.Name"
            :disabled="disabled" :selected="current === item._id"/>
</template>

<script>
  export default {
    name: 'VueOption',
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
