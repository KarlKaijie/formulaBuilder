<template>
  <div class="fml-select-wrapper fml-select">
    <div
      class="fml-flex fml-jc fml-relative fml-select-input-wraper"
      @click="triggerOption"
    >
      <div class="fml-select-input">
        <div class="fml-select fml-select-content">{{value.key}}</div>
      </div>
      <div class="fml-select fml-triangle-wrapper">
        <i class="fml-select fml-triangle-down">
          <svg class="fml-svg-icon"><use xlink:href="#fml-icon-sanjiao"/></svg>
        </i>
      </div>
    </div>

    <div class="fml-select fml-option-wrapper">
      <div
        class="fml-select fml-option-item"
        v-for="(item) in options"
        :data-value="item.value"
        :key="item.value"
        @click="handleSelect(item)"
        @touchmove.prevent
      >{{item.key}}</div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass, hasClass, getStyle } from '../../../utils'

export default {
  name: 'FormulaSelect',
  props: {
    options: {
      type: Array
    },
    value: {
      type: Object,
      default: function () {
        return { value: 0, key: "请选择" }
      }
    },
  },
  mounted () {
    let dom = document.querySelector(".fml-select-input-wraper")
    document.querySelector(".fml-option-wrapper").style.width = parseInt(getStyle(dom, 'width')) + 0 + 'px';
    this.initEvent();
  },
  computed: {
    optionWrapper () {
      return document.querySelector(".fml-option-wrapper");
    },
    subjectList () {
      return document.getElementsByClassName("fml-option-item");
    },
    triangleDown () {
      return document.querySelector('.fml-triangle-down')
    }
  },
  methods: {
    triggerOption () {
      if (!hasClass(this.optionWrapper, 'fml-select-show')) {
        addClass(this.optionWrapper, 'fml-select-show')
        addClass(this.triangleDown, 'fml-triangle-rotate')
      } else {
        removeClass(this.optionWrapper, 'fml-select-show')
        removeClass(this.triangleDown, 'fml-triangle-rotate')
      }
      for (var item of this.subjectList) {
        if (item.dataset.value == this.value.value) {
          addClass(item, 'fml-select-hover')
        } else {
          removeClass(item, 'fml-select-hover')
        }
      }
    },
    handleSelect (item) {
      removeClass(this.optionWrapper, 'fml-select-show')
      removeClass(this.triangleDown, 'fml-triangle-rotate')
      this.$emit('input', item)
      this.$emit("change", item.value, item);
    },
    hideSelect (e) {
      let tg = e.target;
      if (tg && typeof tg.className === 'string' && tg.className.indexOf('fml-select') < 0) {
        removeClass(this.optionWrapper, 'fml-select-show')
        removeClass(this.triangleDown, 'fml-triangle-rotate')
      }
    },
    initEvent () {
      document.body.addEventListener('click', this.hideSelect, false)
    }
  },
  beforeDestroy () {
    document.body.removeEventListener('click', this.hideSelect)
  }
}
</script>

<style lang="scss">
.fml-select-wrapper {
  position: relative;
  width: 160px;
  .fml-select-input-wraper {
    border: 1px solid #ccc;
    border-radius: 3px;
    background: #fff;
    position: relative;
    z-index: 3;
    color: #44474c;
    .fml-select-input {
      width: 100%;
      height: 32px;
      min-width: 80px;
      line-height: 32px;
      overflow: hidden;
      font-size: 14px;
      cursor: pointer;
      border-radius: 3px 0 0 3px;
    }
    .fml-select-content {
      text-align: left;
      padding: 0 8px;
    }
    .fml-triangle-wrapper {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      border-left: 1px solid #eee;
      text-align: center;
      border-radius: 0 3px 3px 0;
    }
    .fml-triangle-down {
      display: inline-block;
      svg {
        width: 1em;
        height: 1em;
      }
    }
    .fml-triangle-rotate {
      transform: rotate(180deg);
      transition: all 0.3s;
      transform-origin: center;
    }
  }

  .fml-option-wrapper {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 32px;
    overflow-x: hidden;
    min-width: 100px;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    background: #fff;
    display: none;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
    .fml-option-item {
      min-width: 100px;
      height: 32px;
      line-height: 32px;
      padding-right: 10px;
      box-sizing: border-box;
      cursor: pointer;
      font-size: 14px;
      padding: 0 8px;
      border-bottom: 1px dashed #ccc;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: #44474c;
      &:first-child {
        padding-top: 2px;
      }
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background-color: rgb(30, 144, 255, 0.6);
      }
    }
    .fml-select-hover {
      background-color: rgb(30, 144, 255, 0.6);
      color: #fff !important;
    }
  }

  .fml-select-show {
    display: block;
  }
}
</style>
