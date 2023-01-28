function e(e,t,r,n){Object.defineProperty(e,t,{get:r,set:n,enumerable:!0,configurable:!0})}function t(e){return e&&e.__esModule?e.default:e}var r=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequirebf86;r.register("TmoKT",(function(t,n){e(t.exports,"main",(()=>u));var i=r("5DUDw"),o=r("d4DhX"),a=r("3ekh2"),s=r("hf9LN"),c=r("5udHq");function u(e){const t=document.createElement("canvas"),r=e.getBoundingClientRect();t.setAttribute("width",r.width+""),t.setAttribute("height",r.height+""),t.style.cssText="position: absolute; top: 0; bottom: 0; left: 0; right: 0;",e.appendChild(t);const n=t.getContext("webgl2"),u=function(e,t){const r=new Array(t).fill(0).map(((e,t)=>t)),n=e.createBuffer();if(!n)throw new Error("Cannot create webgl buffer");return e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Uint32Array(r),e.STATIC_DRAW),n}(n,a.particlesCount),d=function(e){const t=e.createBuffer();if(!t)throw new Error("Cannot create webgl buffer");return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW),t}(n),l={x:r.width,y:r.height},E=new(0,a.FrameBufferTexturePair)(n,f((e=>{return 10*e*(65535/(t=l).x)&65535|(20*e*(65535/t.y)&65535)<<16;var t}))),T=new(0,a.FrameBufferTexturePair)(n,f((()=>{return e={x:36863,y:36863},t=100*(Math.random()-.5),r=100*(Math.random()-.5),t*(65535/e.x)+36863&65535|(r*(65535/e.y)+36863&65535)<<16;var e,t,r}))),x=new(0,c.CalcSpeedShader)(n),m=new(0,c.CalcPosShader)(n),h=new(0,c.DrawShader)(n);x.use(),n.uniform2f(x.screenSize,r.width,r.height),n.uniform1i(x.position,0),n.uniform1i(x.speed,1),n.uniform1f(x.gravity,50);const p=o.GlUtils.makeBindVAO(n);n.bindBuffer(n.ARRAY_BUFFER,d),n.enableVertexAttribArray(x.vertex),n.vertexAttribPointer(x.vertex,2,n.FLOAT,!1,0,0),m.use(),n.uniform2f(m.screenSize,r.width,r.height),n.uniform1i(m.position,0),n.uniform1i(m.speed,1);const g=o.GlUtils.makeBindVAO(n);n.bindBuffer(n.ARRAY_BUFFER,d),n.enableVertexAttribArray(m.vertex),n.vertexAttribPointer(m.vertex,2,n.FLOAT,!1,0,0),h.use(),n.uniform2f(h.screenSize,r.width,r.height),n.uniform1i(h.position,0);const A=o.GlUtils.makeBindVAO(n);n.bindBuffer(n.ARRAY_BUFFER,u),n.enableVertexAttribArray(h.id),n.vertexAttribIPointer(h.id,1,n.UNSIGNED_INT,0,0);let _=0;const R=a.particlesCount/10,S=new(0,s.FpsCounter);(0,i.cycledRequestAnimationFrame)((e=>{e>50||function(e){S.recordFrame(e);const t=_,i=t+Math.floor(R*e);_=i,_>=a.particlesCount&&(_=0),T.withFramebufferActive((()=>{x.use(),n.viewport(0,0,a.dataTextureSize,a.dataTextureSize),n.uniform1f(x.deltaTime,e),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,E.texture),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,T.texture),n.bindVertexArray(p),n.drawArrays(n.TRIANGLES,0,6)})),T.swap(),E.withFramebufferActive((()=>{m.use(),n.viewport(0,0,a.dataTextureSize,a.dataTextureSize),n.uniform1f(m.deltaTime,e),n.uniform1ui(m.firstMovedParticleIndex,t),n.uniform1ui(m.lastMovedParticleIndex,i),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,E.texture),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,T.texture),n.bindVertexArray(g),n.drawArrays(n.TRIANGLES,0,6)})),E.swap(),h.use(),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,r.width,r.height),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,E.texture),n.bindVertexArray(A),n.drawArrays(n.POINTS,0,a.particlesCount)}(e/1e3)}))}function f(e){const t=new Array(a.dataTextureSize*a.dataTextureSize).fill(0).map(((t,r)=>e(r)));return new Uint32Array(t)}})),r.register("5DUDw",(function(t,r){function n(e){let t=!1,r=0;const n=i=>{if(t)return;const o=i-r;r=i,requestAnimationFrame(n),e(o)};return requestAnimationFrame(n),()=>t=!0}e(t.exports,"cycledRequestAnimationFrame",(()=>n))})),r.register("d4DhX",(function(t,r){let n;e(t.exports,"GlUtils",(()=>n)),function(e){function t(e,t,r){let n=null;try{if(n=e.createShader("vertex"===t?e.VERTEX_SHADER:e.FRAGMENT_SHADER),!n)throw new Error("No shader is created of type "+t);e.shaderSource(n,r),e.compileShader(n);const i=e.getShaderParameter(n,e.COMPILE_STATUS),o=e.getShaderInfoLog(n);if(!i)throw console.log(r),new Error("Failed to compile shader of type "+t+": "+o);return o&&console.warn("WebGL "+t+" shader compile log: ",o),n}catch(t){throw e.deleteShader(n),t}}e.getGlContext=function(e){const t=e.getContext("webgl2");if(!t)throw new Error("No webgl2 available.");return t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.disable(t.SCISSOR_TEST),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.STENCIL_TEST),t},e.makeShader=t,e.makeProgram=function(e,r,n){let i=null,o=null,a=null;try{if(i=t(e,"fragment",n),o=t(e,"vertex",r),a=e.createProgram(),!a)throw new Error("No webgl program was created.");e.attachShader(a,i),e.attachShader(a,o),e.linkProgram(a);const s=e.getProgramParameter(a,e.LINK_STATUS),c=e.getProgramInfoLog(a);if(!s)throw new Error("Failed to link program: "+c);return c&&console.warn("WebGL program log: ",c),{program:a,shaders:[i,o]}}catch(t){throw i&&e.deleteShader(i),o&&e.deleteShader(o),a&&e.deleteProgram(a),t}},e.setViewportSizeByCanvas=function(e,t){const r=t.clientWidth*window.devicePixelRatio,n=t.clientHeight*window.devicePixelRatio;return t.width=r,t.height=n,e.viewport(0,0,r,n),{width:r,height:n}},e.loadTexture=function(e,t){return new Promise(((r,n)=>{const i=new Image;i.onload=()=>{try{const t=function(e){const t=e.createTexture();if(!t)throw new Error("No texture was created.");return e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),t}(e);e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,i),e.generateMipmap(e.TEXTURE_2D),r(t)}catch(e){n(e)}},i.onerror=()=>n(new Error("Failed to load texture: "+t)),i.src=t}))};const r=[0,0,1,0,1,1,0,1],n=[0,1,2,0,2,3];function i(e,t){const r=e.createBuffer();if(!r)throw new Error("Buffer was not created.");return e.bindBuffer(t,r),r}e.makeSquareVertexBuffer=function(e){const t=i(e,e.ARRAY_BUFFER);return e.bufferData(e.ARRAY_BUFFER,new Float32Array(r),e.STATIC_DRAW),t},e.makeSquareIndexBuffer=function(e){const t=i(e,e.ELEMENT_ARRAY_BUFFER);return e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(n),e.STATIC_DRAW),t},e.makeBindBuffer=i,e.makeBindVAO=function(e){const t=e.createVertexArray();if(!t)throw new Error("VAO was not created.");return e.bindVertexArray(t),t}}(n||(n={}))})),r.register("3ekh2",(function(t,r){e(t.exports,"particlesCount",(()=>n)),e(t.exports,"dataTextureSize",(()=>i)),e(t.exports,"FrameBufferTexturePair",(()=>s));const n=128e3,i=2**Math.ceil(Math.log2(Math.ceil(Math.sqrt(n))));function o(e,t){const r=e.createTexture();if(!r)throw new Error("No texture was created");return e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,e.R32UI,i,i,0,e.RED_INTEGER,e.UNSIGNED_INT,t,0),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),r}function a(e,t){const r=e.createFramebuffer();if(!r)throw new Error("Cannot create webgl framebuffer");return e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),r}class s{constructor(e,t){this.gl=e,this.activeA=!0,this._textureA=o(e,t),this._textureB=o(e,t),this._framebufferA=a(e,this._textureA),this._framebufferB=a(e,this._textureB)}get texture(){return this.activeA?this._textureA:this._textureB}get framebuffer(){return this.activeA?this._framebufferB:this._framebufferA}swap(){this.activeA=!this.activeA}withFramebufferActive(e){try{return this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.framebuffer),e()}finally{this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null)}}}})),r.register("hf9LN",(function(t,r){e(t.exports,"FpsCounter",(()=>n));class n{constructor(e=3){this.reportFreq=e,this.count=0,this.time=0}recordFrame(e){for(this.time+=e,this.count++;this.time>this.reportFreq;)this.time-=this.reportFreq,console.log("FPS: "+this.count/this.reportFreq),this.count=0}}})),r.register("5udHq",(function(n,i){e(n.exports,"DrawShader",(()=>m)),e(n.exports,"CalcPosShader",(()=>h)),e(n.exports,"CalcSpeedShader",(()=>p));var o=r("aAGU0"),a=r("6daLX"),s=r("72NEL"),c=r("htDMP"),u=r("iRKfn"),f=r("35ZyT"),d=r("44txf"),l=r("d4DhX"),E=r("3ekh2");function T(e){return`#version 300 es\n#define DATA_TEXTURE_SIZE ${E.dataTextureSize}.0\n`+t(o)+"\n"+e}class x{constructor(e,t,r){this.gl=e;const{program:n,shaders:i}=l.GlUtils.makeProgram(e,T(t),T(r));this.program=n,this.shaders=i}use(){this.gl.useProgram(this.program)}delete(){this.gl.deleteProgram(this.program);for(const e of this.shaders)this.gl.deleteShader(e)}}class m extends x{constructor(e){super(e,t(s),t(a)),this.position=e.getUniformLocation(this.program,"position"),this.id=e.getAttribLocation(this.program,"id"),this.screenSize=e.getUniformLocation(this.program,"screenSize")}}class h extends x{constructor(e){super(e,t(c),t(u)),this.screenSize=e.getUniformLocation(this.program,"screenSize"),this.position=e.getUniformLocation(this.program,"position"),this.speed=e.getUniformLocation(this.program,"speed"),this.deltaTime=e.getUniformLocation(this.program,"deltaTime"),this.vertex=e.getAttribLocation(this.program,"vertex"),this.firstMovedParticleIndex=e.getUniformLocation(this.program,"firstMovedParticleIndex"),this.lastMovedParticleIndex=e.getUniformLocation(this.program,"lastMovedParticleIndex")}}class p extends x{constructor(e){super(e,t(f),t(d)),this.screenSize=e.getUniformLocation(this.program,"screenSize"),this.position=e.getUniformLocation(this.program,"position"),this.speed=e.getUniformLocation(this.program,"speed"),this.deltaTime=e.getUniformLocation(this.program,"deltaTime"),this.gravity=e.getUniformLocation(this.program,"gravity"),this.vertex=e.getAttribLocation(this.program,"vertex")}}})),r.register("aAGU0",(function(e,t){e.exports="precision mediump float;\nprecision mediump usampler2D;\n#define GLSLIFY 1\n\n#define MAX_XY_RANGE 65535.0\n#define MAX_SIGNED_XY_RANGE 36863.0\n#define SPEED_RANGE vec2(MAX_SIGNED_XY_RANGE, MAX_SIGNED_XY_RANGE)\n\nuint getUintFromTexture(usampler2D tex, uint index){\n  float findex = float(index);\n  float y = floor(findex / DATA_TEXTURE_SIZE);\n  float x = mod(findex, DATA_TEXTURE_SIZE);\n  vec2 texcoord = (vec2(x, y) + 0.5) / DATA_TEXTURE_SIZE;\n  return texture(tex, texcoord).x;\n}\n\nvec2 unpackXY(uint pack, vec2 range){\n  return vec2(\n    float(pack & 0xffffu),\n    float((pack >> 0x10) & 0xffffu)\n  ) * (range / MAX_XY_RANGE);\n}\n\n// const coordsScale = {x: 0xffff / rootSize.width, y: 0xffff / rootSize.height}\nvec2 unpackSignedXY(uint pack, vec2 range){\n  return (vec2(\n    float((pack & 0xffffu)),\n    float(((pack >> 0x10) & 0xffffu))\n  ) - MAX_SIGNED_XY_RANGE) * (range / MAX_XY_RANGE);\n}\n\nuint packSignedXY(vec2 pack, vec2 range){\n  pack = (pack * (MAX_XY_RANGE / range)) + MAX_SIGNED_XY_RANGE;\n  return (uint(pack.x) & 0xffffu) | ((uint(pack.y) & 0xffffu) << 0x10u);\n}\n\nuint packXY(vec2 pack, vec2 range){\n  pack = pack * (MAX_XY_RANGE / range);\n  return (uint(pack.x) & 0xffffu) | ((uint(pack.y) & 0xffffu) << 0x10u);\n}\n\nvec4 absCoordsIntoScreenCoords(vec2 coords, vec2 screenSize){\n  return vec4(((coords / screenSize) * 2.0) - 1.0, 0, 1);\n}\n\nvec2 getXYFromTexture(usampler2D tex, uint index, vec2 range){\n  return unpackXY(getUintFromTexture(tex, index), range);\n}\n\nuint fragCoordToIndex(vec2 fragCoord){\n  return uint(fragCoord.x) + uint(fragCoord.y * DATA_TEXTURE_SIZE);\n}"})),r.register("6daLX",(function(e,t){e.exports="#define GLSLIFY 1\nout vec4 outColor;\n\nvoid main() {\n\toutColor = vec4(1, 1, 1, 1);\n}"})),r.register("72NEL",(function(e,t){e.exports="#define GLSLIFY 1\nuniform usampler2D positions;\nuniform vec2 coordsScale;\nuniform vec2 screenSize;\nin uint id;\n\nvoid main(){\n  vec2 absCoords = getXYFromTexture(positions, id, screenSize);\n  vec4 screenCoords = absCoordsIntoScreenCoords(absCoords, screenSize);\n\tgl_Position = screenCoords;\n  gl_PointSize = 5.0;\n}\n"})),r.register("htDMP",(function(e,t){e.exports="#define GLSLIFY 1\nin vec4 vertex;\nvoid main() {\n\tgl_Position = vertex;\n}"})),r.register("iRKfn",(function(e,t){e.exports="#define GLSLIFY 1\nuniform usampler2D position;\nuniform usampler2D speed;\nuniform vec2 screenSize;\nuniform float deltaTime;\n\nuniform uint firstMovedParticleIndex;\nuniform uint lastMovedParticleIndex;\n\nout uint newPositionPack;\n\nvoid main() {\n\tvec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;\n\n\tvec2 newPosition;\n\n\tuint index = fragCoordToIndex(gl_FragCoord.xy);\n\tif(index >= firstMovedParticleIndex && index <= lastMovedParticleIndex){\n\t\tnewPosition = screenSize / 2.0;\n\t} else {\n\t\tvec2 particlePosition = unpackXY(texture(position, texcoord).x, screenSize);\n\t\tvec2 particleSpeed = unpackSignedXY(texture(speed, texcoord).x, SPEED_RANGE);\n\n\t\tnewPosition = particlePosition + (particleSpeed * deltaTime);\n\t\t// newPosition = mod(newPosition, screenSize);\n\t\tnewPosition = min(max(newPosition, vec2(0.0, 0.0)), screenSize);\n\t}\n\n\tnewPositionPack = packXY(newPosition, screenSize);\n}"})),r.register("35ZyT",(function(e,t){e.exports="#define GLSLIFY 1\nin vec4 vertex;\nvoid main() {\n\tgl_Position = vertex;\n}"})),r.register("44txf",(function(e,t){e.exports="#define GLSLIFY 1\nuniform usampler2D position;\nuniform usampler2D speed;\nuniform vec2 screenSize;\nuniform float deltaTime;\n\nuniform float gravity;\n\nout uint newSpeedPack;\n\nvoid main() {\n\tvec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;\n\tvec2 particlePosition = unpackXY(texture(position, texcoord).x, screenSize);\n\tvec2 particleSpeed = unpackSignedXY(texture(speed, texcoord).x, SPEED_RANGE);\n\n\tfloat gravityDeltaV = gravity * deltaTime;\n\tvec2 newSpeed = vec2(particleSpeed.x, particleSpeed.y - gravityDeltaV);\n\tif(particlePosition.y == 0.0){\n\t\tnewSpeed.y = -newSpeed.y * 0.5; // jumpyness\n\t}\n\n\tnewSpeedPack = packSignedXY(newSpeed, SPEED_RANGE);\n}"}));
//# sourceMappingURL=particle_toy.9a4f97c9.js.map
