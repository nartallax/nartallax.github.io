function t(t){return t&&t.__esModule?t.default:t}function e(t,e,n,s){Object.defineProperty(t,e,{get:n,set:s,enumerable:!0,configurable:!0})}var n=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequirebf86;n.register("jfwrQ",(function(s,i){e(s.exports,"main",(()=>m));var o=n("Z93qb"),r=(n("aCiCs"),n("euaFP")),a=(n("gc7tN"),n("hsvBG"),n("ilwiq")),l=n("iO5IN"),h=n("6eZYS"),c=n("hIDiW"),u=(n("jM5hi"),n("aCP3q"));a=n("ilwiq"),l=n("iO5IN"),u=n("aCP3q"),o=n("Z93qb"),c=n("hIDiW"),h=n("6eZYS"),r=n("euaFP");let d=null,g=null;async function f(e){const n=e.getBoundingClientRect();e.classList.add(o.root??""),d&&(d.remove(),d=null),d=(0,u.tag)({tagName:"img",attrs:{src:t(h)},class:o.initialImage}),n.width/n.height>1920/1080?d.style.maxWidth="100vw":d.style.maxHeight="100vh",e.appendChild(d),await(0,l.waitDOMEvent)(d,"load");let s=!1;const i=d.getBoundingClientRect(),r=i.width/n.width,c=i.height/n.height,f=new a.Scene,m=new a.OrthographicCamera(-.5/r,.5/r,-.5/c,.5/c,.1,1e3);m.position.z=2,m.position.x=m.position.y=0,m.lookAt(0,0,0),m.rotateZ(Math.PI);const p=i.height/100>8?100:25,v=Math.ceil(i.height/p),x=Math.ceil(i.width/p),b=new a.WebGLRenderer;b.setSize(n.width,n.height);const y=new a.TextureLoader,C=await y.loadAsync(d.src),B=new a.MeshBasicMaterial({map:C});async function P(){if(!s){s=!0;try{const t=new w(v,x,f,B,m,(()=>b.render(f,m)));await t.run()}finally{s=!1}}}g&&(g.remove(),g=null),g=b.domElement,g.classList.add(o.squaremixCanvas??""),d.after(g),g.addEventListener("click",P),d.remove(),P()}function m(t){f(t),(0,c.getBinder)(t).onResize((0,r.debounce)(250,(()=>f(t))))}class w{constructor(t,e,n,s,i,o){this.columnsCount=t,this.rowsCount=e,this.scene=n,this.material=s,this.camera=i,this.render=o,this.disposeables=[],this.colHeights=this.generateColumnHeights(t,e),this.group=new a.Group,this.scene.add(this.group)}async run(){var t,e;this.generateObjects(),await(t=1/4,e=t=>{this.group.rotation.y=Math.PI/2*(1-t+2),this.camera.rotation.z=Math.PI/2*(t+2),this.render()},new Promise(((n,s)=>{let i=0,o=Date.now();const r=()=>{const a=Date.now();try{e(Math.min(1,i))}catch(t){return void s(t)}i<1?requestAnimationFrame(r):n(),i+=t*((a-o)/1e3),o=a};r()}))),this.dispose()}generateColumnHeights(t,e){const n=new Array(t);for(let s=0;s<t;s++){const i=n[s]=new Array(e);for(let n=0;n<e;n++){let e=t-s+3*(2*Math.random()-1);e=Math.min(1,Math.max(0,Math.round(e)/t)),i[n]=e}}return n}generateObjects(){for(let t=0;t<this.colHeights.length;t++)for(let e=0;e<this.colHeights[t].length;e++)this.generateColumnObject(t,e,this.colHeights[t][e]);const t=this.makeAddSlicePlane(0,1,0,1);t.translateX(-.5),t.translateY(-.5),t.translateZ(-.5),t.rotateY(-Math.PI/2)}generateColumnObject(t,e,n){this.addTopPlane(t,e,n),this.addSidePlane(t,e,n)}addSidePlane(t,e,n){if(0===n)return;const s=this.makeAddSlicePlane(1-n,1,e/this.rowsCount,(e+1)/this.rowsCount);s.rotateY(-Math.PI/2),s.translateX(.5-n),s.translateY(e/this.rowsCount-.5),s.translateZ(-(t+1)/this.columnsCount+.5)}addTopPlane(t,e,n){const s=this.makeAddSlicePlane(t/this.columnsCount,(t+1)/this.columnsCount,e/this.rowsCount,(e+1)/this.rowsCount,!0);s.translateX(t/this.columnsCount-.5),s.translateY(e/this.rowsCount-.5),s.translateZ(.5-n)}makeAddSlicePlane(t,e,n,s,i=!1){const o=new a.PlaneGeometry;this.disposeables.push(o);const r=new a.Mesh(o,this.material),l=o.attributes.uv;if(i){const i=1-n,o=1-s,r=t,a=e;for(let t=0;t<l.count;t++)0===l.getX(t)?0===l.getY(t)?l.setXY(t,i,r):l.setXY(t,o,r):0===l.getY(t)?l.setXY(t,i,a):l.setXY(t,o,a)}else for(let i=0;i<l.count;i++)l.setX(i,0===l.getX(i)?t:e),l.setY(i,0===l.getY(i)?n:s);l.needsUpdate=!0;const h=e-t,c=s-n,u=o.attributes.position;for(let t=0;t<u.count;t++)u.setX(t,u.getX(t)<0?0:h),u.setY(t,u.getY(t)<0?0:c);return u.needsUpdate=!0,this.group.add(r),r}dispose(){this.disposeables.forEach((t=>t.dispose())),this.disposeables.length=0,this.scene.remove(this.group)}}})),n.register("Z93qb",(function(t,n){var s,i,o;e(t.exports,"root",(()=>s),(t=>s=t)),e(t.exports,"initialImage",(()=>i),(t=>i=t)),e(t.exports,"squaremixCanvas",(()=>o),(t=>o=t)),s="imgXfq_root",i="imgXfq_initialImage",o="imgXfq_squaremixCanvas"})),n.register("27Lyk",(function(t,n){var s,i;e(t.exports,"register",(()=>s),(t=>s=t)),e(t.exports,"resolve",(()=>i),(t=>i=t));var o={};s=function(t){for(var e=Object.keys(t),n=0;n<e.length;n++)o[e[n]]=t[e[n]]},i=function(t){var e=o[t];if(null==e)throw new Error("Could not resolve bundle with id "+t);return e}})),n.register("euaFP",(function(t,n){function s(t,e){let n=null;return()=>{n||(n=setTimeout((()=>{n=null,e()}),t))}}e(t.exports,"debounce",(()=>s))})),n.register("iO5IN",(function(t,n){function s(t,e){return new Promise(((n,s)=>{t.addEventListener("error",(t=>s(new Error(t.message)))),t.addEventListener(e,(t=>n(t)))}))}e(t.exports,"waitDOMEvent",(()=>s))})),n.register("6eZYS",(function(t,e){t.exports=new URL(n("27Lyk").resolve("6fzAl"),import.meta.url).toString()})),n.register("jM5hi",(function(t,n){function s(t,e,n,s){const i=Array.isArray(n)?n:[n];for(const n of i)if((0,$hsvBG.isRBox)(n))(t||=(0,$hIDiW.getBinder)(e)).watch(n,o);else if(n&&"object"==typeof n)for(const s in n){const i=n[s];(0,$hsvBG.isRBox)(i)&&(t||=(0,$hIDiW.getBinder)(e)).watch(i,o)}function o(){const t=[];for(const e of i)if(e&&"object"==typeof e)for(const n in e)(0,$hsvBG.unbox)(e[n])&&t.push(n);else{const n=(0,$hsvBG.unbox)(e);n&&t.push(n)}s(t.join(" "))}return o(),t}e(t.exports,"makeClassname",(()=>s))})),n.register("aCP3q",(function(t,n){function s(t,e){return t?Array.isArray(t)||(0,$hsvBG.isRBox)(t)?[{},t]:[t,e]:[{},e]}function i(t,e,n){let s=null;if(e.text){const n=e.text;(0,$hsvBG.isRBox)(n)&&(s||=(0,$hIDiW.getBinder)(t)).watch(n,(e=>{t.textContent=e+""})),t.textContent=(0,$hsvBG.unbox)(n)+""}if(e.on)for(const n in e.on){const s=e.on[n];t.addEventListener(n,s,{passive:!0,capture:!1})}for(const n in e.attrs){const i=e.attrs[n];(0,$hsvBG.isRBox)(i)&&(s||=(0,$hIDiW.getBinder)(t)).watch(i,(e=>{null==e?t.removeAttribute(n):t.setAttribute(n,e+"")}));const o=(0,$hsvBG.unbox)(i);null!=i&&t.setAttribute(n,o+"")}if(n){const e=e=>{const n=e.filter((t=>!!t));!function(t,e){for(let n=0;n<e.length;n++){const s=e[n],i=t.childNodes[n];i!==s&&(i?t.insertBefore(s,i):t.appendChild(s))}for(;t.childNodes[e.length];)t.childNodes[e.length].remove()}(t,n)};(0,$hsvBG.isRBox)(n)&&(s||=(0,$hIDiW.getBinder)(t)).watch(n,(t=>{e(t)})),e((0,$hsvBG.unbox)(n))}return e.class&&(s=(0,$jM5hi.makeClassname)(s,t,e.class,(e=>t.classList.value=e))||s),s}function o(t,e){const[n,o]=s(t,e),r=document.createElement(n.tagName||"div");let a=i(r,n,o);if(n.style)for(const t in n.style){const e=n.style[t];(0,$hsvBG.isRBox)(e)&&(a||=(0,$hIDiW.getBinder)(r)).watch(e,(e=>{r.style[t]=e+""})),r.style[t]=(0,$hsvBG.unbox)(n.style[t])+""}return r}function r(t,e){const[n,o]=s(t,e),r=document.createElementNS("http://www.w3.org/2000/svg",n.tagName||"g");return"svg"===n.tagName&&r.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),i(r,n,o),r}e(t.exports,"tag",(()=>o)),e(t.exports,"svgTag",(()=>r))}));
//# sourceMappingURL=squaremix_3d.263471f8.js.map
