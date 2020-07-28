<template>
  <div class="account">
    <span class="column" v-text="account.Name"/>
    <span class="column" v-text="account.Number"/>
    <span class="column" v-text="account.Total"/>
    <button @click="$emit('edit-account', this.accountIndex)">Edit</button>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data: () => ({}),
  props: {
    account: [Array, Object],
    accountTotal: Number,
    accountIndex: Number,
  },
};
</script>
