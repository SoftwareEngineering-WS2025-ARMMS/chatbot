"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/escape-string-regexp@5.0.0";
exports.ids = ["vendor-chunks/escape-string-regexp@5.0.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ escapeStringRegexp)\n/* harmony export */ });\nfunction escapeStringRegexp(string) {\n    if (typeof string !== \"string\") {\n        throw new TypeError(\"Expected a string\");\n    }\n    // Escape characters with special meaning either inside or outside character sets.\n    // Use a simple backslash escape when it’s always valid, and a `\\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.\n    return string.replace(/[|\\\\{}()[\\]^$+*?.]/g, \"\\\\$&\").replace(/-/g, \"\\\\x2d\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vZXNjYXBlLXN0cmluZy1yZWdleHBANS4wLjAvbm9kZV9tb2R1bGVzL2VzY2FwZS1zdHJpbmctcmVnZXhwL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBZSxTQUFTQSxtQkFBbUJDLE1BQU07SUFDaEQsSUFBSSxPQUFPQSxXQUFXLFVBQVU7UUFDL0IsTUFBTSxJQUFJQyxVQUFVO0lBQ3JCO0lBRUEsa0ZBQWtGO0lBQ2xGLDZKQUE2SjtJQUM3SixPQUFPRCxPQUNMRSxPQUFPLENBQUMsdUJBQXVCLFFBQy9CQSxPQUFPLENBQUMsTUFBTTtBQUNqQiIsInNvdXJjZXMiOlsid2VicGFjazovL21hc3RlcnRoZXNpc19haS8uL25vZGVfbW9kdWxlcy8ucG5wbS9lc2NhcGUtc3RyaW5nLXJlZ2V4cEA1LjAuMC9ub2RlX21vZHVsZXMvZXNjYXBlLXN0cmluZy1yZWdleHAvaW5kZXguanM/NWMyZiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlc2NhcGVTdHJpbmdSZWdleHAoc3RyaW5nKSB7XG5cdGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG5cdH1cblxuXHQvLyBFc2NhcGUgY2hhcmFjdGVycyB3aXRoIHNwZWNpYWwgbWVhbmluZyBlaXRoZXIgaW5zaWRlIG9yIG91dHNpZGUgY2hhcmFjdGVyIHNldHMuXG5cdC8vIFVzZSBhIHNpbXBsZSBiYWNrc2xhc2ggZXNjYXBlIHdoZW4gaXTigJlzIGFsd2F5cyB2YWxpZCwgYW5kIGEgYFxceG5uYCBlc2NhcGUgd2hlbiB0aGUgc2ltcGxlciBmb3JtIHdvdWxkIGJlIGRpc2FsbG93ZWQgYnkgVW5pY29kZSBwYXR0ZXJuc+KAmSBzdHJpY3RlciBncmFtbWFyLlxuXHRyZXR1cm4gc3RyaW5nXG5cdFx0LnJlcGxhY2UoL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nLCAnXFxcXCQmJylcblx0XHQucmVwbGFjZSgvLS9nLCAnXFxcXHgyZCcpO1xufVxuIl0sIm5hbWVzIjpbImVzY2FwZVN0cmluZ1JlZ2V4cCIsInN0cmluZyIsIlR5cGVFcnJvciIsInJlcGxhY2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js\n");

/***/ })

};
;