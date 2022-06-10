(function imploderLoader(e,r,n){'use strict';function handleError(e,n){var t=r.errorHandler;throw t?t(e,n):console.error((n?'Error during '+n+': ':'')+(e.stack||e.message||e)),e}function requireAny(e,r,n){if(!r){var o=e;return o in i?getProduct(o):t(o)}try{var a=Array.isArray(e)?e:[e],u=[],l={},f=a.filter(function(e,r){return l[e]=r,!(e in i)||(u[r]=getProduct(e),!1)});if(0===f.length)return r.apply(null,u);if(c)return t(f,function(e){for(var n=0;n<f.length;n++)u[l[f[n]]]=e[n];r.apply(null,u)},n);f.forEach(function(e){return u[l[e]]=t(e)}),r.apply(null,u)}catch(e){(function(e){n?n(e):handleError(e)})(e)}}function getProduct(e){e=o[e]||e;var r=i[e];if(!(e in p)){e in d&&function throwCircularDependencyError(e){if(1===s.length&&s[0]===e)throw new Error('Module imports itself: '+e+'. It\'s not clear what exactly do you want.');for(var r=e,n=s.length-1;n>=0;n--){var t=s[n];if(r+=' <- '+s[n],t===e)break}throw new Error('Unresolvable circular dependency detected: '+r)}(e),d[e]=!0,s.push(e);try{var t={},a=[t,requireAny];r.dependencies.forEach(function(e){e in o&&(e=o[e]);var r=p[e];if(r)a.push(r);else{var n=i[e];if(!n)throw new Error('Failed to get module "'+e+'": no definition is known and no preloaded external module is present.');a.push(n.arbitraryType||!n.exports&&!n.exportRefs?getProduct(e):function getProxy(e){if(!(e.name in y)){var r={};getAllExportNames(e).forEach(function(n){n.forEach(function(n){(function defineProxyProp(e,r,n){r.hasOwnProperty(n)||Object.defineProperty(r,n,{get:function(){return getProduct(e.name)[n]},set:function(r){return getProduct(e.name)[n]=r},enumerable:!0})})(e,r,n)})}),y[e.name]=r}return y[e.name]}(n))}});var u=r.code;r.nonModule&&(u='function(){'+u+'}'),u='\'use strict\';('+u+')\n//# sourceURL='+r.name;var l=n(u).apply(null,a);r.arbitraryType&&(t=l),p[e]=t}finally{delete d[e],s.pop()}}return p[e]}function getAllExportNames(e,r,n){return void 0===r&&(r=[]),void 0===n&&(n=!1),e.exports&&(n?r.push(e.exports.filter(function(e){return'default'!==e})):r.push(e.exports)),e.exportRefs&&e.exportRefs.forEach(function(e){if(e in i)getAllExportNames(i[e],r,!0);else{if(!(e in p))throw new Error('External module '+e+' is not loaded at required time.');r.push(Object.keys(p[e]))}}),r}function discoverExternalModules(e){for(var r in void 0===e&&(e={}),i)i[r].dependencies.forEach(function(r){r in i||(e[r]=!0)});return Object.keys(e).sort()}function afterExternalsLoaded(){var e=getProduct(r.entryPoint.module);Object.keys(i).forEach(function(e){e in p||getProduct(e)});var n=null;if(r.entryPoint.function)try{e[r.entryPoint.function].apply(null,r.entryPointArgs||[])}catch(e){n=e}return n&&handleError(n),'object'==typeof module&&module.exports&&(module.exports=e),e}for(var t='undefined'!=typeof require?require:function(){throw new Error('External require() function is not defined! Could not load any external module.')},o={},i={},a=0;a<e.length;a++){var u=e[a],l='string'!=typeof u[2]?u[2]:void 0,f=l||{};f.name=u[0],f.code=u[u.length-1],l&&l.altName&&(o[l.altName]=f.name),f.dependencies=Array.isArray(u[1])?u[1]:[],i[f.name]=f}var c='function'==typeof define&&!!define.amd,d={},s=[],p={},y={};(function start(){if(c){var e=discoverExternalModules({require:!0});define(e,function(r){t=r;for(var n=e.length;n<arguments.length;n++)p[e[n]]=arguments[n];return afterExternalsLoaded()})}else{var r=discoverExternalModules();requireAny(r,function(){for(var e=0;e<arguments.length;e++)p[r[e]]=arguments[e];afterExternalsLoaded()})}})()})(

[["/common/css_utils","function(e){e.addCssToPage=function addCssToPage(e,t){var a;null===(a=document.querySelector('*[data-style-name=\"'.concat(e,'\"]')))||void 0===a||a.remove();var d=document.createElement('style');d.setAttribute('type','text/css'),d.setAttribute('data-style-name',e),d.appendChild(document.createTextNode(t)),document.head.appendChild(d)}}"],["/common/dom_utils",["tslib"],"function(t,e,r){function tag(t,e){var n,a,i,o=void 0;t?Array.isArray(t)?(i={},o=t):(i=t,o=e||void 0):(i={},o=e||void 0);var l=document.createElement(i.tagName||'div');for(var c in i){var u=i[c];switch(c){case'tagName':break;case'text':l.textContent=u+'';break;case'class':l.className=Array.isArray(u)?u.filter(function(t){return!!t}).join(' '):u+'';break;case'style':var v=u;for(var f in v)l.style[f]=v[f]+'';break;default:l.setAttribute(c,u+'')}}if(o)try{for(var s=r.__values(o),d=s.next();!d.done;d=s.next()){var m=d.value;m&&l.appendChild(m instanceof HTMLElement?m:tag(m))}}catch(t){n={error:t}}finally{try{d&&!d.done&&(a=s.return)&&a.call(s)}finally{if(n)throw n.error}}return l}t.tag=tag,t.toHtmlTag=function toHtmlTag(t){return t?t instanceof HTMLElement?t:tag(t):null},t.waitLoadEvent=function waitLoadEvent(t){return new Promise(function(e,r){t.addEventListener('error',function(t){return r(new Error(t.message))}),t.addEventListener('load',function(){return e()})})},t.waitUntil=function waitUntil(t,e,r){return void 0===e&&(e=5e3),void 0===r&&(r=50),new Promise(function(n,a){var i=0,check=function(){if(t())return clearInterval(o),void n();e>(i+=r)||(clearInterval(o),a(new Error('Failed to wait for checker '+t+': timeout.')))},o=setInterval(check,r);check()})}}"],["/common/sketch_description",["tslib"],"function(n,t,e){n.sketchDescription=function(){var n=window.sketchDescription;return e.__assign(e.__assign({},n),{date:new Date(n.date)})}()}"],["/common/sketch_info_button",["/common/css_utils","/common/dom_utils","/common/sketch_description","/common/website_common"],"function(n,t,e,o,i,a){function renderContentRefList(n,t,e){var i=(0,o.tag)({class:'sketch-info-line',text:''.concat(n[t],':')});return e.forEach(function(n){var e,a=n.description?n.description[t]:n.url||'???';(e=n.url?(0,o.tag)({tagName:'a',href:n.url,text:a}):(0,o.tag)({text:a})).className='sketch-info-subline',i.appendChild(e)}),i}var c={en:'Creation date',ru:'Дата создания'},r={en:'Tags',ru:'Теги'},d={en:'Inspired with',ru:'Вдохновлено'},s={en:'Used content',ru:'Использованный контент'},l={en:'Close',ru:'Закрыть'},td=function(n){return 10>n?'0'+n:''+n},formatDate=function(n){return''.concat(n.getFullYear(),'.').concat(td(n.getMonth()+1),'.').concat(td(n.getDate()))};n.makeSketchInfoButton=function makeSketchInfoButton(){(function doCss(){(0,e.addCssToPage)('sketch_info_button','\\n.sketch-info-button {\\n\\tborder-radius: 100%;\\n\\tborder: 3px solid #fff;\\n\\topacity: 0.75;\\n\\tposition: absolute;\\n\\ttop: 0.5rem;\\n\\tleft: 0.5rem;\\n\\tcursor: pointer;\\n\\ttransition: 0.25s;\\n\\twidth: 2rem;\\n    height: 2rem;\\n    text-align: center;\\n    font-weight: bold;\\n    font-size: 2rem;\\n    color: #fff;\\n}\\n\\n.sketch-info-button:hover {\\n\\topacity: 1;\\n}\\n\\n.sketch-info-block {\\n\\tposition: absolute;\\n\\ttop: 0;\\n\\tleft: 0;\\n\\tborder: 2px solid #ddd;\\n\\tbackground: #444;\\n\\tcolor: #ddd;\\n\\tpadding: 0.5em;\\n\\tfont-weight: normal;\\n    border-width: 0 2px 2px 0;\\n}\\n\\n.sketch-info-block a {\\n\\tcolor: #fff;\\n}\\n\\n.sketch-info-line {\\n}\\n\\n.sketch-info-subline {\\n\\tmargin-left: 0.5em;\\n\\tdisplay: block;\\n}\\n\\n')})();var n=(0,o.tag)({class:'sketch-info-button',text:'i'});return n.addEventListener('click',function(){var n=(0,o.tag)({class:'sketch-info-block'}),t=i.sketchDescription,e=a.defaultLangKey;n.appendChild((0,o.tag)({class:'sketch-info-line',text:t.name[e]})),n.appendChild((0,o.tag)({class:'sketch-info-line',text:t.description[e]})),n.appendChild((0,o.tag)({tagName:'hr'})),n.appendChild((0,o.tag)({class:'sketch-info-line',text:''.concat(c[e],': ').concat(formatDate(t.date))})),n.appendChild((0,o.tag)({class:'sketch-info-line',text:''.concat(r[e],': ').concat(t.tags.map(function(n){return n.name[e]}).join(', '))})),t.inspiration&&n.appendChild(renderContentRefList(d,e,t.inspiration)),t.usedContent&&n.appendChild(renderContentRefList(s,e,t.usedContent));var f=(0,o.tag)({tagName:'input',type:'button',value:l[e]});f.addEventListener('click',function(){return n.remove()}),n.appendChild((0,o.tag)({tagName:'hr'})),n.appendChild(f),document.body.appendChild(n)}),document.body.appendChild(n),n}}"],["/common/website_common","function(e){e.languageNames={en:{en:'English',ru:'Английский'},ru:{en:'Russian',ru:'Русский'}},e.languageKeys=new Set(Object.keys(e.languageNames)),e.defaultLangKey='en',e.tags={simulation:{name:{ru:'Симуляция',en:'Simulation'},description:{ru:'Воссоздание каких-либо явлений реального мира в упрощенном виде.',en:'Simplified recreation of real life physical effects.'}},art:{name:{ru:'Искусство',en:'Art'},description:{ru:'По моему определению, искусство - что-либо, созданное для того, чтобы вызывать эмоции у наблюдателя.',en:'By my definition art is something that is created with purpose of evoking emotions.'}},threejs:{name:{ru:'THREE.js',en:'THREE.js'},description:{ru:'Визуальная композиция с использованием THREE.js.',en:'Visual composition that uses THREE.js to render.'}},tool:{name:{ru:'Инструмент',en:'Tool'},description:{ru:'Штука, помогающая достичь каких-либо простых целей.',en:'A thing that helps achieving some simple goals.'}},css:{name:{ru:'CSS',en:'CSS'},description:{ru:'Продвинутые трюки с использованием преимущественно CSS.',en:'Advanced techniques of using CSS.'}},webgl:{name:{ru:'WebGL',en:'WebGL'},description:{ru:'Использование технологии WebGL.',en:'Usage of WebGL.'}},svg:{name:{ru:'SVG',en:'SVG'},description:{ru:'Использование технологии SVG.',en:'Usage of SVG.'}},evolution:{name:{ru:'Эволюция',en:'Evolution'},description:{ru:'Демонстрация эволюции.',en:'Demonstration of evolution.'}}}}"],["/timer/timer",["tslib","/common/css_utils","/common/dom_utils","/common/sketch_info_button"],"function(n,t,e,a,r,i){function formatTime(n){var t=n%1e3,e=(n=Math.floor(n/1e3))%60,a=(n=Math.floor(n/60))%60,r=Math.floor(n/60);return''.concat(twoDigis(r),':').concat(twoDigis(a),':').concat(twoDigis(e),'.').concat(function(n){return 10>n?'00'+n:100>n?'0'+n:''+n}(t))}function intOrZero(n){var t=parseInt(n);return Number.isNaN(t)||!Number.isFinite(t)?0:t}function parseTime(n){var t=n.split(':'),a=0;if(t.length>0){var r=t[t.length-1].split('.');if(2===r.length){var i=e.__read(r,2),o=i[0],u=i[1];t[t.length-1]=o,a+=intOrZero(u)}}for(var d=1e3,s=t.length-1;s>=0;s--)a+=intOrZero(t[s])*d,d*=60;return a}var twoDigis=function(n){return 10>n?'0'+n:''+n};n.main=function main(){function updateText(){t.textContent=formatTime(Math.round(p))}(function doCss(){(0,a.addCssToPage)('timer','\\nbody {\\n\\tposition: absolute;\\n\\twidth: 100vw;\\n\\theight: 100vh;\\n\\tborder: 0;\\n\\tmargin: 0;\\n\\tpadding: 0;\\n\\n\\tdisplay: flex;\\n\\tflex-direction: column;\\n\\talign-items: center;\\n\\tjustify-content: center;\\n\\tbackground: #222;\\n}\\n\\n.wrap {\\n\\tdisplay: flex;\\n\\tflex-direction: column;\\n\\talign-items: center;\\n\\tjustify-content: center;\\n}\\n\\n.timer {\\n\\tfont-size: 5rem;\\n\\tcolor: #ccc;\\n\\tfont-family: \\'courier new\\';\\n}\\n\\n.speed-input, \\n.button {\\n\\tfont-size: 2rem;\\n\\tcolor: #aaa;\\n\\tborder: 2px solid #aaa;\\n\\tbackground: #444;\\n\\tcursor: pointer;\\n\\ttransition: 0.25s;\\n\\tborder-radius: 3px;\\n\\n\\tmargin: 0.5rem;\\n}\\n\\n.speed-input:hover, \\n.reset-button:hover {\\n\\tcolor: #fff;\\n\\tborder-color: #fff;\\n\\tbackground: #888;\\n}\\n\\n.speed-block {\\n\\tmargin: 0.5rem;\\n\\tfont-size: 2rem;\\n}\\n\\n.speed-input {\\n\\tmax-width: 5em;\\n}\\n\\n\\t')})();var n=(0,r.tag)({class:'wrap'}),t=(0,r.tag)({class:'timer'});n.appendChild(t);var e=(0,r.tag)({tagName:'input',type:'button',value:'reset',class:'button'});e.addEventListener('click',function(){p=0,updateText()}),n.appendChild(e);var o=(0,r.tag)({tagName:'input',type:'button',value:'pause',class:'button'});o.addEventListener('click',function(){m?(m=!1,o.value='pause'):(m=!0,o.value='unpause')}),n.appendChild(o);var u=(0,r.tag)({class:'speed-block',text:'Speed: '}),d=(0,r.tag)({tagName:'input',type:'number',value:1,class:'speed-input'});(function onAnyChange(n,t){var e=n.value,wrappedHandler=function(){var a=n.value;a!==e&&(e=a,t(a))};n.addEventListener('change',wrappedHandler),n.addEventListener('mousedown',wrappedHandler),n.addEventListener('mouseup',wrappedHandler),n.addEventListener('keydown',wrappedHandler),n.addEventListener('keyup',wrappedHandler)})(d,function(){var n=parseFloat(d.value);!Number.isNaN(n)&&Number.isFinite(n)?f=n:console.warn('Bad speed value: '+JSON.stringify(d.value)+': cannot parse')}),u.appendChild(d),n.appendChild(u);var s=(0,r.tag)({class:'add-time-block'}),c=(0,r.tag)({tagName:'input',type:'button',value:'Add time',class:'button'});c.addEventListener('click',function(){p+=parseTime(l.value),updateText()}),s.appendChild(c);var l=(0,r.tag)({tagName:'input',type:'string',value:'5:00.000',class:'speed-input'});l.addEventListener('blur',function(){l.value=function formatTimeShort(n){var t=formatTime(n).replace(/^[0:]+/,'');return t.startsWith('.')&&(t='0'+t),t}(parseTime(l.value))}),s.appendChild(l),n.appendChild(s),document.body.appendChild(n);var p=0,m=!1,f=1,v=Date.now(),updateTimer=function(){requestAnimationFrame(updateTimer);var n=Date.now(),t=(n-v)*f;v=n,m||(p+=t,updateText())};updateTimer(),(0,i.makeSketchInfoButton)()}}"],["tslib","function(e){var t,r,n,o,a,c,i,u,f,l,s,p,y,b,v,d,h,_,w,m,j,O,g,P,define=function(){};(function(t){function createExporter(e,t){return e!==r&&('function'==typeof Object.create?Object.defineProperty(e,'__esModule',{value:!0}):e.__esModule=!0),function(r,n){return e[r]=t?t(r,n):n}}var r='object'==typeof e?e:'object'==typeof self?self:'object'==typeof this?this:{};'function'==typeof define&&define.amd||('object'==typeof module&&'object'==typeof module.exports?t(createExporter(r,createExporter(module.exports))):t(createExporter(r)))})(function(e){var x=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])};t=function(e,t){function __(){this.constructor=e}if('function'!=typeof t&&null!==t)throw new TypeError('Class extends value '+String(t)+' is not a constructor or null');x(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)},r=Object.assign||function(e){for(var t,r=1,n=arguments.length;n>r;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},n=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&'function'==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r},o=function(e,t,r,n){var o,a=arguments.length,c=3>a?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if('object'==typeof Reflect&&'function'==typeof Reflect.decorate)c=Reflect.decorate(e,t,r,n);else for(var i=e.length-1;i>=0;i--)(o=e[i])&&(c=(3>a?o(c):a>3?o(t,r,c):o(t,r))||c);return a>3&&c&&Object.defineProperty(t,r,c),c},a=function(e,t){return function(r,n){t(r,n,e)}},c=function(e,t){if('object'==typeof Reflect&&'function'==typeof Reflect.metadata)return Reflect.metadata(e,t)},i=function(e,t,r,n){return new(r||(r=Promise))(function(o,a){function fulfilled(e){try{step(n.next(e))}catch(e){a(e)}}function rejected(e){try{step(n.throw(e))}catch(e){a(e)}}function step(e){e.done?o(e.value):function adopt(e){return e instanceof r?e:new r(function(t){t(e)})}(e.value).then(fulfilled,rejected)}step((n=n.apply(e,t||[])).next())})},u=function(e,t){function verb(a){return function(i){return function step(a){if(r)throw new TypeError('Generator is already executing.');for(;c;)try{if(r=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return c.label++,{value:a[1],done:!1};case 5:c.label++,n=a[1],a=[0];continue;case 7:a=c.ops.pop(),c.trys.pop();continue;default:if(!((o=(o=c.trys).length>0&&o[o.length-1])||6!==a[0]&&2!==a[0])){c=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){c.label=a[1];break}if(6===a[0]&&c.label<o[1]){c.label=o[1],o=a;break}if(o&&c.label<o[2]){c.label=o[2],c.ops.push(a);break}o[2]&&c.ops.pop(),c.trys.pop();continue}a=t.call(e,c)}catch(e){a=[6,e],n=0}finally{r=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}var r,n,o,a,c={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:verb(0),throw:verb(1),return:verb(2)},'function'==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a},f=function(e,t){for(var r in e)'default'===r||Object.prototype.hasOwnProperty.call(t,r)||P(t,e,r)},P=Object.create?function(e,t,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]},l=function(e){var t='function'==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&'number'==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?'Object is not iterable.':'Symbol.iterator is not defined.')},s=function(e,t){var r='function'==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,o,a=r.call(e),c=[];try{for(;(void 0===t||t-- >0)&&!(n=a.next()).done;)c.push(n.value)}catch(e){o={error:e}}finally{try{n&&!n.done&&(r=a.return)&&r.call(a)}finally{if(o)throw o.error}}return c},p=function(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(s(arguments[t]));return e},y=function(){for(var e=0,t=0,r=arguments.length;r>t;t++)e+=arguments[t].length;var n=Array(e),o=0;for(t=0;r>t;t++)for(var a=arguments[t],c=0,i=a.length;i>c;c++,o++)n[o]=a[c];return n},b=function(e,t,r){if(r||2===arguments.length)for(var n,o=0,a=t.length;a>o;o++)!n&&o in t||(n||(n=Array.prototype.slice.call(t,0,o)),n[o]=t[o]);return e.concat(n||Array.prototype.slice.call(t))},v=function(e){return this instanceof v?(this.v=e,this):new v(e)},d=function(e,t,r){function verb(e){o[e]&&(n[e]=function(t){return new Promise(function(r,n){a.push([e,t,r,n])>1||resume(e,t)})})}function resume(e,t){try{(function step(e){e.value instanceof v?Promise.resolve(e.value.v).then(fulfill,reject):settle(a[0][2],e)})(o[e](t))}catch(e){settle(a[0][3],e)}}function fulfill(e){resume('next',e)}function reject(e){resume('throw',e)}function settle(e,t){e(t),a.shift(),a.length&&resume(a[0][0],a[0][1])}if(!Symbol.asyncIterator)throw new TypeError('Symbol.asyncIterator is not defined.');var n,o=r.apply(e,t||[]),a=[];return n={},verb('next'),verb('throw'),verb('return'),n[Symbol.asyncIterator]=function(){return this},n},h=function(e){function verb(n,o){t[n]=e[n]?function(t){return(r=!r)?{value:v(e[n](t)),done:'return'===n}:o?o(t):t}:o}var t,r;return t={},verb('next'),verb('throw',function(e){throw e}),verb('return'),t[Symbol.iterator]=function(){return this},t},_=function(e){function verb(r){t[r]=e[r]&&function(t){return new Promise(function(n,o){(function settle(e,t,r,n){Promise.resolve(n).then(function(t){e({value:t,done:r})},t)})(n,o,(t=e[r](t)).done,t.value)})}}if(!Symbol.asyncIterator)throw new TypeError('Symbol.asyncIterator is not defined.');var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e='function'==typeof l?l(e):e[Symbol.iterator](),t={},verb('next'),verb('throw'),verb('return'),t[Symbol.asyncIterator]=function(){return this},t)},w=function(e,t){return Object.defineProperty?Object.defineProperty(e,'raw',{value:t}):e.raw=t,e};var S=Object.create?function(e,t){Object.defineProperty(e,'default',{enumerable:!0,value:t})}:function(e,t){e.default=t};m=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)'default'!==r&&Object.prototype.hasOwnProperty.call(e,r)&&P(t,e,r);return S(t,e),t},j=function(e){return e&&e.__esModule?e:{default:e}},O=function(e,t,r,n){if('a'===r&&!n)throw new TypeError('Private accessor was defined without a getter');if('function'==typeof t?e!==t||!n:!t.has(e))throw new TypeError('Cannot read private member from an object whose class did not declare it');return'm'===r?n:'a'===r?n.call(e):n?n.value:t.get(e)},g=function(e,t,r,n,o){if('m'===n)throw new TypeError('Private method is not writable');if('a'===n&&!o)throw new TypeError('Private accessor was defined without a setter');if('function'==typeof t?e!==t||!o:!t.has(e))throw new TypeError('Cannot write private member to an object whose class did not declare it');return'a'===n?o.call(e,r):o?o.value=r:t.set(e,r),r},e('__extends',t),e('__assign',r),e('__rest',n),e('__decorate',o),e('__param',a),e('__metadata',c),e('__awaiter',i),e('__generator',u),e('__exportStar',f),e('__createBinding',P),e('__values',l),e('__read',s),e('__spread',p),e('__spreadArrays',y),e('__spreadArray',b),e('__await',v),e('__asyncGenerator',d),e('__asyncDelegator',h),e('__asyncValues',_),e('__makeTemplateObject',w),e('__importStar',m),e('__importDefault',j),e('__classPrivateFieldGet',O),e('__classPrivateFieldSet',g)})}"]]
,
{"entryPoint":{"module":"/timer/timer","function":"main"}},eval);