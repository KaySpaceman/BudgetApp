<template>
    <div class="account">
        <span class="column" v-text="account.Name"/>
        <span class="column" v-text="account.Number"/>
        <span class="column" v-text="account.Bank"/>
        <button @click="emitEdit">Edit</button>
    </div>
</template>

<script>
  export default {
    name: 'Account',
    data: () => {
      return {};
    },
    props: {
      account: [Array, Object],
      accountIndex: Number,
    },
    methods: {
      emitEdit: function () {
        this.$emit('edit-account', this.accountIndex);
      },
    },
  };
</script>
