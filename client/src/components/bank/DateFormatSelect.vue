<template>
  <div class="date-format-select-wrapper">
    <label class="date-format-label" for="date-format-select">Date Format</label>
    <select id="date-format-select" class="date-format-select" name="date-format">
      <option v-for="format in dateFormats" :key="format.value" class="date-format-option"
              :value="format.value" v-text="format.name"/>
    </select>
  </div>
</template>

<script>
export default {
  name: 'DateFormatSelect',
  data: () => ({}),
  props: {
    dateFormats: [Array, Object],
  },
};
</script>
