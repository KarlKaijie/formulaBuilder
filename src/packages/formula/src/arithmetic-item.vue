<template>
  <span
    :class="['fml-token fml-arith fml-relative ', currentToken.id === self.id ? 'active' : '']"
    @dblclick.stop="handleTokenItem(self)"
  >
    <span
      v-if="!parent.isArithTop"
      :class="operatorClass(self)"
      @mouseleave="mouseleaveOperator(self)"
      @mouseover="mouseoverOperator(self)"
    >(
    </span>
    <formula-item
      :key="'arith' + self.id + 1"
      :formula="[self.params[0]]"
      :currentToken="currentToken"
      :funcTokens="funcTokens"
      :parent="self"
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

    <span :key="'arith' + self.id + 2" class="fml-arith-operator">
      <span :class="[['**', '*'].includes(self.operator) ? 'vertical-sub' : '']">{{self.operator}}</span>
    </span>

    <formula-item
      :key="'arith' + self.id + 3"
      :formula="[self.params[1]]"
      :currentToken="currentToken"
      :funcTokens="funcTokens"
      :parent="self"
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

    <span
      v-if="!parent.isArithTop"
      :class="operatorClass(self)"
      @mouseleave="mouseleaveOperator(self)"
      @mouseover="mouseoverOperator(self)"
    >)
    </span>

    <span
      v-if="currentToken.id === self.id && self.token === 'arithmetic_token' && parent.token !== 'arithmetic_token' && parent.params && parent.params.length > parent.minParameterLength "
      class="fml-formula-delete"
    >
      <svg
        class="fml-svg-icon"
        @click.stop="handleDeleteToken({parent: parent ,child: self})"
      >
        <use xlink:href="#fml-icon-guanbi" />
      </svg>
    </span>

    <span
      v-if="currentToken.id === self.id && self.token === 'arithmetic_token' && !parent.isArithTop"
      class="fml-formula-reset"
    >
      <svg
        class="fml-svg-icon"
        @click.stop="handleResetToken({parent: parent ,child: self})"
      >
        <use xlink:href="#fml-icon-reset" />
      </svg>
    </span>
  </span>
</template>

<script>
export default {
  name: "arithmetic-item",
  props: {
    formula: {
      type: Array,
      default: () => []
    },
    currentToken: {
      type: Object,
      default: () => { }
    },
    funcTokens: {
      type: Array,
      default: () => []
    },
    self: {
      type: Object,
      default: () => { }
    },
    parent: {
      type: Object,
      default: () => { }
    },
    currentOperatorId: {
      type: Number | String,
      default: ''
    }
  },
  computed: {
    operatorClass () {
      return function (item) {
        return item.uniqueId === this.currentOperatorId ? 'fml-arith-bracket active' : 'fml-arith-bracket'
      }
    }
  },
  methods: {
    handleAddEmptyToken (info) {
      this.$emit('handleAddEmptyToken', info);
    },
    handleFuncTokenItem (info) {
      this.$emit('handleFuncTokenItem', info)
    },
    handleDeleteToken (info) {
      this.$emit('handleDeleteToken', info)
    },
    handleResetToken (info) {
      this.$emit('handleResetToken', info)
    },
    handleTokenItem (info) {
      this.$emit('handleTokenItem', info)
    },
    handleEmptyValue (info) {
      this.$emit('handleEmptyValue', info)
    },
    mouseleaveOperator (info) {
      this.$emit('mouseleaveOperator', info)
    },
    mouseoverOperator (info) {
      this.$emit('mouseoverOperator', info)
    }
  }
}
</script>

<style scoped>
</style>
