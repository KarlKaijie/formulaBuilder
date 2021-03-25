import fmlI18n from "i18next";
import {cnDict} from "./cn";
import {enDict} from "./en";

fmlI18n.init({
    lng: "en",
    debug: false,
    resources: {
        "zh-CN": cnDict,
        en: enDict
    }
});
