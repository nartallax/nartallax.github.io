function t(t,e,n,s){Object.defineProperty(t,e,{get:n,set:s,enumerable:!0,configurable:!0})}var e=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequirebf86;e.register("aFKcI",(function(n,s){t(n.exports,"main",(()=>u));var o=e("aCP3q"),a=e("g0JTA");const i=t=>t<10?"0"+t:""+t;function r(t){if(t<0)return"-"+r(-t);const e=t%1e3,n=(t=Math.floor(t/1e3))%60,s=(t=Math.floor(t/60))%60,o=Math.floor(t/60);return`${i(o)}:${i(s)}:${i(n)}.${a=e,a<10?"00"+a:a<100?"0"+a:""+a}`;var a}function l(t){const e=parseInt(t);return Number.isNaN(e)||!Number.isFinite(e)?0:e}function c(t){const e=t.split(":");let n=0;if(e.length>0){const t=e[e.length-1].split(".");if(2===t.length){const[s,o]=t;e[e.length-1]=s,n+=l(o)}}let s=1e3;for(let t=e.length-1;t>=0;t--){n+=l(e[t])*s,s*=60}return n}function u(t){t.classList.add(a.timerRoot??"");const e=(0,o.tag)({class:a.wrap}),n=(0,o.tag)({class:a.timer});e.appendChild(n);const s=(0,o.tag)({tagName:"button",text:"reset",class:a.button});s.addEventListener("click",(()=>{h=0,g()})),e.appendChild(s);const i=(0,o.tag)({tagName:"button",text:"pause",class:a.button});i.addEventListener("click",(()=>{b?(b=!1,i.value="pause"):(b=!0,i.value="unpause")})),e.appendChild(i);const l=(0,o.tag)({class:a.speedBlock,text:"Speed: "}),u=(0,o.tag)({tagName:"input",attrs:{type:"number",value:1},class:a.speedInput});!function(t,e){let n=t.value;const s=()=>{const s=t.value;s!==n&&(n=s,e(s))};t.addEventListener("change",s),t.addEventListener("mousedown",s),t.addEventListener("mouseup",s),t.addEventListener("keydown",s),t.addEventListener("keyup",s)}(u,(()=>{const t=parseFloat(u.value);!Number.isNaN(t)&&Number.isFinite(t)?m=t:console.warn("Bad speed value: "+JSON.stringify(u.value)+": cannot parse")})),l.appendChild(u),e.appendChild(l);const d=(0,o.tag)(),p=(0,o.tag)({tagName:"button",text:"Add time",class:a.button});p.addEventListener("click",(()=>{h+=c(f.value),g()})),d.appendChild(p);const f=(0,o.tag)({tagName:"input",attrs:{type:"string",value:"5:00.000"},class:a.speedInput});function g(){n.textContent=r(Math.round(h))}f.addEventListener("blur",(()=>{f.value=function(t){let e=r(t).replace(/^[0:]+/,"");return e.startsWith(".")&&(e="0"+e),e}(c(f.value))})),d.appendChild(f),e.appendChild(d),t.appendChild(e);let h=0,b=!1,m=1,v=Date.now();const x=()=>{requestAnimationFrame(x);const t=Date.now(),e=(t-v)*m;v=t,b||(h+=e,g())};x()}})),e.register("aCP3q",(function(n,s){t(n.exports,"tag",(()=>c)),t(n.exports,"svgTag",(()=>u));var o=e("hIDiW"),a=e("hsvBG"),i=e("jM5hi");function r(t,e){return t?Array.isArray(t)||(0,a.isRBox)(t)?[{},t]:[t,e]:[{},e]}function l(t,e,n){let s=null;if(e.text){const n=e.text;(0,a.isRBox)(n)&&(s||=(0,o.getBinder)(t)).watch(n,(e=>{t.textContent=e+""})),t.textContent=(0,a.unbox)(n)+""}if(e.on)for(const n in e.on){const s=e.on[n];t.addEventListener(n,s,{passive:!0,capture:!1})}for(const n in e.attrs){const i=e.attrs[n];(0,a.isRBox)(i)&&(s||=(0,o.getBinder)(t)).watch(i,(e=>{null==e?t.removeAttribute(n):t.setAttribute(n,e+"")}));const r=(0,a.unbox)(i);null!=i&&t.setAttribute(n,r+"")}if(n){const e=e=>{const n=e.filter((t=>!!t));!function(t,e){for(let n=0;n<e.length;n++){const s=e[n],o=t.childNodes[n];o!==s&&(o?t.insertBefore(s,o):t.appendChild(s))}for(;t.childNodes[e.length];)t.childNodes[e.length].remove()}(t,n)};(0,a.isRBox)(n)&&(s||=(0,o.getBinder)(t)).watch(n,(t=>{e(t)})),e((0,a.unbox)(n))}return e.class&&(s=(0,i.makeClassname)(s,t,e.class,(e=>t.classList.value=e))||s),s}function c(t,e){const[n,s]=r(t,e),i=document.createElement(n.tagName||"div");let c=l(i,n,s);if(n.style)for(const t in n.style){const e=n.style[t];(0,a.isRBox)(e)&&(c||=(0,o.getBinder)(i)).watch(e,(e=>{i.style[t]=e+""})),i.style[t]=(0,a.unbox)(n.style[t])+""}return i}function u(t,e){const[n,s]=r(t,e),o=document.createElementNS("http://www.w3.org/2000/svg",n.tagName||"g");return"svg"===n.tagName&&o.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),l(o,n,s),o}})),e.register("jM5hi",(function(n,s){t(n.exports,"makeClassname",(()=>i));var o=e("hIDiW"),a=e("hsvBG");function i(t,e,n,s){const i=Array.isArray(n)?n:[n];for(const n of i)if((0,a.isRBox)(n))(t||=(0,o.getBinder)(e)).watch(n,r);else if(n&&"object"==typeof n)for(const s in n){const i=n[s];(0,a.isRBox)(i)&&(t||=(0,o.getBinder)(e)).watch(i,r)}function r(){const t=[];for(const e of i)if(e&&"object"==typeof e)for(const n in e)(0,a.unbox)(e[n])&&t.push(n);else{const n=(0,a.unbox)(e);n&&t.push(n)}s(t.join(" "))}return r(),t}})),e.register("g0JTA",(function(e,n){var s,o,a,i,r,l;t(e.exports,"timer",(()=>s),(t=>s=t)),t(e.exports,"speedBlock",(()=>o),(t=>o=t)),t(e.exports,"button",(()=>a),(t=>a=t)),t(e.exports,"timerRoot",(()=>i),(t=>i=t)),t(e.exports,"wrap",(()=>r),(t=>r=t)),t(e.exports,"speedInput",(()=>l),(t=>l=t)),s="yzQbgG_timer",o="yzQbgG_speedBlock",a="yzQbgG_button",i="yzQbgG_timerRoot",r="yzQbgG_wrap",l="yzQbgG_speedInput"}));
//# sourceMappingURL=timer.18ca05d7.js.map
