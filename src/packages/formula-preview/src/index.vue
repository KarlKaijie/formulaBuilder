<template>
  <formula-preview-item :formula="formula" :firstParameter="formula[0]"/>
</template>
<script>
import FormulaPreviewItem from './formula-preview-item.vue';
import FormulaBuilder from "../../../lib/formula";

let FB = null;
export default {
  components: {FormulaPreviewItem},
  inheritAttrs: false,
  name: 'FormulaPreview',
  props: {
    initialValue: {
      type: Object
    }
  },
  data() {
    return {
      formulaId: 1,
      formula: [],
    };
  },
  beforeCreate() {
    FB = new FormulaBuilder();
    FB.Bus.$on('update', (info) => {
      const {formula} = info;
      this.formula = formula;
    })
  },
  watch: {
    'initialValue': {
      handler: function () {
        FB && FB.initPreview(this.initialValue);
      },
      immediate: true,
      deep: true
    }
  }
};
</script>


<style lang="scss">
</style>
