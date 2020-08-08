<template>
    <div class="bank-select-wrapper">
        <label class="bank-label" for="bank-select">Bank</label>
        <select id="bank-select" class="bank-select" name="bank" :required="isRequired"
                v-on:change="emitValue($event.target.value)">
          <option v-for="bank in banks" :key="bank.id" class="bank-option" :value="bank.value"
                  v-text="bank.name"/>
        </select>
    </div>
</template>

<script>
export default {
  name: 'BankSelect',
  data: () => ({}),
  props: {
    banks: [Array, Object],
    isRequired: Boolean,
  },
  methods: {
    emitValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>
