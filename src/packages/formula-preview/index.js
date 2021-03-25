import FormulaPreview from "./src/index.vue";

FormulaPreview.install = function (Vue) {
    Vue.component(FormulaPreview.name, FormulaPreview);
};

export {FormulaPreview};
