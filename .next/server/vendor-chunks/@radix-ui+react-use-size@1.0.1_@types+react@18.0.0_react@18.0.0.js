"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@radix-ui+react-use-size@1.0.1_@types+react@18.0.0_react@18.0.0";
exports.ids = ["vendor-chunks/@radix-ui+react-use-size@1.0.1_@types+react@18.0.0_react@18.0.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/@radix-ui+react-use-size@1.0.1_@types+react@18.0.0_react@18.0.0/node_modules/@radix-ui/react-use-size/dist/index.mjs":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@radix-ui+react-use-size@1.0.1_@types+react@18.0.0_react@18.0.0/node_modules/@radix-ui/react-use-size/dist/index.mjs ***!
  \*************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useSize: () => (/* binding */ $db6c3485150b8e66$export$1ab7ae714698c4b8)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/.pnpm/next@14.0.4_react-dom@18.0.0_react@18.0.0/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\");\n/* harmony import */ var _radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @radix-ui/react-use-layout-effect */ \"(ssr)/./node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.0.1_@types+react@18.0.0_react@18.0.0/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs\");\n\n\nfunction $db6c3485150b8e66$export$1ab7ae714698c4b8(element) {\n    const [size, setSize] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);\n    (0,_radix_ui_react_use_layout_effect__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect)(()=>{\n        if (element) {\n            // provide size as early as possible\n            setSize({\n                width: element.offsetWidth,\n                height: element.offsetHeight\n            });\n            const resizeObserver = new ResizeObserver((entries)=>{\n                if (!Array.isArray(entries)) return;\n                // Since we only observe the one element, we don't need to loop over the\n                // array\n                if (!entries.length) return;\n                const entry = entries[0];\n                let width;\n                let height;\n                if (\"borderBoxSize\" in entry) {\n                    const borderSizeEntry = entry[\"borderBoxSize\"]; // iron out differences between browsers\n                    const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;\n                    width = borderSize[\"inlineSize\"];\n                    height = borderSize[\"blockSize\"];\n                } else {\n                    // for browsers that don't support `borderBoxSize`\n                    // we calculate it ourselves to get the correct border box.\n                    width = element.offsetWidth;\n                    height = element.offsetHeight;\n                }\n                setSize({\n                    width: width,\n                    height: height\n                });\n            });\n            resizeObserver.observe(element, {\n                box: \"border-box\"\n            });\n            return ()=>resizeObserver.unobserve(element);\n        } else // not if it changes to another element.\n        setSize(undefined);\n    }, [\n        element\n    ]);\n    return size;\n}\n //# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vQHJhZGl4LXVpK3JlYWN0LXVzZS1zaXplQDEuMC4xX0B0eXBlcytyZWFjdEAxOC4wLjBfcmVhY3RAMTguMC4wL25vZGVfbW9kdWxlcy9AcmFkaXgtdWkvcmVhY3QtdXNlLXNpemUvZGlzdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtEO0FBQzBDO0FBSTVGLFNBQVNJLDBDQUEwQ0MsT0FBTztJQUN0RCxNQUFNLENBQUNDLE1BQU1DLFFBQVEsR0FBR04sK0NBQWVBLENBQUNPO0lBQ3hDTCxrRkFBc0JBLENBQUM7UUFDbkIsSUFBSUUsU0FBUztZQUNULG9DQUFvQztZQUNwQ0UsUUFBUTtnQkFDSkUsT0FBT0osUUFBUUssV0FBVztnQkFDMUJDLFFBQVFOLFFBQVFPLFlBQVk7WUFDaEM7WUFDQSxNQUFNQyxpQkFBaUIsSUFBSUMsZUFBZSxDQUFDQztnQkFDdkMsSUFBSSxDQUFDQyxNQUFNQyxPQUFPLENBQUNGLFVBQVU7Z0JBQzVCLHdFQUF3RTtnQkFDekUsUUFBUTtnQkFDUixJQUFJLENBQUNBLFFBQVFHLE1BQU0sRUFBRTtnQkFDckIsTUFBTUMsUUFBUUosT0FBTyxDQUFDLEVBQUU7Z0JBQ3hCLElBQUlOO2dCQUNKLElBQUlFO2dCQUNKLElBQUksbUJBQW1CUSxPQUFPO29CQUMxQixNQUFNQyxrQkFBa0JELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSx3Q0FBd0M7b0JBQ3hGLE1BQU1FLGFBQWFMLE1BQU1DLE9BQU8sQ0FBQ0csbUJBQW1CQSxlQUFlLENBQUMsRUFBRSxHQUFHQTtvQkFDekVYLFFBQVFZLFVBQVUsQ0FBQyxhQUFhO29CQUNoQ1YsU0FBU1UsVUFBVSxDQUFDLFlBQVk7Z0JBQ3BDLE9BQU87b0JBQ0gsa0RBQWtEO29CQUNsRCwyREFBMkQ7b0JBQzNEWixRQUFRSixRQUFRSyxXQUFXO29CQUMzQkMsU0FBU04sUUFBUU8sWUFBWTtnQkFDakM7Z0JBQ0FMLFFBQVE7b0JBQ0pFLE9BQU9BO29CQUNQRSxRQUFRQTtnQkFDWjtZQUNKO1lBQ0FFLGVBQWVTLE9BQU8sQ0FBQ2pCLFNBQVM7Z0JBQzVCa0IsS0FBSztZQUNUO1lBQ0EsT0FBTyxJQUFJVixlQUFlVyxTQUFTLENBQUNuQjtRQUV4QyxPQUNBLHdDQUF3QztRQUN4Q0UsUUFBUUM7SUFDWixHQUFHO1FBQ0NIO0tBQ0g7SUFDRCxPQUFPQztBQUNYO0FBSzhELENBQzlELGtDQUFrQyIsInNvdXJjZXMiOlsid2VicGFjazovL21hc3RlcnRoZXNpc19haS8uL25vZGVfbW9kdWxlcy8ucG5wbS9AcmFkaXgtdWkrcmVhY3QtdXNlLXNpemVAMS4wLjFfQHR5cGVzK3JlYWN0QDE4LjAuMF9yZWFjdEAxOC4wLjAvbm9kZV9tb2R1bGVzL0ByYWRpeC11aS9yZWFjdC11c2Utc2l6ZS9kaXN0L2luZGV4Lm1qcz81YjI3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7dXNlU3RhdGUgYXMgJDlneUdSJHVzZVN0YXRlfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7dXNlTGF5b3V0RWZmZWN0IGFzICQ5Z3lHUiR1c2VMYXlvdXRFZmZlY3R9IGZyb20gXCJAcmFkaXgtdWkvcmVhY3QtdXNlLWxheW91dC1lZmZlY3RcIjtcblxuXG5cbmZ1bmN0aW9uICRkYjZjMzQ4NTE1MGI4ZTY2JGV4cG9ydCQxYWI3YWU3MTQ2OThjNGI4KGVsZW1lbnQpIHtcbiAgICBjb25zdCBbc2l6ZSwgc2V0U2l6ZV0gPSAkOWd5R1IkdXNlU3RhdGUodW5kZWZpbmVkKTtcbiAgICAkOWd5R1IkdXNlTGF5b3V0RWZmZWN0KCgpPT57XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBwcm92aWRlIHNpemUgYXMgZWFybHkgYXMgcG9zc2libGVcbiAgICAgICAgICAgIHNldFNpemUoe1xuICAgICAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgcmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXMpPT57XG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGVudHJpZXMpKSByZXR1cm47XG4gICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIG9ubHkgb2JzZXJ2ZSB0aGUgb25lIGVsZW1lbnQsIHdlIGRvbid0IG5lZWQgdG8gbG9vcCBvdmVyIHRoZVxuICAgICAgICAgICAgICAgIC8vIGFycmF5XG4gICAgICAgICAgICAgICAgaWYgKCFlbnRyaWVzLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZW50cmllc1swXTtcbiAgICAgICAgICAgICAgICBsZXQgd2lkdGg7XG4gICAgICAgICAgICAgICAgbGV0IGhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoJ2JvcmRlckJveFNpemUnIGluIGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvcmRlclNpemVFbnRyeSA9IGVudHJ5Wydib3JkZXJCb3hTaXplJ107IC8vIGlyb24gb3V0IGRpZmZlcmVuY2VzIGJldHdlZW4gYnJvd3NlcnNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9yZGVyU2l6ZSA9IEFycmF5LmlzQXJyYXkoYm9yZGVyU2l6ZUVudHJ5KSA/IGJvcmRlclNpemVFbnRyeVswXSA6IGJvcmRlclNpemVFbnRyeTtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSBib3JkZXJTaXplWydpbmxpbmVTaXplJ107XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGJvcmRlclNpemVbJ2Jsb2NrU2l6ZSddO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciBicm93c2VycyB0aGF0IGRvbid0IHN1cHBvcnQgYGJvcmRlckJveFNpemVgXG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbGN1bGF0ZSBpdCBvdXJzZWx2ZXMgdG8gZ2V0IHRoZSBjb3JyZWN0IGJvcmRlciBib3guXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFNpemUoe1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwge1xuICAgICAgICAgICAgICAgIGJveDogJ2JvcmRlci1ib3gnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiAoKT0+cmVzaXplT2JzZXJ2ZXIudW5vYnNlcnZlKGVsZW1lbnQpXG4gICAgICAgICAgICA7XG4gICAgICAgIH0gZWxzZSAvLyBXZSBvbmx5IHdhbnQgdG8gcmVzZXQgdG8gYHVuZGVmaW5lZGAgd2hlbiB0aGUgZWxlbWVudCBiZWNvbWVzIGBudWxsYCxcbiAgICAgICAgLy8gbm90IGlmIGl0IGNoYW5nZXMgdG8gYW5vdGhlciBlbGVtZW50LlxuICAgICAgICBzZXRTaXplKHVuZGVmaW5lZCk7XG4gICAgfSwgW1xuICAgICAgICBlbGVtZW50XG4gICAgXSk7XG4gICAgcmV0dXJuIHNpemU7XG59XG5cblxuXG5cbmV4cG9ydCB7JGRiNmMzNDg1MTUwYjhlNjYkZXhwb3J0JDFhYjdhZTcxNDY5OGM0YjggYXMgdXNlU2l6ZX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iXSwibmFtZXMiOlsidXNlU3RhdGUiLCIkOWd5R1IkdXNlU3RhdGUiLCJ1c2VMYXlvdXRFZmZlY3QiLCIkOWd5R1IkdXNlTGF5b3V0RWZmZWN0IiwiJGRiNmMzNDg1MTUwYjhlNjYkZXhwb3J0JDFhYjdhZTcxNDY5OGM0YjgiLCJlbGVtZW50Iiwic2l6ZSIsInNldFNpemUiLCJ1bmRlZmluZWQiLCJ3aWR0aCIsIm9mZnNldFdpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwicmVzaXplT2JzZXJ2ZXIiLCJSZXNpemVPYnNlcnZlciIsImVudHJpZXMiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJlbnRyeSIsImJvcmRlclNpemVFbnRyeSIsImJvcmRlclNpemUiLCJvYnNlcnZlIiwiYm94IiwidW5vYnNlcnZlIiwidXNlU2l6ZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/@radix-ui+react-use-size@1.0.1_@types+react@18.0.0_react@18.0.0/node_modules/@radix-ui/react-use-size/dist/index.mjs\n");

/***/ })

};
;