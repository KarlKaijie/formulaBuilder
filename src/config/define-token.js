export const parameterTokens = ["empty", "field", "input", "const_token"];

export const empty_token = {
    token: "empty",
    value: null
};

export const field_token = {
    token: "field",
    value: null
};

export const input_token = {
    token: "input",
    value: null
};

export const const_token = {
    PI: {
        token: "const_token",
        value: "PI"
    },
    e: {
        token: "const_token",
        value: "e"
    }
};

export const operator_token = [
    {
        token: "operator_token",
        value: "plus",
        operator: "+"
    },
    {
        token: "operator_token",
        value: "subtract",
        operator: "-"
    },
    {
        token: "operator_token",
        value: "multiply",
        operator: "*"
    },
    {
        token: "operator_token",
        value: "divide",
        operator: "/"
    },
    {
        token: "operator_token",
        value: "power",
        operator: "**"
    }
];

export const func_token = {
    token: "function", // token类型
    name: "", // 函数名
    desc: "", // 函数描述
    placeholder: [], // 参数提示
    params: [], // 参数
    minParameterLength: null, // 参数最少几个
    limitParameterLength: false // 是否限制参数参数
};

export const arithmetic_token = {
    token: "arithmetic_token", // token类型
    operator: null,
    params: [{...empty_token}, {...empty_token}],
    newPlaceholder: "number",
    minParameterLength: 2,
    limitParameterLength: true
};
