"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9608],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>y});var n=r(67294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=n.createContext({}),s=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,a=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),b=s(r),y=i,m=b["".concat(p,".").concat(y)]||b[y]||u[y]||a;return r?n.createElement(m,o(o({ref:t},c),{},{components:r})):n.createElement(m,o({ref:t},c))}));function y(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=b;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:i,o[1]=l;for(var s=2;s<a;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},9294:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>b,frontMatter:()=>o,metadata:()=>p,toc:()=>c});r(67294);var n=r(3905);function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i.apply(this,arguments)}function a(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}const o={sidebar_label:"Locator.setVisibility"},l="Locator.setVisibility() method",p={unversionedId:"api/puppeteer.locator.setvisibility",id:"version-20.8.1/api/puppeteer.locator.setvisibility",title:"Locator.setVisibility() method",description:"Signature:",source:"@site/versioned_docs/version-20.8.1/api/puppeteer.locator.setvisibility.md",sourceDirName:"api",slug:"/api/puppeteer.locator.setvisibility",permalink:"/api/puppeteer.locator.setvisibility",draft:!1,tags:[],version:"20.8.1",frontMatter:{sidebar_label:"Locator.setVisibility"},sidebar:"api",previous:{title:"Locator.setTimeout",permalink:"/api/puppeteer.locator.settimeout"},next:{title:"Locator.setWaitForEnabled",permalink:"/api/puppeteer.locator.setwaitforenabled"}},s={},c=[{value:"Signature:",id:"signature",level:4},{value:"Parameters",id:"parameters",level:2}],u={toc:c};function b(e){var{components:t}=e,r=a(e,["components"]);return(0,n.kt)("wrapper",i({},u,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",i({},{id:"locatorsetvisibility-method"}),"Locator.setVisibility() method"),(0,n.kt)("h4",i({},{id:"signature"}),"Signature:"),(0,n.kt)("pre",null,(0,n.kt)("code",i({parentName:"pre"},{className:"language-typescript"}),"class Locator {\n  abstract setVisibility(visibility: VisibilityOption): this;\n}\n")),(0,n.kt)("h2",i({},{id:"parameters"}),"Parameters"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",i({parentName:"tr"},{align:null}),"Parameter"),(0,n.kt)("th",i({parentName:"tr"},{align:null}),"Type"),(0,n.kt)("th",i({parentName:"tr"},{align:null}),"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",i({parentName:"tr"},{align:null}),"visibility"),(0,n.kt)("td",i({parentName:"tr"},{align:null}),(0,n.kt)("a",i({parentName:"td"},{href:"/api/puppeteer.visibilityoption"}),"VisibilityOption")),(0,n.kt)("td",i({parentName:"tr"},{align:null}))))),(0,n.kt)("p",null,(0,n.kt)("strong",{parentName:"p"},"Returns:")),(0,n.kt)("p",null,"this"))}b.isMDXComponent=!0}}]);