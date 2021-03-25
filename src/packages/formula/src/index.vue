<template>
  <div class="fml-flex fml-container">
    <div class="fml-flex" :style="{ width: width }">

      <div class="fml-left">
        <div class="fml-flex fml-jsb  fml-mb-12">
          <div class="fml-buttons fml-flex fml-flex-wrap">
            <span class="fml-title">{{translate.arithmetic}}</span>
            <div v-for="(item, idx) in operatorTokens" :key="idx" class="fml-buttons-item fml-operator-button" @click="handleAddArithToken(item)">
              <span :class="[['**', '*'].includes(item.operator) ? 'vertical-middle' : '']">{{item.operator}}</span>
            </div>
          </div>
<!--          <formula-select :options="options"  v-model="selectContent" @change="handleSelectChange" />-->
          <formula-input  v-model="iptValue" type="text" :placeholder="translate.inputPlaceholder" :disabled="prohibitInput" @keyupEnter="handleKeyupEnter"/>
        </div>
        <div class="fml-buttons fml-flex fml-flex-wrap" v-if="enableConst">
          <div v-for="(item, idx) in constTokens" :key="idx" class="fml-buttons-item" @click="setFieldValue(item)">
            {{ item.name }}
          </div>
        </div>
        <div>
          <div class="fml-edit-container">
            <formula-item
                :formula="formula"
                :currentToken="currentToken"
                :funcTokens="funcTokens"
                :parent="{isTop: true}"
                :currentOperatorId="currentOperatorId"
                @handleAddEmptyToken="handleAddEmptyToken"
                @handleFuncTokenItem="handleFuncTokenItem"
                @handleTokenItem="handleTokenItem"
                @handleDeleteToken="handleDeleteToken"
                @handleResetToken="handleResetToken"
                @handleEmptyValue="handleEmptyValue"
                @mouseleaveOperator="mouseleaveOperator"
                @mouseoverOperator="mouseoverOperator"
            />
            <span v-if="formula.length <= 0" class="fml-tip">{{ translate.emptyTip }}</span>
          </div>
        </div>

        <div class="fml-flex fml-jsb fml-bottom">
          <div class="fml-flex-1 fml-bottom-wrap">
            <span class="fml-title fml-title-vertical">{{translate.formula}}</span>
            <ul>
              <li v-for="(item, idx) in funcTokens" :key="idx" class="fml-curpointer fml-functoken-item" @click="handleAddFuncToken(item)" @mouseover="handleTriggerIntro(item)">{{ item.name }}</li>
            </ul>
          </div>

          <div class="fml-desc" v-if="desc">
            <p> {{ desc.intro }}</p>
            <p>
              <svg class="fml-svg-icon">
                <use xlink:href="#fml-icon-function" />
              </svg>
              {{ desc.usage }}</p>
            <p class="fml-flex fml-direction-column">
              <span v-for="(item,idx) in desc.parameters" :key="idx" class="fml-ml-12">{{idx + 1}}. {{item}}</span>
            </p>
          </div>

        </div>
      </div>

      <div class="fml-right">
        <div class="fml-fields-container">
          <span class="fml-title  fml-title-vertical">{{translate.fields}}</span>
          <slot name="loading"></slot>
          <ul>
            <li class="fml-curpointer fml-text-primary fml-py-4" v-for="(item, idx) in fields" :key="idx" @click="handleFieldItem(item)">{{item.field}}</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import FormulaBuilder from '../../../lib/formula'
import { deepClone } from "../../../utils";
import fmlI18n from "i18next";

let FB = null;
let FML = null;

export default {
  inheritAttrs: false,
  name: 'FormulaBuilder',
  data () {
    return {
      prohibitInput: false,
      iptValue: '',
      watchInput: true,
      selectContent: { key: '', value: '' },
      desc: null,
      formula: [],
      funcTokens: [],
      cacheFuncTokens: [],
      constTokens: [],
      operatorTokens: [],
      currentToken: {},
      enableConst: false,
      currentOperatorId: '',
      fields: [],
      width: '640px',
      emptyTip: '',
      inputPlaceholder: '',
      options: [],
      showSelect: false,
      translate: {},
      previewInfo: null
    };
  },
  methods: {
    // init
    init (options = {}) {
      return new Promise(resolve => {
        if(options.locale) {
          fmlI18n.changeLanguage(options.locale).then(() => {
            this.initTranslate();
          })
        }

        FB = new FormulaBuilder({
          fieldsValue: options.fieldsValue || [],
          defineFunctions: options.defineFunctions || [],
          initialValue: options.initialValue || {},
          fields: options.fields || [],
        });

        FB.init().then(() => {
          FML = FB.FML;

          ;['width', 'prohibitInput', 'enableConst', 'showSelect'].forEach(type => {
            if (options[type]) this[type] = options[type]
          });
          ;['emptyTip', 'inputPlaceholder'].forEach(type => {
            if (options[type]) this.translate[type] = options[type]
          });

          this.selectContent = this.options[0];
          this.fields = FML.fieldTokens;
          this.funcTokens = FML.funcTokens;
          this.constTokens = FML.constTokens;
          this.operatorTokens = FML.operatorTokens;
          this.cacheFuncTokens = deepClone(FML.funcTokens);
          this.initEvent();
          this.handleTriggerIntro(this.funcTokens[0]);
          this.initValue(options);
          this.initOptions(options)
          this.handleSelectChange(this.options[0].value)
          resolve(FML)
        });
      })
    },

    initEvent () {
      FB.Bus.$on('update', (info) => {
        const { formula, currentToken } = info;
        this.currentToken = currentToken;
        this.formula = formula;
        this.previewInfo = formula[0]
        if (!currentToken.token) {
          this.watchInput = false;
          this.iptValue = ''
        }
        this.$nextTick(() => {
          this.watchInput = true;
        })
      });
      FB.Bus.$on('updateIntro', (info) => {
        const { intro } = info;
        this.desc = intro;
      })
    },

    initValue (options) {
      options.initialValue && FML.initInitialValue(options.initialValue)
    },

    initTranslate() {
      this.options = [{
        value: "All",
        key: fmlI18n.t("all")
      }];
      this.translate = {
        emptyTip: fmlI18n.t("emptyTip"),
        inputPlaceholder: fmlI18n.t("inputPlaceholder"),
        arithmetic:  fmlI18n.t("arithmetic"),
        formula: fmlI18n.t("formula"),
        fields: fmlI18n.t("fields"),
      }
    },

    initOptions (options) {
      if (options.options) {
        options.options.map(i => {
          this.options.forEach(j => {
            if (i.value === j.value) {
              j.key = i.key;
            }
          })
        })
      }
    },

    handleTriggerIntro (info) {
      FML.setFuncIntro(info);
    },

    handleAddFuncToken (info) {
      FML.wrapFuncToken(info);
    },

    handleAddArithToken (info) {
      FML.addArithToken(info)
    },

    handleTokenItem (info) {
      if (info.token && info.token === 'input') {
        this.iptValue = info.value
      } else {
        this.watchInput = false;
        this.iptValue = ''
      }
      FML.setCurrentToken(info);
    },

    handleAddEmptyToken (info) {
      FML.addEmptyToken(info);
    },

    handleDeleteToken (info) {
      FML.deleteToken(info);
    },

    handleResetToken (info) {
      FML.resetToken(info);
    },

    handleEmptyValue (info) {
      FML.emptyValue(info);
    },

    handleFuncTokenItem (info) {
      FML.setCurrentToken(info.obj);
    },

    handleKeyupEnter() {
      let isExist = FML.findNext();
      FML.emitTokenUpdated();
      if(isExist) this.iptValue = ''
    },

    mouseleaveOperator () {
      this.currentOperatorId = ''
    },
    mouseoverOperator (info) {
      this.currentOperatorId = info.uniqueId
    },

    handleSelectChange (value) {
      if (value === 'All') {
        this.funcTokens = this.cacheFuncTokens.filter(item => item)
      } else {
        this.funcTokens = this.cacheFuncTokens.filter(item => item.extra.classification === value)
      }
    },
    handleFieldItem(info) {
      this.setFieldValue({
        value: info.field,
        token: 'field'
      })
    },

    setFieldValue (info, findNext) {
      FML.modifyValue(info, findNext);
      if (info.token && info.token !== 'input') {
        this.watchInput = false;
        this.iptValue = ''
      }
    },

    setFields (value) {
      FML.generateFieldTokens(value)
      this.fields = FML.fieldTokens
    },

    parseTree2ExcelFormula() {
      const result = FML.parseTree2ExcelFormula()
      console.log(result);
    },

    getValue () {
      return FML.getValue();
    },

    clear () {
      FML.clear();
      this.iptValue = '';
    }
  },
  watch: {
    iptValue: function () {
      if (this.watchInput) {
        this.setFieldValue({ ...FML.inputToken, value: this.iptValue }, false)
      } else {
        this.watchInput = true;
      }
    }
  }
};
</script>

<style lang="scss" src='./index.scss'></style>
<style lang="scss" src='./fml.scss'></style>