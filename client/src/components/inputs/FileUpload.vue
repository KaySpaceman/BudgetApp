<template>
  <v-file-input class="file-input" :class="{ 'wide': wide, 'fill-height': fillHeight }"
                :label="label" v-on="$listeners" placeholder="CSV file" :accept="accept"
                :value="value" prepend-icon="" dense outlined/>
</template>

<script>
export default {
  name: 'FileUpload',
  data: () => ({}),
  props: {
    accept: String,
    value: File,
    label: String,
    wide: Boolean,
    fillHeight: Boolean,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
};
</script>

<style lang="scss">
.file-input.v-input.v-file-input.v-text-field--outlined {
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
  margin-top: 0;
  padding-top: 14px;

  &:last-of-type {
    margin-bottom: 0;
  }

  input {
    height: 25px;
  }

  &.wide {
    width: 125px;
  }

  &.fill-height {
    height: 100%;

    input,
    .v-input__control,
    .v-input__slot {
      height: 100%;
    }
  }

  &.error--text .v-input__slot {
    border-color: $c-red-pigment;
    border-width: 2px;
  }

  .v-input__control > .v-input__slot {
    border: 1px solid $c-cadet-blue-crayola;
    box-sizing: border-box;
    border-radius: 2px;
    min-height: unset;
    height: 25px;
    padding: 0 20px 0 0;
    margin: 0;

    &:before,
    &:after {
      display: none;
    }

    fieldset {
      border: 0;
    }

    .v-input__append-inner {
      margin-top: 0;

      .v-icon--link {
        height: 15px;
        width: 15px;

        &:before {
          font-size: 15px;
        }
      }
    }

    .v-text-field__slot {
      min-height: unset;
      width: 100%;
    }

    & > div {
      .v-label {
        color: $c-cadet-blue-crayola;
        font-family: $f-open-sans;
        font-weight: $fw-bold;
        font-size: 12px;
        line-height: 12px;
        text-transform: uppercase;
        margin-left: -7px;
        top: 1px
      }

      .v-file-input__text {
        color: $c-cadet-blue-crayola;
        font-family: $f-open-sans;
        font-weight: $fw-bold;
        font-size: 12px;
        line-height: 12px;
        padding-left: 5px;
        display: block;
        margin: auto;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }

  .v-input__control .v-messages {
    display: none;
  }
}
</style>
