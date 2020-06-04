<template>
    <div id="time-interval-wrapper" class="interval-wrapper">
        <label class="interval-label" for="time-interval-select">Time Interval</label>
        <select id="time-interval-select" class="interval-select" name="time-interval"
                @change="changeInterval($event.target.value)">
            <option v-for="(name, value) in items" class="interval-option" :value="value" v-text="name"
                    :selected="value === interval"/>
        </select>
        <button class="button button-small">Apply</button>
    </div>
</template>

<script>
  export default {
    name: 'TimeIntervalSelect',
    data: () => {
      return {};
    },
    props: {
      items: Object,
      interval: String,
    },
    methods: {
      changeInterval: function (value) {
        this.$emit('input', value);
      },
    },
  };
</script>
