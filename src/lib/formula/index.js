
import FML from "./fml";
import Bus from "./bus";
import "../i18n";
import fmlI18n from "i18next";

function FormulaBuilder(options = {}) {
    this.options = options || {};
    this.FML = null;
    this.Bus = new Bus();
}

FormulaBuilder.prototype.init = function () {
    return new Promise(resolve => {
        this.FML = new FML(this.Bus);
        this.FML.generateToken(this.options);
        resolve(true);
    });
};

FormulaBuilder.prototype.initPreview = function (initialValue) {
    this.FML = new FML(this.Bus);
    this.FML.initInitialValue(initialValue);
};

FormulaBuilder.prototype.changeLocale = function (locale) {
    fmlI18n.changeLanguage(locale);
};

export default FormulaBuilder;
