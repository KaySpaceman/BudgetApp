<template>
    <div class="account-select-wrapper">
        <label class="account-label" for="account-select">Account</label>
        <select id="account-select" class="account-select" name="account" :required="isRequired"
                @change="emitValue($event.target.value)">
            <option v-for="account in accounts" class="account-option" :value="account.value" v-text="account.name"/>
        </select>
    </div>
</template>

<script>
  export default {
    name: 'AccountSelect',
    data: () => {
      return {};
    },
    props: {
      accounts: [Array, Object],
      isRequired: false,
    },
    methods: {
      emitValue: function (value) {
        this.$emit('input', value);
      },
    },
  };
</script>
