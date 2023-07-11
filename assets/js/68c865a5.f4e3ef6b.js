"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[70334],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>d});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),u=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},s=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),m=u(n),d=r,g=m["".concat(i,".").concat(d)]||m[d]||c[d]||l;return n?a.createElement(g,p(p({ref:t},s),{},{components:n})):a.createElement(g,p({ref:t},s))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,p=new Array(l);p[0]=m;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:r,p[1]=o;for(var u=2;u<l;u++)p[u]=n[u];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},68513:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>o,default:()=>m,frontMatter:()=>p,metadata:()=>i,toc:()=>s});n(67294);var a=n(3905);function r(){return r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r.apply(this,arguments)}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}const p={sidebar_label:"Page.$eval"},o="Page.$eval() method",i={unversionedId:"api/puppeteer.page._eval",id:"version-20.8.1/api/puppeteer.page._eval",title:"Page.$eval() method",description:"This method runs document.querySelector within the page and passes the result as the first argument to the pageFunction.",source:"@site/versioned_docs/version-20.8.1/api/puppeteer.page._eval.md",sourceDirName:"api",slug:"/api/puppeteer.page._eval",permalink:"/api/puppeteer.page._eval",draft:!1,tags:[],version:"20.8.1",frontMatter:{sidebar_label:"Page.$eval"},sidebar:"api",previous:{title:"Page.$$eval",permalink:"/api/puppeteer.page.__eval"},next:{title:"Page.$x",permalink:"/api/puppeteer.page._x"}},u={},s=[{value:"Signature:",id:"signature",level:4},{value:"Parameters",id:"parameters",level:2},{value:"Remarks",id:"remarks",level:2},{value:"Example 1",id:"example-1",level:2},{value:"Example 2",id:"example-2",level:2},{value:"Example 3",id:"example-3",level:2}],c={toc:s};function m(e){var{components:t}=e,n=l(e,["components"]);return(0,a.kt)("wrapper",r({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",r({},{id:"pageeval-method"}),"Page.$eval() method"),(0,a.kt)("p",null,"This method runs ",(0,a.kt)("inlineCode",{parentName:"p"},"document.querySelector")," within the page and passes the result as the first argument to the ",(0,a.kt)("inlineCode",{parentName:"p"},"pageFunction"),"."),(0,a.kt)("h4",r({},{id:"signature"}),"Signature:"),(0,a.kt)("pre",null,(0,a.kt)("code",r({parentName:"pre"},{className:"language-typescript"}),"class Page {\n  $eval<\n    Selector extends string,\n    Params extends unknown[],\n    Func extends EvaluateFuncWith<NodeFor<Selector>, Params> = EvaluateFuncWith<\n      NodeFor<Selector>,\n      Params\n    >\n  >(\n    selector: Selector,\n    pageFunction: Func | string,\n    ...args: Params\n  ): Promise<Awaited<ReturnType<Func>>>;\n}\n")),(0,a.kt)("h2",r({},{id:"parameters"}),"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Parameter"),(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Type"),(0,a.kt)("th",r({parentName:"tr"},{align:null}),"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"selector"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Selector"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"the ",(0,a.kt)("a",r({parentName:"td"},{href:"https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors"}),"selector")," to query for")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"pageFunction"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Func ","|"," string"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"the function to be evaluated in the page context. Will be passed the result of ",(0,a.kt)("code",null,"document.querySelector(selector)")," as its first argument.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",r({parentName:"tr"},{align:null}),"args"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"Params"),(0,a.kt)("td",r({parentName:"tr"},{align:null}),"any additional arguments to pass through to ",(0,a.kt)("code",null,"pageFunction"),".")))),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Returns:")),(0,a.kt)("p",null,"Promise","<","Awaited","<","ReturnType","<","Func",">",">",">"),(0,a.kt)("p",null,"The result of calling ",(0,a.kt)("inlineCode",{parentName:"p"},"pageFunction"),". If it returns an element it is wrapped in an ",(0,a.kt)("a",r({parentName:"p"},{href:"/api/puppeteer.elementhandle"}),"ElementHandle"),", else the raw value itself is returned."),(0,a.kt)("h2",r({},{id:"remarks"}),"Remarks"),(0,a.kt)("p",null,"If no element is found matching ",(0,a.kt)("inlineCode",{parentName:"p"},"selector"),", the method will throw an error."),(0,a.kt)("p",null,"If ",(0,a.kt)("inlineCode",{parentName:"p"},"pageFunction")," returns a promise ",(0,a.kt)("inlineCode",{parentName:"p"},"$eval")," will wait for the promise to resolve and then return its value."),(0,a.kt)("h2",r({},{id:"example-1"}),"Example 1"),(0,a.kt)("pre",null,(0,a.kt)("code",r({parentName:"pre"},{className:"language-ts"}),"const searchValue = await page.$eval('#search', el => el.value);\nconst preloadHref = await page.$eval('link[rel=preload]', el => el.href);\nconst html = await page.$eval('.main-container', el => el.outerHTML);\n")),(0,a.kt)("p",null,"If you are using TypeScript, you may have to provide an explicit type to the first argument of the ",(0,a.kt)("inlineCode",{parentName:"p"},"pageFunction"),". By default it is typed as ",(0,a.kt)("inlineCode",{parentName:"p"},"Element"),", but you may need to provide a more specific sub-type:"),(0,a.kt)("h2",r({},{id:"example-2"}),"Example 2"),(0,a.kt)("pre",null,(0,a.kt)("code",r({parentName:"pre"},{className:"language-ts"}),"// if you don't provide HTMLInputElement here, TS will error\n// as `value` is not on `Element`\nconst searchValue = await page.$eval(\n  '#search',\n  (el: HTMLInputElement) => el.value\n);\n")),(0,a.kt)("p",null,"The compiler should be able to infer the return type from the ",(0,a.kt)("inlineCode",{parentName:"p"},"pageFunction")," you provide. If it is unable to, you can use the generic type to tell the compiler what return type you expect from ",(0,a.kt)("inlineCode",{parentName:"p"},"$eval"),":"),(0,a.kt)("h2",r({},{id:"example-3"}),"Example 3"),(0,a.kt)("pre",null,(0,a.kt)("code",r({parentName:"pre"},{className:"language-ts"}),"// The compiler can infer the return type in this case, but if it can't\n// or if you want to be more explicit, provide it as the generic type.\nconst searchValue = await page.$eval<string>(\n  '#search',\n  (el: HTMLInputElement) => el.value\n);\n")))}m.isMDXComponent=!0}}]);