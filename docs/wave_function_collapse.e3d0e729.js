function t(t,e,n,o){Object.defineProperty(t,e,{get:n,set:o,enumerable:!0,configurable:!0})}var e=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequirebf86;e.register("aADgs",(function(n,o){t(n.exports,"main",(()=>u));var r=e("8HcCf"),s=e("aCP3q"),i=e("jVGbq"),l=e("ffFvw"),a=e("1OdCr"),c=e("9sNwz");const h=[[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,16754689,16754689,16754689,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,16754689,16754689,16754689,16754689,16754689,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,16754689,16754689,16771843,16771843,16771843,16754689,16754689,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,16754689,16771843,16771843,14817887,16771843,16771843,16754689,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,16754689,16754689,16771843,16771843,16771843,16771843,16754689,16754689,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,16754689,16771843,16771843,14817887,16771843,16754689,16754689,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,16754689,16754689,16771843,16771843,16754689,16754689,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,16754689,16754689,16754689,16754689,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,16754689,16754689,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776],[26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776,26776]];function u(t){const e=new(0,l.PatternInput)({palette:[5487617,16771843,16754689,16333341,14817887,5712994,10603731,26776],defaultValue:5487617,height:20,width:20,scale:10}),n=new(0,i.ColorArrayDisplay)(10);t.appendChild((0,s.tag)({class:c["wave-function-collapse-root"]},[(0,s.tag)([e.root,(0,s.tag)({tagName:"button",text:"Collapse!",on:{click:function(){const t=e.getPattern(),o=(0,a.waveFunctionCollapse)({flip:!0,rotate:!0,sourceSample:t,patternSize:3,randomSeed:12345,resultSize:{width:50,height:50}});n.draw(o),r.performeter.print(),r.performeter.reset()}}})]),n.root]));for(let t=0;t<h.length;t++){const n=h[t];for(let o=0;o<n.length;o++)e.set(t,o,n[o])}}})),e.register("8HcCf",(function(e,n){t(e.exports,"performeter",(()=>o));const o=new class{root=this.makeBlock(null);currentBlock=this.root;makeBlock(t){return{subblocks:{},parent:t,timeStart:-1,timeSum:0,enterCount:0}}enterBlock(t){let e=this.currentBlock.subblocks[t];e||(e=this.makeBlock(this.currentBlock),this.currentBlock.subblocks[t]=e),e.timeStart=performance.now(),e.enterCount++,this.currentBlock=e}exitBlock(){this.currentBlock.timeSum+=performance.now()-this.currentBlock.timeStart;const t=this.currentBlock.parent;if(!t)throw new Error("No parent! Blocks are all messed up.");this.currentBlock=t}exitEnterBlock(t){this.exitBlock(),this.enterBlock(t)}print(){const t={};let e=0;for(const t in this.root.subblocks)e+=this.root.subblocks[t].timeSum;this.forEachBlock(((n,o,s)=>{o=new Array(s+1).join("-")+o,t[o]={"parent %":r(n.timeSum/n.parent.timeSum*100),"full %":r(n.timeSum/e*100),"ms per enter":r(n.timeSum/n.enterCount)}})),console.table(t)}reset(){this.root=this.makeBlock(null),this.currentBlock=this.root}forEachBlock(t,e=this.root,n=0){for(const o in e.subblocks){const r=e.subblocks[o];t(r,o,n),this.forEachBlock(t,r,n+1)}}};function r(t){return Math.round(100*t)/100}})),e.register("aCP3q",(function(n,o){t(n.exports,"tag",(()=>c)),t(n.exports,"svgTag",(()=>h));var r=e("hIDiW"),s=e("hsvBG"),i=e("jM5hi");function l(t,e){return t?Array.isArray(t)||(0,s.isRBox)(t)?[{},t]:[t,e]:[{},e]}function a(t,e,n){let o=null;if(e.text){const n=e.text;(0,s.isRBox)(n)&&(o||=(0,r.getBinder)(t)).watch(n,(e=>{t.textContent=e+""})),t.textContent=(0,s.unbox)(n)+""}if(e.on)for(const n in e.on){const o=e.on[n];t.addEventListener(n,o,{passive:!0,capture:!1})}for(const n in e.attrs){const i=e.attrs[n];(0,s.isRBox)(i)&&(o||=(0,r.getBinder)(t)).watch(i,(e=>{null==e?t.removeAttribute(n):t.setAttribute(n,e+"")}));const l=(0,s.unbox)(i);null!=i&&t.setAttribute(n,l+"")}if(n){const e=e=>{const n=e.filter((t=>!!t));!function(t,e){for(let n=0;n<e.length;n++){const o=e[n],r=t.childNodes[n];r!==o&&(r?t.insertBefore(o,r):t.appendChild(o))}for(;t.childNodes[e.length];)t.childNodes[e.length].remove()}(t,n)};(0,s.isRBox)(n)&&(o||=(0,r.getBinder)(t)).watch(n,(t=>{e(t)})),e((0,s.unbox)(n))}return e.class&&(o=(0,i.makeClassname)(o,t,e.class,(e=>t.classList.value=e))||o),o}function c(t,e){const[n,o]=l(t,e),i=document.createElement(n.tagName||"div");let c=a(i,n,o);if(n.style)for(const t in n.style){const e=n.style[t];(0,s.isRBox)(e)&&(c||=(0,r.getBinder)(i)).watch(e,(e=>{i.style[t]=e+""})),i.style[t]=(0,s.unbox)(n.style[t])+""}return i}function h(t,e){const[n,o]=l(t,e),r=document.createElementNS("http://www.w3.org/2000/svg",n.tagName||"g");return"svg"===n.tagName&&r.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),a(r,n,o),r}})),e.register("jM5hi",(function(n,o){t(n.exports,"makeClassname",(()=>i));var r=e("hIDiW"),s=e("hsvBG");function i(t,e,n,o){const i=Array.isArray(n)?n:[n];for(const n of i)if((0,s.isRBox)(n))(t||=(0,r.getBinder)(e)).watch(n,l);else if(n&&"object"==typeof n)for(const o in n){const i=n[o];(0,s.isRBox)(i)&&(t||=(0,r.getBinder)(e)).watch(i,l)}function l(){const t=[];for(const e of i)if(e&&"object"==typeof e)for(const n in e)(0,s.unbox)(e[n])&&t.push(n);else{const n=(0,s.unbox)(e);n&&t.push(n)}o(t.join(" "))}return l(),t}})),e.register("jVGbq",(function(n,o){t(n.exports,"ColorArrayDisplay",(()=>i));var r=e("efatB"),s=e("aCP3q");class i{constructor(t){this.scale=t;const e=(0,s.tag)({tagName:"canvas"});this.root=e;const n=e.getContext("2d");if(!n)throw new Error("No context");this.context=n}draw(t){const e=t.length*this.scale,n=t[0].length*this.scale;this.root.setAttribute("width",e+""),this.root.setAttribute("height",n+""),this.root.style.width=e+"px",this.root.style.height=n+"px";const o=this.scale;for(let e=0;e<t.length;e++){const n=t[e];for(let t=0;t<n.length;t++)this.context.fillStyle=(0,r.rgbNumberToColorString)(n[t]),this.context.fillRect(e*o,t*o,o,o)}}}})),e.register("efatB",(function(e,n){function o(t){return(t>15?"":"0")+t.toString(16)}function r(t){const e=255&t,n=255&(t>>=8);return"#"+o(255&(t>>=8))+o(n)+o(e)}t(e.exports,"rgbNumberToColorString",(()=>r))})),e.register("ffFvw",(function(n,o){t(n.exports,"PatternInput",(()=>c));var r=e("efatB"),s=e("ih12A"),i=e("aCP3q"),l=e("jVGbq"),a=e("9sNwz");class c{constructor(t){this.params=t,this.primaryCb=null,this.display=new(0,l.ColorArrayDisplay)(t.scale),(0,s.preventContextMenu)(this.display.root),(0,s.addCursorMoveHandler)({element:this.display.root,onMove:this.onSetColorAction.bind(this),downIsMove:!0}),this.pattern=new Array(t.width).fill(null).map((()=>new Array(t.height).fill(t.defaultValue)));const e=t.palette.map((t=>{const e=(0,i.tag)({class:a["pattern-input-palette-item"],on:{click:()=>{this.primaryCb=this.selectColor(this.primaryCb,e,t)}},style:{backgroundColor:(0,r.rgbNumberToColorString)(t)}});return(0,s.preventContextMenu)(e),t===this.params.defaultValue&&(this.primaryCb=this.selectColor(null,e,t,a["selected-primary"])),e}));this.root=(0,i.tag)({class:a["pattern-input-wrap"]},[this.display.root,(0,i.tag)({class:a["pattern-input-palette-wrap"]},e)]),this.redrawCanvas()}redrawCanvas(){this.display.draw(this.pattern)}onSetColorAction(t){const e=(0,s.pointerEventsToOffsetCoords)(t);if(!e)return;const n=Math.floor(e.x/this.params.scale),o=Math.floor(e.y/this.params.scale),r=this.pattern[n];if(r&&r.length>o){const t=this.primaryCb;t&&this.set(n,o,t.color)}}set(t,e,n){this.pattern[t][e]=n,this.redrawCanvas()}selectColor(t,e,n,o="selected"){const r=t?.className??o;t&&t.button.classList.remove(r);const s={button:e,color:n,className:r};return e.classList.add(r),s}getPattern(){return JSON.parse(JSON.stringify(this.pattern))}}})),e.register("ih12A",(function(e,n){function o(t){if(!(t.target instanceof HTMLElement))return null;const e=t.target.getBoundingClientRect(),n=function(t){if(function(t){return!!t.touches}(t)){const e=t.touches[0];return{x:e.clientX,y:e.clientY}}return{x:t.clientX,y:t.clientY}}(t);return n.x-=e.left,n.y-=e.top,n}function r(t){const e=e=>{t.element.addEventListener("mousemove",t.onMove,{passive:!0}),t.element.addEventListener("touchmove",t.onMove,{passive:!0}),window.addEventListener("mouseup",n,{passive:!0}),window.addEventListener("touchend",n,{passive:!0}),t.downIsMove&&t.onMove(e)},n=e=>{t.element.removeEventListener("mousemove",t.onMove),t.element.removeEventListener("touchmove",t.onMove),window.removeEventListener("mouseup",n),window.removeEventListener("touchend",n),t.upIsMove&&t.onMove(e)};t.element.addEventListener("mousedown",e,{passive:!0}),t.element.addEventListener("touchstart",e,{passive:!0})}function s(t){t.addEventListener("contextmenu",(t=>(t.preventDefault(),t.stopPropagation(),!1)))}t(e.exports,"pointerEventsToOffsetCoords",(()=>o)),t(e.exports,"addCursorMoveHandler",(()=>r)),t(e.exports,"preventContextMenu",(()=>s))})),e.register("9sNwz",(function(e,n){var o,r,s,i,l;t(e.exports,"wave-function-collapse-root",(()=>o),(t=>o=t)),t(e.exports,"pattern-input-palette-item",(()=>r),(t=>r=t)),t(e.exports,"pattern-input-wrap",(()=>s),(t=>s=t)),t(e.exports,"selected-primary",(()=>i),(t=>i=t)),t(e.exports,"pattern-input-palette-wrap",(()=>l),(t=>l=t)),o="AWfyiW_wave-function-collapse-root",r="AWfyiW_pattern-input-palette-item",s="AWfyiW_pattern-input-wrap",i="AWfyiW_selected-primary",l="AWfyiW_pattern-input-palette-wrap"})),e.register("1OdCr",(function(n,o){t(n.exports,"waveFunctionCollapse",(()=>i));var r=e("1VHh9"),s=e("8HcCf");function i(t){s.performeter.enterBlock("init stage");const{patterns:e,matrix:n}=function(t){const e=function(t){const e=[];for(let n=1-t;n<t;n++)for(let o=1-t;o<t;o++)0===n&&0===o||e.push({x:n,y:o});return e}(t.patternSize),[n,o]=function(t){let e=function(t){let e=[];for(let n=0;n<t.sourceSample.length-t.patternSize+1;n++){const o=t.sourceSample[n];for(let r=0;r<o.length-t.patternSize+1;r++)e.push(d(t.sourceSample,n,r,t.patternSize))}if(t.flip){const t=[];for(const n of["x","y"])for(const o of e)t.push(w(o,n));e=[...e,...t]}if(t.rotate){const t=[];for(const n of[1,2,3])for(const o of e)t.push(x(o,n));e=[...e,...t]}return e}(t);const n=new Map,o=new p(t.sourceSample);for(const t of e){const e=o.hash(t);let r=n.get(e);r||(r=[],n.set(e,r)),r.push(t)}const r=new Map;for(const t of n.values())for(let e=0;e<t.length;e++){const n=t[e];if(!n)continue;let o=0;for(let e=0;e<t.length;e++){const r=t[e];r&&(f(n,r)&&(t[e]=null),o++)}r.set(n,o)}e=[...r.keys()];const s=[];for(const t of e)s.push(r.get(t));return[e,u(s)]}(t),r=function(t,e){const n=new Array(t.length).fill(null).map((()=>new Map(e.map((t=>[c(t),[]])))));for(const o of e){const e=c(o),r=c(a(o));for(let s=0;s<t.length;s++){const i=t[s];for(let a=s;a<t.length;a++){l(i,t[a],o)&&(n[s].get(e).push(a),n[a].get(r).push(s))}}}return n}(n,e),s=function(t){const e=(n=2654435769,o=608135816,r=3084996962,s=t^=3735928559,function(){let t=(n>>>=0)+(o>>>=0)|0;return n=o^o>>>9,o=(r>>>=0)+(r<<3)|0,t=t+(s=1+(s>>>=0)|0)|0,r=(r=r<<21|r>>>11)+t|0,(t>>>0)/4294967296});var n,o,r,s;for(let t=0;t<15;t++)e();return e}(t.randomSeed),i=new y(t.resultSize.width,t.resultSize.height,n.length,s,r,e,o);return{offsets:e,patterns:n,patternsFreq:o,rules:r,matrix:i,random:s}}(t);for(s.performeter.exitEnterBlock("collapse stage");!n.isEverythingCollapsed();){const t=n.findMinEntropyCell();if(!t)throw new Error("No lowest entropy point!");n.collapse(t)}const o=n.getResults();return s.performeter.exitBlock(),o.map((t=>t.map((t=>e[t][0][0]))))}function l(t,e,n){const o=t.length,r=o-Math.abs(n.x),s=o-Math.abs(n.y),i=Math.min(Math.max(n.x,0),o-r),l=Math.min(Math.max(n.y,0),o-s),a=Math.min(Math.max(-n.x,0),o-r),c=Math.min(Math.max(-n.y,0),o-s);for(let n=0;n<r;n++)for(let o=0;o<s;o++)if(t[i+n][l+o]!==e[a+n][c+o])return!1;return!0}function a(t){return{x:-t.x,y:-t.y}}function c(t){return Math.abs(t.x)<<18|Math.abs(t.y)<<2|(t.y<0?1:0)|(t.x<0?2:0)}function h(t){return t.x<<16|t.y}function u(t){const e=t.reduce(((t,e)=>t+e),0);return t.map((t=>t/e))}function f(t,e){for(let n=0;n<t.length;n++){const o=t[n],r=e[n];for(let t=0;t<o.length;t++)if(o[t]!==r[t])return!1}return!0}class p{valueIndices=new Map;constructor(t){const e=[...new Set(g(t))];for(let t=0;t<e.length;t++)this.valueIndices.set(e[t],t)}hash(t){let e=0;for(let n=0;n<t.length;n++){const o=t[n];for(let t=0;t<o.length;t++){const r=o[t];e=(e<<5)-e+this.valueIndices.get(r)*n*t|0}}return e}}function g(t){const e=[];for(const n of t)e.push(...n);return e}function d(t,e,n,o){const r=[];for(let s=0;s<o;s++){const i=t[e+s];r.push(i.slice(n,n+o))}return r}function m(t){const e=[];for(let n=0;n<t.length;n++)e.push([...t[n]]);return e}function w(t,e){const n=m(t),o=Math.floor(t.length/2);if("x"===e)for(let t=0;t<o;t++){const e=n[t],o=n[n.length-t-1];for(let t=0;t<e.length;t++){const n=e[t];e[t]=o[t],o[t]=n}}else for(let e=0;e<t.length;e++){const t=n[e];for(let e=0;e<o;e++){const n=t[e];t[e]=t[t.length-e-1],t[t.length-e-1]=n}}return n}function x(t,e){const n=m(t),o=t.length,r=Math.floor(o/2);for(let t=0;t<e;t++)for(let t=0;t<r;t++){const e=o-t-1;for(let r=t;r<o-t-1;r++){const s=n[r][t];n[r][t]=n[e][r],n[e][r]=n[o-r-1][e],n[o-r-1][e]=n[t][o-r-1],n[t][o-r-1]=s}}return n}class y{constructor(t,e,n,o,s,i,l){this.width=t,this.height=e,this.random=o,this.rules=s,this.offsets=i,this.freqs=l,this.patternCount=8*Math.ceil(n/8),this.entropy=new Array(t*e).fill(1),this.matrix=new(0,r.Bitmap)(t*e*this.patternCount),this.collapseMask=new(0,r.Bitmap)(t*e),this.incollapsedCellsCount=t*e,this.matrix.setAll();const a=this.patternCount-n;for(let n=0;n<t*e;n++){const t=(n+1)*this.patternCount-1;for(let e=0;e<a;e++)this.matrix.clear(t-e)}}isEverythingCollapsed(){return 0===this.incollapsedCellsCount}findMinEntropyCell(){let t=Number.MAX_SAFE_INTEGER;const e=[];for(let n=0;n<this.entropy.length;n++){if(this.collapseMask.get(n))continue;const o=this.entropy[n];o<t&&(e.length=0,t=o),o===t&&e.push(n)}if(0===e.length)return null;const n=1===e.length?e[0]:e[Math.floor(this.random()*e.length)];return{x:n%this.width,y:Math.floor(n/this.width)}}collapse(t){const e=t.y*this.width+t.x,n=this.matrix.getOffsetsAsNumbers(e*this.patternCount,this.patternCount);if(0===n.length)throw new Error(`Cell at (${t.x}, ${t.y}) don't have available values`);if(this.collapseMask.set(e),this.incollapsedCellsCount--,1===n.length)return;const o=n[Math.floor(this.random()*n.length)];for(const t of n)t!==o&&this.matrix.clear(e*this.patternCount+t);this.entropy[e]=0,this.propagateStartingAt(t)}isInBounds(t){return t.x>=0&&t.y>=0&&t.x<this.width&&t.y<this.height}propagateStartingAt(t){const e=new v;for(e.enqueue(h(t));;){const t=e.dequeue();if(null==t)break;const o={x:(n=t)>>16&65535,y:65535&n};for(const t of this.offsets){const n={x:o.x+t.x,y:o.y+t.y};if(!this.isInBounds(n))continue;const r=n.y*this.width+n.x;if(this.collapseMask.get(r))continue;this.propagateToCellByOffset(o,t)&&e.enqueue(h(n))}}var n}propagateToCellByOffset(t,e){const n=c(e),o=t.y*this.width+t.x,s=this.matrix.getOffsetsAsNumbers(o*this.patternCount,this.patternCount),i=new(0,r.Bitmap)(this.patternCount);for(const t of s){const e=this.rules[t].get(n);for(const t of e)i.set(t)}const l=t.x+e.x,a=(t.y+e.y)*this.width+l,h=this.matrix.and(i,a*this.patternCount);return h&&(this.entropy[a]=this.matrix.getOffsetsAsNumbers(a*this.patternCount,this.patternCount).map((t=>this.freqs[t])).reduce(((t,e)=>t+e),0)),h}getResults(){const t=[];for(let e=0;e<this.width;e++){const n=[];t.push(n);for(let t=0;t<this.height;t++){const o=t*this.width+e,r=this.matrix.getOffsetsAsNumbers(o*this.patternCount,this.patternCount);n.push(r[0])}}return t}toString(){let t=0;const e=[];for(let n=0;n<this.height;n++){const o=[];e.push(o);for(let e=0;e<this.width;e++){const r=n*this.width+e,s=this.matrix.getOffsetsAsNumbers(r*this.patternCount,this.patternCount),i=function(t,e){const n=[];if(0===t.length)return n;let o=[t[0]];n.push(o);for(let r=1;r<t.length;r++){const s=t[r];e(o[o.length-1],s)?o.push(s):(o=[s],n.push(o))}return n}(s,((t,e)=>t+1===e)).map((t=>{const e=t[0],n=t[t.length-1];return e===n?e+"":e+1===n?e+","+n:e+"-"+n})).join(",");o.push(i),t=Math.max(t,i.length)}}return e.map((e=>e.map((e=>function(t,e){for(;t.length<e;)t+=" ";return t}(e,t))).join(" | "))).join("\n")}}class v{set=new Set;queue=[];pos=0;enqueue(t){return!this.set.has(t)&&(this.set.add(t),this.queue.push(t),!0)}dequeue(){const t=this.queue[this.pos];return this.queue[this.pos]=null,this.queue.length>this.pos&&(this.set.delete(t),this.pos++),t}}})),e.register("1VHh9",(function(e,n){t(e.exports,"Bitmap",(()=>o));class o{constructor(t){if(this.size=t,t<0)throw new Error(`Expected non-negative as size, got ${t}`);t%8&&(t=8*Math.ceil(t/8)),this.arr=new Uint8Array(t>>3)}set(t){const e=this.arr,n=t>>3;e[n]=e[n]|1<<(7&t)}clear(t){const e=this.arr,n=t>>3;e[n]=e[n]&~(1<<(7&t))}get(t){return 0!=(this.arr[t>>3]&1<<(7&t))}setAll(){this.arr.fill(255)}clearAll(){this.arr.fill(0)}getOffsetsAsNumbers(t,e){if(7&t||7&e)throw new Error("Assertion failed, only byte-aligned start/length is supported");const n=[];let o=0;for(let r=0;r<e>>3;r++){const e=this.arr[(t>>3)+r];let s=1;for(;256!==s;)e&s&&n.push(o),o++,s<<=1}return n}setOffsetsByNumbers(t,e,n){if(7&t||7&e)throw new Error("Assertion failed, only byte-aligned start/length is supported");let o=!1,r=0,s=0,i=n[s];for(let l=0;l<e>>3;l++){const e=this.arr[(t>>3)+l];let a=0,c=1;for(;256!==c;){const t=r===i?c:0;o=o||(e&c)!==t,t&&(a|=c,s++,i=n[s]),r++,c<<=1}this.arr[(t>>3)+l]=a}return o}and(t,e){if(7&e)throw new Error("Assertion failed, only byte-aligned start/length is supported");let n=!1;for(let o=0;o<t.arr.length;o++){const r=this.arr[(e>>3)+o],s=r&t.arr[o];n=n||s!==r,this.arr[(e>>3)+o]=s}return n}}}));
//# sourceMappingURL=wave_function_collapse.e3d0e729.js.map
