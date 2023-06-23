function e(e,t,s,i){Object.defineProperty(e,t,{get:s,set:i,enumerable:!0,configurable:!0})}var t=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequirebf86;t.register("hIDiW",(function(s,i){e(s.exports,"getBinder",(()=>c));var r=t("aCiCs"),n=t("hsvBG"),o=t("gc7tN");const a=Symbol();class h{constructor(e){this.el=e,this.insertedHandlers=null,this.removedHandlers=null,this.watchedBoxes=null,this.resizeObserver=null,this.resizeHandlers=null,this.lastKnownSize=null,this.isInDom=function(e){let t=e.parentNode;for(;t;){if(t===document.body)return!0;t=t.parentNode}return!1}(e)}get element(){const e=this.el;if(!(e instanceof Element))throw new Error("Expected to have node of class Element, but it's not: "+e);return e}onNodeInserted(e){(this.insertedHandlers||=[]).push(e)}onNodeRemoved(e){(this.removedHandlers||=[]).push(e)}onNodeInsertedOnce(e){const t=()=>{try{e()}finally{this.clearOnNodeInserted(t)}};this.onNodeInserted(t)}onNodeRemovedOnce(e){const t=()=>{try{e()}finally{this.clearOnNodeRemoved(t)}};this.onNodeRemoved(t)}clearOnNodeInserted(e){this.insertedHandlers=d(this.insertedHandlers,e)}clearOnNodeRemoved(e){this.removedHandlers=d(this.removedHandlers,e)}fireNodeInserted(){this.isInDom=!0;const e=this.watchedBoxes;if(e)for(let t=0;t<e.length;t++){const s=e[t],i=s.box();s.lastKnownValue!==i&&this.invokeBoxHandler(i,s),this.subToBox(s)}this.updateResizeObserver(),b(this.insertedHandlers)}fireNodeRemoved(){this.isInDom=!1;const e=this.watchedBoxes;if(e)for(let t=0;t<e.length;t++){e[t].unsub()}this.updateResizeObserver(),b(this.removedHandlers)}invokeBoxHandler(e,t){t.handler(e),t.lastKnownValue=e}subToBox(e){e.unsub=e.box.subscribe((t=>this.invokeBoxHandler(t,e)))}_subscribe(e,t){const s={box:e,handler:t,lastKnownValue:a,unsub:null};return this.isInDom&&this.subToBox(s),(this.watchedBoxes||=[]).push(s),{unsub:()=>{this.watchedBoxes=d(this.watchedBoxes,s)},watchedBox:s}}watch(e,t){return this._subscribe(e,t).unsub}watchAndRun(e,t){if((0,n.isRBox)(e)){const{unsub:s,watchedBox:i}=this._subscribe(e,t);return this.invokeBoxHandler(e(),i),s}return t(e),()=>{}}callResizeHandlers(){if(!this.resizeHandlers)return;const e=this.element.clientWidth,t=this.element.clientHeight;if(this.lastKnownSize){if(this.lastKnownSize.w===e&&this.lastKnownSize.h===t)return;this.lastKnownSize.w=e,this.lastKnownSize.h=t}else this.lastKnownSize={w:e,h:t};for(const e of this.resizeHandlers)e()}updateResizeObserver(){this.isInDom&&this.resizeHandlers?this.resizeObserver||(this.lastKnownSize={w:this.element.clientWidth,h:this.element.clientHeight},this.resizeObserver=new ResizeObserver(this.callResizeHandlers.bind(this)),this.resizeObserver.observe(this.element)):this.resizeObserver&&(this.resizeObserver.unobserve(this.element),this.resizeObserver.disconnect(),this.resizeObserver=null,this.lastKnownSize=null)}onResize(e){return this.resizeHandlers||(this.resizeHandlers=[]),this.resizeHandlers.push(e),this.updateResizeObserver(),()=>{this.resizeHandlers=this.resizeHandlers?.filter((t=>t!==e))??null,0===this.removedHandlers?.length&&(this.resizeHandlers=null,this.updateResizeObserver())}}}const l=(0,o.makeNodeDataAttacher)("__binder_of_this_node"),u=new(0,r.MutationBinder)(l);function c(e){u.init();let t=l.get(e);return t||(t=new h(e),l.set(e,t)),t}function d(e,t){if(!e||1===e.length&&e[0]===t)return null;const s=[];for(let i=0;i<e.length;i++){const r=e[i];r!==t&&s.push(r)}return s}function b(e){if(e)for(let t=0;t<e.length;t++)e[t]()}})),t.register("aCiCs",(function(t,s){e(t.exports,"MutationBinder",(()=>i));class i{constructor(e){this.binders=e,this.observer=null}init(){this.observer||(this.observer=new MutationObserver(this.doWithRecords.bind(this)),this.observer.observe(document.body,{childList:!0,subtree:!0}))}collectEligibleNodes(e){const t=new Set;for(;;){const s=e.pop();if(!s)break;this.binders.has(s)&&t.add(s);const i=s.childNodes;for(let t=0;t<i.length;t++)e.push(i[t])}return t}doWithRecords(e){const t=[],s=[];for(let i=0;i<e.length;i++){const r=e[i];for(let e=0;e<r.addedNodes.length;e++)t.push(r.addedNodes[e]);for(let e=0;e<r.addedNodes.length;e++)s.push(r.removedNodes[e])}const i=this.collectEligibleNodes(t),r=this.collectEligibleNodes(s);for(const e of i)r.has(e)||this.binders.get(e).fireNodeInserted();for(const e of r)i.has(e)||this.binders.get(e).fireNodeRemoved()}}})),t.register("hsvBG",(function(t,s){e(t.exports,"box",(()=>i)),e(t.exports,"isRBox",(()=>r)),e(t.exports,"unbox",(()=>n));const i=function(e){const t=a((function(...e){if(e.length<1?h.notifyOnAccess(t):t.tryChangeValue(e[0]),t.value===o)throw new Error("After executing valueBox the value is absent!");return t.value}),new u(e));return t};function r(e){return e instanceof l}function n(e){return r(e)?e():e}const o=Symbol();function a(e,t){return Object.setPrototypeOf(e,Object.getPrototypeOf(t)),Object.assign(e,t),e}const h=new class{notificationStack=[];withAccessNotifications(e,t){let s;this.notificationStack.push(t);try{s=e()}finally{this.notificationStack.pop()}return s}notifyOnAccess(e){const t=this.notificationStack[this.notificationStack.length-1];t&&t.add(e)}};class l{constructor(e){this.value=e,this.revision=1,this.internalSubscribers=new Set,this.externalSubscribers=new Set}haveSubscribers(){return this.internalSubscribers.size>0||this.externalSubscribers.size>0}dispose(){this.value=o;for(const e of this.internalSubscribers)e.box.dispose()}doSubscribe(e,t,s){const i=this.value;if(i===o)throw new Error("Cannot subscribe to box: no value!");if(e){const e={handler:t,lastKnownRevision:this.revision,lastKnownValue:i};return this.externalSubscribers.add(e),()=>{this.externalSubscribers.delete(e)}}{if(!s)throw new Error("Assertion failed");const e={handler:t,box:s,lastKnownRevision:this.revision,lastKnownValue:i};return this.internalSubscribers.add(e),()=>this.internalSubscribers.delete(e)}}subscribe(e){return this.doSubscribe(!0,e)}tryChangeValue(e,t){const s=this.value!==e;this.value=e,s&&(this.revision++,this.notify(e,t))}notify(e,t){const s=this.revision;for(const i of this.internalSubscribers)i.box!==t&&this.maybeCallSubscriber(i,e,s);if(!(s<this.revision))for(const t of this.externalSubscribers)this.maybeCallSubscriber(t,e,s)}maybeCallSubscriber(e,t,s){e.lastKnownRevision>s||(e.lastKnownRevision=s,e.lastKnownValue!==t&&(e.lastKnownValue=t,e.handler(t)))}map(e){return m((()=>e(this())),[this])}wrapElements(e){return w(new v(this,e))}}class u extends l{prop(e){if(Array.isArray(this.value))throw new Error("You should not use prop() to get values of elements of the array. Use wrapElements() instead.");return b(new d(this,e))}}class c extends u{constructor(e,t){super(t),this.upstream=e,this.upstreamUnsub=null}fetchValueFromUpstream(){return this.extractValueFromUpstream(this.getUpstreamValue())}shouldBeSubscribed(){return this.haveSubscribers()}doOnUpstreamChange(e){const t=this.extractValueFromUpstream(e);this.tryChangeValue(t,this.upstream)}notifyUpstreamOnChange(e){const t=this.buildUpstreamValue(e);this.upstream.tryChangeValue(t,this)}getUpstreamValue(){return h.withAccessNotifications(this.upstream,null)}getBoxValue(){return this.value!==o&&null!==this.upstreamUnsub?this.value:this.fetchValueFromUpstream()}tryUpdateUpstreamSub(){const e=this.shouldBeSubscribed();e&&!this.upstreamUnsub?this.subToUpstream():!e&&this.upstreamUnsub&&this.unsubFromUpstream()}unsubFromUpstream(){if(!this.upstreamUnsub)throw new Error("Assertion failed");this.upstreamUnsub(),this.upstreamUnsub=null,this.value=this.getEmptyValue()}subToUpstream(){if(this.upstreamUnsub)throw new Error("Assertion failed");this.value===o&&(this.value=this.getBoxValue()),this.upstreamUnsub=this.upstream.doSubscribe(!1,this.doOnUpstreamChange.bind(this),this)}doSubscribe(e,t,s){this.value===o&&(this.value=this.getBoxValue());const i=super.doSubscribe(e,t,s);return this.tryUpdateUpstreamSub(),()=>{i(),this.tryUpdateUpstreamSub()}}notify(e,t){this.shouldBeSubscribed()||(this.value=this.getEmptyValue()),t!==this.upstream&&this.notifyUpstreamOnChange(e),super.notify(e,t)}getEmptyValue(){return o}}class d extends c{constructor(e,t){super(e,o),this.propKey=t}extractValueFromUpstream(e){return e[this.propKey]}buildUpstreamValue(e){const t=this.getUpstreamValue();if(Array.isArray(t))throw new Error(`Upstream object is an array! Cannot properly clone it to set the property "${this.propKey.toString()}" value.`);return{...t,[this.propKey]:e}}}function b(e){const t=a((function(...e){return 0===e.length?h.notifyOnAccess(t):t.tryChangeValue(e[0]),t.getBoxValue()}),e);return t}class p extends l{constructor(e){super(o),this.explicitDependencyList=e,this.subDisposers=[],this.onDependencyListUpdated=null,this.boundCalcVal=null}subDispose(){this.subDisposers.forEach((e=>e())),this.subDisposers.length=0}shouldRecalcValue(){return this.value===o||0===this.subDisposers.length}recalcValueAndResubscribe(e){const t=[...this.subDisposers];let s,i;const r=this.boundCalcVal||=this.calculateValue.bind(this);if(this.explicitDependencyList)s=h.withAccessNotifications(r,null),i=this.explicitDependencyList;else{const e=new Set;s=h.withAccessNotifications(r,e),i=[...e]}if(this.tryChangeValue(s),e||this.haveSubscribers()){if(i.length>0){const e=this.onDependencyListUpdated||=()=>this.recalcValueAndResubscribe(!1);for(let t=0;t<i.length;t++)this.subDisposers.push(i[t].doSubscribe(!1,e,this))}}else this.value=o;for(const e of t)e();this.subDisposers=this.subDisposers.slice(t.length)}doSubscribe(e,t,s){this.haveSubscribers()||this.recalcValueAndResubscribe(!0);const i=super.doSubscribe(e,t,s);return()=>{i(),this.haveSubscribers()||(this.subDispose(),this.value=o)}}getValue(){if(h.notifyOnAccess(this),!this.shouldRecalcValue())return this.value;const e=this.boundCalcVal||=this.calculateValue.bind(this);return h.withAccessNotifications(e,null)}prop(e){return this.map((t=>t[e]))}}class f extends p{constructor(e,t){super(t),this.calculateValue=e}}function m(e,t){return w(new f(e,t))}function w(e){const t=a((function(){return t.getValue()}),e);return t}class v extends p{constructor(e,t){super([e]),this.upstream=e,this.getKey=t,this.childMap=new Map}calculateValue(){if("function"!=typeof this)throw new Error("Assertion failed");const e=new Set(this.childMap.keys()),t=h.withAccessNotifications(this.upstream,null);if(!Array.isArray(t))throw new Error("Assertion failed: upstream value is not array for array-wrap box");const s=t.map(((t,s)=>{const i=this.getKey(t);let r=this.childMap.get(i);if(r){if(!e.has(i))throw new Error("Constraint violated, key is not unique: "+i);r.index=s,r.tryChangeValue(t,this)}else r=b(new y(i,s,t,this)),this.childMap.set(i,r);return e.delete(i),r}));for(const t of e){this.childMap.get(t).dispose(),this.childMap.delete(t)}return s}tryUpdateChildrenValues(){this.calculateValue()}notifyValueChanged(e,t){if(!(this.upstream instanceof u))throw new Error("You cannot change the value of upstream array in readonly box through wrap-box");const s=this.getKey(e),i=this.childMap.get(s),r=t.key;if(i){if(i!==t)throw new Error("Constraint violated, key is not unique: "+s)}else this.childMap.delete(t.key),this.childMap.set(s,t),t.key=s;let n=h.withAccessNotifications(this.upstream,null);n=[...n];let o=-1;if(this.haveSubscribers())o=t.index;else{for(let e=0;e<n.length;e++){const t=n[e];if(this.getKey(t)===r){if(o>=0)throw new Error("Constraint violated, key is not unique: "+r);o=e}}o<0&&(t.dispose(),t.throwDetachedError())}n[o]=e,this.upstream.tryChangeValue(n,this)}}class y extends c{constructor(e,t,s,i){super(i,s),this.key=e,this.index=t,this.disposed=!1}dispose(){this.disposed=!0,this.value=o,this.tryUpdateUpstreamSub(),super.dispose()}shouldBeSubscribed(){return!this.disposed&&super.shouldBeSubscribed()}fetchValueFromUpstream(){return this.checkNotDisposed(),this.upstream.tryUpdateChildrenValues(),this.checkNotDisposed(),this.value}checkNotDisposed(){this.disposed&&this.throwDetachedError()}throwDetachedError(){throw new Error("Element wrap box for key "+(("symbol"==typeof(e=this.key)?e.toString():e+"")+" is no longer attached to an upstream box, because upstream box does not have this key, or did not have this key in some time in the past after this box was created."));var e}extractValueFromUpstream(){throw new Error("This method should never be called on this box")}buildUpstreamValue(){throw new Error("This method should never be called on this box")}doOnUpstreamChange(){}notifyUpstreamOnChange(e){this.checkNotDisposed(),this.upstream.notifyValueChanged(e,this)}getEmptyValue(){return this.disposed?o:this.value}}})),t.register("gc7tN",(function(t,s){function i(e){return"undefined"==typeof WeakMap?new n(e):new r}e(t.exports,"makeNodeDataAttacher",(()=>i));class r{map=new WeakMap;get(e){return this.map.get(e)}set(e,t){this.map.set(e,t)}delete(e){return this.map.delete(e)}has(e){return this.map.has(e)}}class n{constructor(e){this.key=e}get(e){return e[this.key]}set(e,t){e[this.key]=t}delete(e){const t=this.has(e);return delete e[this.key],t}has(e){return this.key in e}}}));
//# sourceMappingURL=digger.0464e8a2.js.map
