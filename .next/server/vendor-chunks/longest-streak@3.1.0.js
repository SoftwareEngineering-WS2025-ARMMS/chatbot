"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/longest-streak@3.1.0";
exports.ids = ["vendor-chunks/longest-streak@3.1.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   longestStreak: () => (/* binding */ longestStreak)\n/* harmony export */ });\n/**\n * Get the count of the longest repeating streak of `substring` in `value`.\n *\n * @param {string} value\n *   Content to search in.\n * @param {string} substring\n *   Substring to look for, typically one character.\n * @returns {number}\n *   Count of most frequent adjacent `substring`s in `value`.\n */ function longestStreak(value, substring) {\n    const source = String(value);\n    let index = source.indexOf(substring);\n    let expected = index;\n    let count = 0;\n    let max = 0;\n    if (typeof substring !== \"string\") {\n        throw new TypeError(\"Expected substring\");\n    }\n    while(index !== -1){\n        if (index === expected) {\n            if (++count > max) {\n                max = count;\n            }\n        } else {\n            count = 1;\n        }\n        expected = index + substring.length;\n        index = source.indexOf(substring, expected);\n    }\n    return max;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vbG9uZ2VzdC1zdHJlYWtAMy4xLjAvbm9kZV9tb2R1bGVzL2xvbmdlc3Qtc3RyZWFrL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7O0NBU0MsR0FDTSxTQUFTQSxjQUFjQyxLQUFLLEVBQUVDLFNBQVM7SUFDNUMsTUFBTUMsU0FBU0MsT0FBT0g7SUFDdEIsSUFBSUksUUFBUUYsT0FBT0csT0FBTyxDQUFDSjtJQUMzQixJQUFJSyxXQUFXRjtJQUNmLElBQUlHLFFBQVE7SUFDWixJQUFJQyxNQUFNO0lBRVYsSUFBSSxPQUFPUCxjQUFjLFVBQVU7UUFDakMsTUFBTSxJQUFJUSxVQUFVO0lBQ3RCO0lBRUEsTUFBT0wsVUFBVSxDQUFDLEVBQUc7UUFDbkIsSUFBSUEsVUFBVUUsVUFBVTtZQUN0QixJQUFJLEVBQUVDLFFBQVFDLEtBQUs7Z0JBQ2pCQSxNQUFNRDtZQUNSO1FBQ0YsT0FBTztZQUNMQSxRQUFRO1FBQ1Y7UUFFQUQsV0FBV0YsUUFBUUgsVUFBVVMsTUFBTTtRQUNuQ04sUUFBUUYsT0FBT0csT0FBTyxDQUFDSixXQUFXSztJQUNwQztJQUVBLE9BQU9FO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXN0ZXJ0aGVzaXNfYWkvLi9ub2RlX21vZHVsZXMvLnBucG0vbG9uZ2VzdC1zdHJlYWtAMy4xLjAvbm9kZV9tb2R1bGVzL2xvbmdlc3Qtc3RyZWFrL2luZGV4LmpzP2UzYzkiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHZXQgdGhlIGNvdW50IG9mIHRoZSBsb25nZXN0IHJlcGVhdGluZyBzdHJlYWsgb2YgYHN1YnN0cmluZ2AgaW4gYHZhbHVlYC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqICAgQ29udGVudCB0byBzZWFyY2ggaW4uXG4gKiBAcGFyYW0ge3N0cmluZ30gc3Vic3RyaW5nXG4gKiAgIFN1YnN0cmluZyB0byBsb29rIGZvciwgdHlwaWNhbGx5IG9uZSBjaGFyYWN0ZXIuXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICogICBDb3VudCBvZiBtb3N0IGZyZXF1ZW50IGFkamFjZW50IGBzdWJzdHJpbmdgcyBpbiBgdmFsdWVgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9uZ2VzdFN0cmVhayh2YWx1ZSwgc3Vic3RyaW5nKSB7XG4gIGNvbnN0IHNvdXJjZSA9IFN0cmluZyh2YWx1ZSlcbiAgbGV0IGluZGV4ID0gc291cmNlLmluZGV4T2Yoc3Vic3RyaW5nKVxuICBsZXQgZXhwZWN0ZWQgPSBpbmRleFxuICBsZXQgY291bnQgPSAwXG4gIGxldCBtYXggPSAwXG5cbiAgaWYgKHR5cGVvZiBzdWJzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgc3Vic3RyaW5nJylcbiAgfVxuXG4gIHdoaWxlIChpbmRleCAhPT0gLTEpIHtcbiAgICBpZiAoaW5kZXggPT09IGV4cGVjdGVkKSB7XG4gICAgICBpZiAoKytjb3VudCA+IG1heCkge1xuICAgICAgICBtYXggPSBjb3VudFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDFcbiAgICB9XG5cbiAgICBleHBlY3RlZCA9IGluZGV4ICsgc3Vic3RyaW5nLmxlbmd0aFxuICAgIGluZGV4ID0gc291cmNlLmluZGV4T2Yoc3Vic3RyaW5nLCBleHBlY3RlZClcbiAgfVxuXG4gIHJldHVybiBtYXhcbn1cbiJdLCJuYW1lcyI6WyJsb25nZXN0U3RyZWFrIiwidmFsdWUiLCJzdWJzdHJpbmciLCJzb3VyY2UiLCJTdHJpbmciLCJpbmRleCIsImluZGV4T2YiLCJleHBlY3RlZCIsImNvdW50IiwibWF4IiwiVHlwZUVycm9yIiwibGVuZ3RoIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/longest-streak@3.1.0/node_modules/longest-streak/index.js\n");

/***/ })

};
;