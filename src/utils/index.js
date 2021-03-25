export function deepClone(obj) {
    const newObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] && typeof obj[key] === "object") {
                newObj[key] = deepClone(obj[key]);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    return newObj;
}

export function addClass(ele, value) {
    if (!hasClass(ele, value)) {
        ele.className += " " + value;
    }
}

export function hasClass(ele, value) {
    const reg = new RegExp("\\b" + value + "\\b");
    return reg.test(ele.className);
}

export function removeClass(ele, value) {
    const reg = new RegExp("\\b" + value + "\\b");
    ele.className = ele.className.replace(reg, "");
}

export function toggleClass(ele, value) {
    if (hasClass(ele, value)) {
        removeClass(ele, value);
    } else {
        addClass(ele, value);
    }
}

export function getStyle(ele, attr) {
    if (ele.currentStyle) {
        return ele.currentStyle[attr];
    } else {
        return getComputedStyle(ele, null)[attr];
    }
}
