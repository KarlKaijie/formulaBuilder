<template>
  <span class="fml-relative">
    <span
      :class="[ 'fml-token fml-relative',
        currentToken.id === field.id ? activeColor : '',
        !field.value ? 'fml-empty' : '',
        field.token === 'field' ? 'fml-field' : field.token === 'input' ? 'fml-input' : field.token === 'const' ? 'fml-const' : ''
    ]"
      @click.stop="handleTokenItem(field)"
    >
      <template>
        {{ field.value }}
        <span
          class="fml-token-placeholder"
          :class="[!parent.placeholder || !parent.placeholder[fieldIdx] ? 'fml-token-min-space' : '']"
          v-if="!field.value"
        >{{ parent.placeholder && parent.placeholder[fieldIdx] || '?' }}</span>

        <span
          v-if="currentToken.id === field.id && parent.params && parent.params.length > parent.minParameterLength && parent.token !== 'arithmetic_token'"
          class="fml-formula-delete"
        >
          <svg
            class="fml-svg-icon"
            @click.stop="handleDeleteToken({parent: parent ,child: field})"
          >
            <use xlink:href="#fml-icon-guanbi" />
          </svg>
        </span>

        <span
          v-show="currentToken.id === field.id"
          class="fml-formula-reset"
        >
          <svg
            class="fml-svg-icon"
            @click.stop="handleResetToken({parent: parent ,child: field})"
          >
            <use xlink:href="#fml-icon-reset" />
          </svg>
        </span>
      </template>

    </span>

  </span>
</template>

<script>
export default {
  name: "param-item",
  props: {
    field: {
      type: Object,
      default: () => { }
    },
    currentToken: {
      type: Object,
      default: () => { }
    },
    parent: {
      type: Object,
      default: () => { }
    },
    fieldIdx: {
      type: Number,
    },
  },
  computed: {
    activeColor () {
      if (this.parent.token === 'arithmetic_token') {
        return 'active'
      } else {
        return 'active'
      }
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
</style>
