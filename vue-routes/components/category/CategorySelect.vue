<template>
    <div :id="'category-wrapper-' + identifier" class="category-wrapper">
        <label class="cat-label" :for="'cat-sel-' + identifier" v-text="label" v-if="label"></label>
        <div :id="'select-wrapper-'+ identifier" class="select-wrapper" v-if="!current">
            <select :id="'cat-sel-' + identifier" class="category-select" :name="identifier" :disabled="current">
                <option value="" disabled hidden :selected="!current">Select a category</option>
                <VueOption v-for="item in categories" :item="item" :current="current"
                           :disabled="onlyLastLevel ? (!!item.Children) : false"/>
            </select>
        </div>
        <button type="button" class="button button-small" :data-transaction="identifier" v-else>
            Edit
        </button>
    </div>
</template>

<script>
  import VueOption from './VueOption.vue';

  export default {
    name: 'CategorySelect',
    data: () => {
      return {};
    },
    props: {
      categories: [Array, Object],
      identifier: String,
      onlyLastLevel: Boolean,
      current: String,
      label: String,
    },
    mounted: function () {
      $('.category-select')
        .select2({
          width: '100%',
          templateResult: function (data) {
            if (!data.element) {
              return data.text;
            }

            const element = $(data.element);
            const wrapper = $('<span></span>');

            wrapper.addClass(element[0].className);
            wrapper.text(data.text);

            return wrapper;
          },
        });
    },
    components: {
      VueOption,
    },
  };
</script>
