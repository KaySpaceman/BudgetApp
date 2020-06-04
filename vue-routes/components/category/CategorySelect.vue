<template>
    <div :id="'category-wrapper-' + identifier" class="category-wrapper">
        <label class="cat-label" :for="'cat-sel-' + identifier" v-text="label" v-if="label"/>
        <div :id="'select-wrapper-'+ identifier" class="select-wrapper" v-if="!current || selectIsShown">
            <select :id="'cat-sel-' + identifier" class="category-select" :name="identifier"
                    :disabled="!!current && !selectIsShown">
                <option value="" disabled hidden :selected="!current">Select a category</option>
                <CategoryOption v-for="item in categories" :item="item" :current="current"
                           :disabled="onlyLastLevel ? categoryHasChildren(item) : false"/>
            </select>
        </div>
        <template v-else>
            <span class="category-current" v-text="currentName"/>
            <button type="button" class="button button-small" @click="showSelect(identifier)">
                Edit
            </button>
        </template>
    </div>
</template>

<script>
  import CategoryOption from './CategoryOption.vue';

  export default {
    name: 'CategorySelect',
    data: function() {
      return {
        selectIsShown: false,
        showSelect: function (id) {
          this.selectIsShown = true;
          this.$nextTick(() => {
            this.initializeSelect(id);
          });
        },
        categoryHasChildren: function (category) {
          if (!category.Children) return false;
          if (Array.isArray(category.Children)) return category.Children.length > 0;

          return Object.keys(category.Children).length > 0;
        },
        initializeSelect: function (id) {
          const selector = id ? `#cat-sel-${id}` : '.category-select';

          $(selector)
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
        }
      };
    },
    props: {
      categories: [Array, Object],
      identifier: String,
      onlyLastLevel: Boolean,
      current: String,
      currentName: String,
      label: String,
    },
    mounted: function () {
      this.initializeSelect();
    },
    components: {
      CategoryOption,
    },
  };
</script>
