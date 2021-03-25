<template>
  <input
    :class="['fml-input', error ? 'fml-input-err' : '']"
    :value="value"
    @input="onInput"
    @keyup.enter="$emit('keyupEnter')"
    v-bind="$attrs"
  >
</template>
<script>
/* eslint-disable */
export default {
  name: 'FormulaInput',
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    },
    valueType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      error: false
    }
  },
  methods: {
    onInput (e) {
      if(this.$attrs.disabled) return;
      if(this.valueType === 'number') {
        this.error = !!isNaN(e.target.value)
      }
      this.$emit('input', e.target.value)
    }
  },
};
</script>


<style lang="scss" scoped>
.fml-input {
  width: 200px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  outline-style: none;
  border-radius: 3px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 4px rgba(102, 175, 233, 0.6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 4px rgba(102, 175, 233, 0.6);
  }
  &.fml-input-err,
  &.fml-input-err:focus {
    border-color: rgb(228, 25, 18);
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 4px rgba(228, 25, 18, 0.6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 4px rgba(228, 25, 18, 0.6);
  }
  &::-webkit-input-placeholder {
    font-size: 12px;
    font-weight: normal;
  }
}
</style>
