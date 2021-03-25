<template>
  <span>
    <template v-for="item in formula">

      <!--  Render the token of the non-function in arithmetic    -->
      <template v-if="item.token !== 'function' && item.token !== 'arithmetic_token'">
        <span :key="item.id" >
          <span>
            {{ item.value }}
          </span>
        </span>
      </template>

      <!--  Render the arithmetic in arithmetic   -->
      <template v-if="item.token === 'arithmetic_token'">
        <span v-if="!firstParameter || firstParameter.token !== 'arithmetic_token'">(</span>
         <formula-preview-item
             :key="'arith' + item.id + 1"
             :formula="[item.params[0]]"
         />

         <span :key="'arith' + item.id + 2" :class="[['**', '*'].includes(item.operator) ? 'vertical-sub': '']">{{ item.operator }}</span>

         <formula-preview-item
             :key="'arith' + item.id + 3"
             :formula="[item.params[1]]"
         />
        <span v-if="!firstParameter || firstParameter.token !== 'arithmetic_token'">)</span>
      </template>

      <!-- Render various tokens -->
      <span v-if="item.token === 'function'" :key="item.id">

        <span v-if="item.token === 'function'" >{{ item.name }}</span>

        <span v-if="item.token === 'function'">(</span>

        <template v-for="(field, fieldIdx) in item.params">

          <template v-if="parameterTokens.includes(field.token)">
            <span class="fml-formula-field fml-relative" :key="field.id" >
              <span>
                {{ field.value }}
              </span>
            </span>
          </template>

          <template v-else-if="field.token === 'arithmetic_token'">
            <formula-preview-item
                :key="'arith' + field.id + 1"
                :formula="[field.params[0]]"
            />
            <span :key="'arith' + field.id + 2" :class="[['**', '*'].includes(item.operator) ? 'vertical-sub': '']">{{ field.operator }}</span>
            <formula-preview-item
                :key="'arith' + field.id + 3"
                :formula="[field.params[1]]"
            />
          </template>

          <!--cycle-->
          <template v-else-if="field.token === 'function'">
            <formula-preview-item :key="field.id" :formula="[field]" />
          </template>

          <span :key="'comma' + field.id" v-if="fieldIdx !== item.params.length - 1">,</span>

        </template>

        <span v-if="item.token === 'function'">)</span>

      </span>

    </template>
  </span>
</template>


<script>
import {parameterTokens} from '../../../config/define-token'
export default {
  name: 'FormulaPreviewItem',
  props: {
    formula: {
      type: Array,
      default:() => []
    },
    firstParameter: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      parameterTokens
    }
  }
};
</script>


<style lang="scss">
.fml-formula-preview {
  .fml-function-comma {
    margin: 0 8px 0 0;
  }
}
</style>
