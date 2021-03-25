import "./assets/css/index.scss";
import FormulaItem from "./packages/formula/src/formula-item";
import {FormulaBuilder} from "./packages/formula";
import {FormulaPreview} from "./packages/formula-preview";
import {FormulaInput} from "./packages/input";
import {FormulaSelect} from "./packages/select";
import "./assets/svg-icon/index";

const components = [FormulaItem, FormulaBuilder, FormulaPreview, FormulaInput, FormulaSelect];

const install = function (Vue, opts = {}) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export default {
    version: "1.1.0",
    install,
    FormulaBuilder,
    FormulaPreview,
    FormulaInput,
    FormulaSelect
};
