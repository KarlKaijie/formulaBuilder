<template>
  <span>
    <template v-for="item in formula">

      <!--  Render the token of the non-function in arithmetic    -->
      <template v-if="item.token !== 'function' && item.token !== 'arithmetic_token'">
        <param-item
          :key="item.id"
          :field="item"
          :currentToken="currentToken"
          :parent="parent"
          @handleTokenItem="handleTokenItem"
          @handleDeleteToken="handleDeleteToken"
          @handleResetToken="handleResetToken"
          @handleEmptyValue="handleEmptyValue"
        />
      </template>

      <!--  Render the arithmetic in arithmetic   -->
      <template v-if="item.token === 'arithmetic_token'">
        <arith-item
          :key="'arith' + item.id"
          :formula="[item.params[0]]"
          :currentToken="currentToken"
          :funcTokens="funcTokens"
          :parent="item"
          :self="item"
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
      </template>

      <!-- Render various tokens -->
      <span
        v-if="item.token === 'function'"
        :class="['fml-token fml-function fml-relative', currentToken.id === item.id ? 'active' : '']"
        :key="item.id"
      >

        <span
          v-if="currentToken.id === item.id && ((parent.token !== 'arithmetic_token' && parent.params && parent.params.length > parent.minParameterLength) || parent.isTop)"
          class="fml-formula-delete fml-parent-delete"
        >
          <svg
            class="fml-svg-icon"
            @click="handleDeleteToken({parent: parent, child: item})"
          >
            <use xlink:href="#fml-icon-guanbi" />
          </svg>
        </span>

        <span
          v-if="currentToken.id === item.id && ((parent.token !== 'arithmetic_token' && parent.params))"
          class="fml-formula-reset fml-parent-delete"
        >
          <svg
            class="fml-svg-icon"
            @click="handleResetToken({parent: parent, child: item})"
          >
            <use xlink:href="#fml-icon-reset" />
          </svg>
        </span>

        <span
          class="fml-function-name"
          v-if="item.token === 'function'"
          @click="handleFuncTokenItem({ ev: $event, obj: item })"
        >{{ item.name }}</span>

        <span
          v-if="item.token === 'function'"
          :class="operatorClass(item)"
          @mouseleave="mouseleaveOperator(item)"
          @mouseover="mouseoverOperator(item)"
        >(
        </span>

        <template v-for="(field, fieldIdx) in item.params">

          <template v-if="parameterTokens.includes(field.token)">
            <param-item
              :key="field.id"
              :field="field"
              :current-token="currentToken"
              :field-idx="fieldIdx"
              :parent="item"
              @handleTokenItem="handleTokenItem"
              @handleDeleteToken="handleDeleteToken"
              @handleResetToken="handleResetToken"
              @handleEmptyValue="handleEmptyValue"
            />
          </template>

          <template v-else-if="field.token === 'arithmetic_token'">
            <arith-item
              :key="'arith' + field.id"
              :formula="[field.params[0]]"
              :currentToken="currentToken"
              :funcTokens="funcTokens"
              :parent="item"
              :self="field"
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
          </template>

          <!--cycle-->
          <template v-else-if="field.token === 'function'">
            <formula-item
              :key="field.id"
              :formula="[field]"
              :currentToken="currentToken"
              :funcTokens="funcTokens"
              :parent="item"
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
          </template>

          <span
            :key="'comma' + field.id"
            class="fml-function-comma"
            v-if="fieldIdx !== item.params.length - 1"
          >,</span>

        </template>

        <span
          class="fml-formula-add"
          v-if="item.token === 'function' && (!item.limitParameterLength || item.params.length < item.minParameterLength)"
        >
          <span class="fml-field-line"></span>
          <svg
            class="fml-svg-icon"
            @click="handleAddEmptyToken(item)"
          >
            <use xlink:href="#fml-icon-add" />
          </svg>
        </span>

        <span
          v-if="item.token === 'function'"
          :class="operatorClass(item)"
          @mouseleave="mouseleaveOperator(item)"
          @mouseover="mouseoverOperator(item)"
        >)
        </span>

      </span>

    </template>
  </span>
</template>
<script>

import { parameterTokens } from '../../../config/define-token'
import ParamItem from './param-item';
import ArithItem from './arithmetic-item';

export default {
  inheritAttrs: false,
  name: 'formula-item',
  components: {
    ParamItem,
    ArithItem
  },
  data () {
    return {
      parameterTokens
    }
  },
  props: {
    formula: {
      type: Array,
      default: () => []
    },
    currentToken: {
      type: Object,
      default: () => {
      }
    },
    funcTokens: {
      type: Array,
      default: () => []
    },
    parent: {
      type: Object
    },
    currentOperatorId: {
      type: Number | String,
      default: ''
    }
  },
  computed: {
    operatorClass () {
      return function (item) {
        return item.uniqueId === this.currentOperatorId ? 'fml-function-bracket active' : 'fml-function-bracket'
      }
    }
  },
  methods: {
    handleAddEmptyToken (item) {
      this.$emit('handleAddEmptyToken', item);
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
};
</script>
