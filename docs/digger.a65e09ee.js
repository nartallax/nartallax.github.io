function t(t,e,r,i){Object.defineProperty(t,e,{get:r,set:i,enumerable:!0,configurable:!0})}var e=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequirebf86;e.register("hppz9",(function(r,i){t(r.exports,"main",(()=>n));var s=e("d1Qaj");async function n(t){const e={widthCells:15,heightCells:10,screenWidth:document.body.clientWidth,screenHeight:document.body.clientHeight,wallThickness:.1,colors:{terrainA:"#d45500",terrainB:"#aa4400",terrainEmpty:"#2b1100"},dramaticDrawTiming:{terrain:.5}},r=new(0,s.DiggerWorld)(e);t.appendChild(r.el),r.start(),r.digVertical(0,0,5),r.digVertical(0,0,4)}})),e.register("d1Qaj",(function(r,i){t(r.exports,"DiggerWorld",(()=>h));var s=e("7sHgZ"),n=e("1VHh9"),a=e("cZ4Y3");let o;var l;(l=o||(o={}))[l.DramaticDrawTerrain=0]="DramaticDrawTerrain",l[l.Running=1]="Running";class h{constructor(t){this.options=t,this.state=o.Running,this.dramaticDrawProgress=0,this.raf=null,this.invalidatedRects=new(0,a.RectanlgeDeduplicator);const e=t.screenWidth/t.widthCells,r=t.screenHeight/(t.heightCells+1);this.cellSizePx=Math.floor(Math.min(e,r));const i=t.screenWidth-this.cellSizePx*t.widthCells;this.soilMarginLeft=Math.ceil(i/2),this.playgroundWidthPx=t.widthCells*this.cellSizePx,this.terrain=new(0,n.Bitmap)(this.cellSizePx**2*t.widthCells*t.heightCells),this.terrain.setAll(),this.el=(0,s.tag)({tag:"canvas",attrs:{width:t.screenWidth,height:t.screenHeight}});const l=this.el.getContext("2d");if(!l)throw new Error("Browser can't canvas 2d");if(this.context=l,!requestAnimationFrame)throw new Error("Browser can't RAF")}drawTerrainPixelAt(t,e,r){this.context.fillStyle,this.context.fillStyle=r?((15&e)>8?(e+t&15)>8:(e-t&15)<8)?this.options.colors.terrainA:this.options.colors.terrainB:this.options.colors.terrainEmpty,this.context.fillRect(t,e,1,1)}redrawTerrainAt(t,e){this.drawTerrainPixelAt(t+this.soilMarginLeft,e+this.cellSizePx,this.terrain.get(e*this.playgroundWidthPx+t))}dramaticDrawInitialTerrain(t){const e=this.dramaticDrawProgress,r=this.options.screenWidth*(this.options.screenHeight-this.cellSizePx),i=r/this.options.dramaticDrawTiming.terrain,s=Math.floor(t*i);this.dramaticDrawProgress=Math.min(r,this.dramaticDrawProgress+s);for(let t=e;t<this.dramaticDrawProgress;t++){const e=t%this.options.screenWidth,r=(t-e)/this.options.screenWidth+this.cellSizePx;this.drawTerrainPixelAt(e,r,!0)}this.dramaticDrawProgress===r&&(this.state=o.Running,this.dramaticDrawProgress=0)}invalidate(t,e,r,i){this.invalidatedRects.add({x:t,y:e,w:r,h:i})}redrawInvalidatedRectangles(){for(const t of this.invalidatedRects.getNonIntersectingRects()){const e=t.x+t.w,r=t.y+t.h;for(let i=t.x;i<e;i++)for(let e=t.y;e<r;e++)this.redrawTerrainAt(i,e)}this.invalidatedRects.clear()}onTick(t){switch(this.state){case o.DramaticDrawTerrain:return void this.dramaticDrawInitialTerrain(t);case o.Running:return void this.redrawInvalidatedRectangles()}}reset(){this.state=o.DramaticDrawTerrain,this.dramaticDrawProgress=0}start(){if(this.raf)throw new Error("Already started");this.reset();let t=0;const e=r=>{this.raf=requestAnimationFrame(e);const i=Math.min(1e3/15,r-t)/1e3;t=r,this.onTick(i)};e(t)}stop(){if(!this.raf)throw new Error("Not started");cancelAnimationFrame(this.raf),this.raf=null}digVertical(t,e,r){if(e>r){r=e,e=e}const i=this.cellSizePx*(1-this.options.wallThickness),s=t*this.cellSizePx-i/2,n=s+i,a=e*this.cellSizePx,o=r*this.cellSizePx;for(let t=a;t<=o;t++){const e=t*this.playgroundWidthPx;for(let t=s;t<=n;t++)this.terrain.clear(e+t)}this.invalidate(s,a,n-s,o-a)}}})),e.register("1VHh9",(function(e,r){t(e.exports,"Bitmap",(()=>i));class i{constructor(t){if(this.size=t,t<0)throw new Error(`Expected non-negative as size, got ${t}`);t%8&&(t=8*Math.ceil(t/8)),this.arr=new Uint8Array(t>>3)}set(t){const e=this.arr,r=t>>3;e[r]=e[r]|1<<(7&t)}clear(t){const e=this.arr,r=t>>3;e[r]=e[r]&~(1<<(7&t))}get(t){return 0!=(this.arr[t>>3]&1<<(7&t))}setAll(){this.arr.fill(255)}clearAll(){this.arr.fill(0)}getOffsetsAsNumbers(t,e){if(7&t||7&e)throw new Error("Assertion failed, only byte-aligned start/length is supported");const r=[];let i=0;for(let s=0;s<e>>3;s++){const e=this.arr[(t>>3)+s];let n=1;for(;256!==n;)e&n&&r.push(i),i++,n<<=1}return r}setOffsetsByNumbers(t,e,r){if(7&t||7&e)throw new Error("Assertion failed, only byte-aligned start/length is supported");let i=!1,s=0,n=0,a=r[n];for(let o=0;o<e>>3;o++){const e=this.arr[(t>>3)+o];let l=0,h=1;for(;256!==h;){const t=s===a?h:0;i=i||(e&h)!==t,t&&(l|=h,n++,a=r[n]),s++,h<<=1}this.arr[(t>>3)+o]=l}return i}and(t,e){if(7&e)throw new Error("Assertion failed, only byte-aligned start/length is supported");let r=!1;for(let i=0;i<t.arr.length;i++){const s=this.arr[(e>>3)+i],n=s&t.arr[i];r=r||n!==s,this.arr[(e>>3)+i]=n}return r}orFromTheStart(t){if(t.arr.length>this.arr.length)throw new Error("Assertion failed, lengths are not equal");for(let e=0;e<t.arr.length;e++)this.arr[e]=this.arr[e]|t.arr[e]}}})),e.register("cZ4Y3",(function(e,r){t(e.exports,"RectanlgeDeduplicator",(()=>i));class i{rects=[];add(t){this.rects.push(t)}clear(){this.rects.length=0}*getNonIntersectingRects(){for(const t of this.groupByLumps()){const e=[...this.splitLump(t)];yield*l(e)}}*groupByLumps(){for(const t of s(this.rects,n("y","h")))yield*s(t,n("x","w"))}*splitLump(t){const e=a(t,"x","w"),r=a(t,"y","h");for(const i of t)for(const t of o(i,e,"x","w"))yield*o(t,r,"y","h")}}function*s(t,e){if(0===t.length)return;let r=t[0],i=[r],s=null;for(let n=1;n<t.length;n++){const a=t[n];s=e(r,a,s),s?i.push(a):(yield i,i=[a]),r=a}yield i}function n(t,e){return(r,i,s)=>{const n=s?s.a:r[t],a=s?s.b:r[t]+r[e];return i[t]+i[e]<n||i[t]>a?null:{a:Math.min(n,i[t]),b:Math.max(a,i[t]+i[e])}}}function a(t,e,r){const i=[];for(let s=0;s<t.length;s++){const n=t[s],a=n[e];i.push(a,a+n[r])}return i.sort(((t,e)=>t-e))}function*o(t,e,r,i){let s=e[0];for(let n=1;n<e.length;n++){const a=e[n];if(a===s)continue;const o=t[r];if(s<o)a>o&&(yield{...t,[i]:a-o});else{const e=t[i];if(!(a<o+e)){yield{...t,[r]:s,[i]:o+e-s};break}yield{...t,[r]:s,[i]:a-s}}s=a}}function*l(t){if(t.length<1)return;let e=(t=t.sort(((t,e)=>t.x-e.x||t.y-e.y)))[0];if(yield e,!(t.length<2))for(let r=1;r<t.length;r++){const i=t[r];i.x===e.x&&i.y===e.y&&i.h===e.h&&i.w===e.w||(yield i,e=i)}}}));
//# sourceMappingURL=digger.a65e09ee.js.map