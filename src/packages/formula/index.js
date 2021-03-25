import FormulaBuilder from "./src/index.vue";

FormulaBuilder.install = function (Vue) {
    Vue.component(FormulaBuilder.name, FormulaBuilder);
};

export {FormulaBuilder};
