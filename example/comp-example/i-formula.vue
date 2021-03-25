<template>
  <div id="app">
    <!-- edit -->
    <formula-builder ref="Formula"></formula-builder>

    <br />
    <br />
    <hr />

    <button @click="handleGetValue">获取值</button>
    <button @click="handleSave">保存</button>
    <button @click="handleClear">清空</button>
    <button @click="handleParse">解析为excel公式</button>

    <hr />
    <!-- preview -->
    <ul>
      <li
        v-for="(item, idx) in list"
        :key="idx"
      >
        <formula-preview :initialValue="item"></formula-preview>
      </li>
    </ul>

    <div>
      <hr>
      解析成excel公式(还没写)
      <p>
        {{ excel }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      iptValue: "",
      currentId: null,
      visible: false,
      fieldVal: [],
      list: [
        {
          "token": "arithmetic_token",
          "operator": "*",
          "params": [{ "token": "arithmetic_token", "operator": "+", "params": [{ "token": "input", "value": "1" }, { "token": "input", "value": "2" }], "type": "plus" }, { "token": "input", "value": "3" }],
          "type": "multiply"
        },
        {
          "token": "function",
          "name": "SUM",
          "params": [{ "token": "input", "value": "1" }, { "token": "function", "name": "LOG", "params": [{ "token": "input", "value": "11" }, { "token": "input", "value": "2" }] }]
        }
      ],
      excel: 'undefined'
    };
  },
  mounted () {
    this.$refs.Formula.init({
      locale: 'en',
      defineFunctions: [],
      prohibitInput: false,
      initialValue: {},
      width: "960px",
      fields: this.fieldVal,
      enableConst: false,
      options: []
    }).then(() => {
      this.$refs.Formula.setFields(
        [
          { "type": "curr", "field": "curr.env[Walker2d_demo2.obs_0]" }, { "type": "curr", "field": "curr.env[Walker2d_demo2.obs_1]" }, {
            "type": "curr",
            "field": "curr.action_a[Walker2d_demo2.action_0]"
          }, { "type": "curr", "field": "curr.action_a[Walker2d_demo2.action_1]" }, { "type": "curr", "field": "curr.action_b[Walker2d_demo2.action_2]" }, {
            "type": "curr",
            "field": "curr.action_b[Walker2d_demo2.action_3]"
          }, { "type": "next", "field": "next.env[Walker2d_demo2.obs_0]" }, { "type": "next", "field": "next.env[Walker2d_demo2.obs_1]" }, {
            "type": "next",
            "field": "next.action_a[Walker2d_demo2.action_0]"
          }, { "type": "next", "field": "next.action_a[Walker2d_demo2.action_1]" }, { "type": "next", "field": "next.action_b[Walker2d_demo2.action_2]" }, {
            "type": "next",
            "field": "next.action_b[Walker2d_demo2.action_3]"
          },
        ]
      );
    });
  },
  methods: {
    handleGetValue () {
      let value = this.$refs.Formula.getValue();
      if (value.type !== "success") return;
      window.alert(JSON.stringify(value.value, null, 4))
    },
    handleSave () {
      let value = this.$refs.Formula.getValue();
      if (value.type !== "success") return;
      console.log(value.value);
      this.list.push(value.value);
    },
    handleClear () {
      this.$refs.Formula.clear();
    },
    handleParse () {
      this.excel = this.$refs.Formula.parseTree2ExcelFormula()
    }
  }
};
</script>

<style>
.formula-field-item {
    padding: 12px 24px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

.text-ocean-6 {
    color: blue !important;
}
</style>
