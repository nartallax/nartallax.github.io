function e(e,t,n,r){Object.defineProperty(e,t,{get:n,set:r,enumerable:!0,configurable:!0})}function t(e){return e&&e.__esModule?e.default:e}var n=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{}).parcelRequirebf86;n.register("TmoKT",(function(t,r){e(t.exports,"main",(()=>l));var o=n("5DUDw"),i=n("d4DhX"),a=n("3ekh2"),s=n("hf9LN"),c=n("5udHq"),u=n("dbJCa"),d=n("34KeV");function l(e){const t=document.createElement("canvas"),n=e.getBoundingClientRect();t.setAttribute("width",n.width+""),t.setAttribute("height",n.height+""),t.style.cssText="position: absolute; top: 0; bottom: 0; left: 0; right: 0;",e.appendChild(t);const r=t.getContext("webgl2"),l=function(e,t){const n=new Array(t).fill(0).map(((e,t)=>t)),r=e.createBuffer();if(!r)throw new Error("Cannot create webgl buffer");return e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Uint32Array(n),e.STATIC_DRAW),r}(r,a.particlesCount),m=function(e){const t=e.createBuffer();if(!t)throw new Error("Cannot create webgl buffer");return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW),t}(r),h={x:n.width,y:n.height},y=new(0,a.DataTexturePair)(r,p()),E=new(0,a.DataTexturePair)(r,p()),g=new(0,a.DataTexturePair)(r,p()),T=new(0,a.DataTexturePair)(r,p()),A=new(0,a.DataTextureSingle)(r,p(null,h),h),w=new(0,c.DataShader)(r),R=new(0,c.DrawShader)(r);u.sprays[0]={...u.zeroSpray,x:h.x/4,y:h.y/2,direction:-Math.PI/4,intensity:a.particlesCount/1e4,power:100,spread:Math.PI/16},u.sprays[1]={...u.zeroSpray,x:h.x/2+250,y:150,direction:-Math.PI*(3/4),intensity:a.particlesCount/2e4,power:50,spread:Math.PI/2},d.walls[0]={from:{x:h.x/2+200,y:200},to:{x:h.x/2-500+200,y:700}};const S=[y,E,g,T,A];w.use(),r.uniform2f(w.screenSize,h.x,h.y),r.uniform1i(w.positionX,0),r.uniform1i(w.positionY,1),r.uniform1i(w.speedX,2),r.uniform1i(w.speedY,3),r.uniform1i(w.walls,4),r.uniform1f(w.gravity,9.8),r.uniform1f(w.bounce,.5),(0,u.uploadSprays)(r,w),function(e){for(const r of f)r.remove();f.length=0;const t=10;for(const o of d.walls){const i=(0,d.wallToRect)(o),a=["red","green","blue","yellow"];function n(n,r){const o=document.createElement("div");o.style.cssText=`width:${t}px; height: ${t}px; position: absolute;top:${n.y-t/2}px;left: ${n.x-t/2}px;background-color: ${r}`,e.appendChild(o)}let s=0;for(const c of i)n(c,a[s++])}}(e),(0,d.uploadWalls)(r,A,h);const _=i.GlUtils.makeBindVAO(r);r.bindBuffer(r.ARRAY_BUFFER,m),r.enableVertexAttribArray(w.vertex),r.vertexAttribPointer(w.vertex,2,r.FLOAT,!1,0,0);const v=[y,E];R.use(),r.uniform2f(R.screenSize,h.x,h.y),r.uniform1i(R.positionX,0),r.uniform1i(R.positionY,1);const I=i.GlUtils.makeBindVAO(r);r.bindBuffer(r.ARRAY_BUFFER,l),r.enableVertexAttribArray(R.id),r.vertexAttribIPointer(R.id,1,r.UNSIGNED_INT,0,0);let F=0;const b=new(0,s.FpsCounter);(0,o.cycledRequestAnimationFrame)((e=>{e>250||function(e){b.recordFrame(e);const t=F,o=t+Math.floor(u.particlesMovedPerSecond);F=o,F>=a.particlesCount&&(F=0),function(e,t){try{const n=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,n),t()}finally{e.bindFramebuffer(e.FRAMEBUFFER,null)}}(r,(()=>{w.use(),r.viewport(0,0,a.dataTextureSize,a.dataTextureSize),r.uniform1f(w.deltaTime,e),r.uniform1ui(w.firstMovedParticleIndex,t),r.uniform1ui(w.lastMovedParticleIndex,o),x(r,S),function(e,t){const n=[];for(let r=0;r<t.length;r++){const o=t[r];e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+r,e.TEXTURE_2D,o.receivingTexture,0),n.push(e.COLOR_ATTACHMENT0+r)}e.drawBuffers(n)}(r,S.filter((e=>e instanceof a.DataTexturePair))),r.bindVertexArray(_),r.drawArrays(r.TRIANGLES,0,6)}));for(const e of S)e instanceof a.DataTexturePair&&e.swap();R.use(),r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,n.width,n.height),x(r,v),r.bindVertexArray(I),r.drawArrays(r.POINTS,0,a.particlesCount)}(e/1e3)}))}const f=[];function p(e=null,t={x:a.dataTextureSize,y:a.dataTextureSize}){const n=new Uint32Array(t.x*t.y);if(e)for(let t=0;t<n.length;t++)n[t]=e(t);return n}function x(e,t){for(let n=0;n<t.length;n++){const r=t[n];e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_2D,r.texture)}}})),n.register("5DUDw",(function(t,n){function r(e){let t=!1,n=0;const r=o=>{if(t)return;const i=o-n;n=o,requestAnimationFrame(r),e(i)};return requestAnimationFrame(r),()=>t=!0}e(t.exports,"cycledRequestAnimationFrame",(()=>r))})),n.register("d4DhX",(function(t,n){let r;e(t.exports,"GlUtils",(()=>r)),function(e){function t(e,t,n){let r=null;try{if(r=e.createShader("vertex"===t?e.VERTEX_SHADER:e.FRAGMENT_SHADER),!r)throw new Error("No shader is created of type "+t);e.shaderSource(r,n),e.compileShader(r);const o=e.getShaderParameter(r,e.COMPILE_STATUS),i=e.getShaderInfoLog(r);if(!o)throw console.log(n),new Error("Failed to compile shader of type "+t+": "+i);return i&&console.warn("WebGL "+t+" shader compile log: ",i),r}catch(t){throw e.deleteShader(r),t}}e.getGlContext=function(e){const t=e.getContext("webgl2");if(!t)throw new Error("No webgl2 available.");return t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.disable(t.SCISSOR_TEST),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.STENCIL_TEST),t},e.makeShader=t,e.makeProgram=function(e,n,r){let o=null,i=null,a=null;try{if(o=t(e,"fragment",r),i=t(e,"vertex",n),a=e.createProgram(),!a)throw new Error("No webgl program was created.");e.attachShader(a,o),e.attachShader(a,i),e.linkProgram(a);const s=e.getProgramParameter(a,e.LINK_STATUS),c=e.getProgramInfoLog(a);if(!s)throw new Error("Failed to link program: "+c);return c&&console.warn("WebGL program log: ",c),{program:a,shaders:[o,i]}}catch(t){throw o&&e.deleteShader(o),i&&e.deleteShader(i),a&&e.deleteProgram(a),t}},e.setViewportSizeByCanvas=function(e,t){const n=t.clientWidth*window.devicePixelRatio,r=t.clientHeight*window.devicePixelRatio;return t.width=n,t.height=r,e.viewport(0,0,n,r),{width:n,height:r}},e.loadTexture=function(e,t){return new Promise(((n,r)=>{const o=new Image;o.onload=()=>{try{const t=function(e){const t=e.createTexture();if(!t)throw new Error("No texture was created.");return e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),t}(e);e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,o),e.generateMipmap(e.TEXTURE_2D),n(t)}catch(e){r(e)}},o.onerror=()=>r(new Error("Failed to load texture: "+t)),o.src=t}))};const n=[0,0,1,0,1,1,0,1],r=[0,1,2,0,2,3];function o(e,t){const n=e.createBuffer();if(!n)throw new Error("Buffer was not created.");return e.bindBuffer(t,n),n}e.makeSquareVertexBuffer=function(e){const t=o(e,e.ARRAY_BUFFER);return e.bufferData(e.ARRAY_BUFFER,new Float32Array(n),e.STATIC_DRAW),t},e.makeSquareIndexBuffer=function(e){const t=o(e,e.ELEMENT_ARRAY_BUFFER);return e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(r),e.STATIC_DRAW),t},e.makeBindBuffer=o,e.makeBindVAO=function(e){const t=e.createVertexArray();if(!t)throw new Error("VAO was not created.");return e.bindVertexArray(t),t}}(r||(r={}))})),n.register("3ekh2",(function(t,n){e(t.exports,"particlesCount",(()=>r)),e(t.exports,"dataTextureSize",(()=>o)),e(t.exports,"angleRange",(()=>i)),e(t.exports,"encodeFloat",(()=>a)),e(t.exports,"DataTextureSingle",(()=>u)),e(t.exports,"DataTexturePair",(()=>d));const r=128e3,o=2**Math.ceil(Math.log2(Math.ceil(Math.sqrt(r)))),i=3600;function a(e,t){return Math.floor(e/t*2147483647)+2147483647}function s(e,t,n){const r=e.createTexture();if(!r)throw new Error("No texture was created");return c(e,r,t,n),r}function c(e,t,n,r){e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.R32UI,r.x,r.y,0,e.RED_INTEGER,e.UNSIGNED_INT,n,0),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}class u{constructor(e,t,n={x:o,y:o}){this.size=n,this._texture=s(e,t,n)}get texture(){return this._texture}get receivingTexture(){return this._texture}upload(e,t){c(e,this.texture,t,this.size)}}class d{aIsActive=!0;constructor(e,t,n={x:o,y:o}){this.a=s(e,t,n),this.b=s(e,t,n)}get texture(){return this.aIsActive?this.a:this.b}get receivingTexture(){return this.aIsActive?this.b:this.a}swap(){this.aIsActive=!this.aIsActive}}})),n.register("hf9LN",(function(t,n){e(t.exports,"FpsCounter",(()=>r));class r{constructor(e=3){this.reportFreq=e,this.count=0,this.time=0}recordFrame(e){for(this.time+=e,this.count++;this.time>this.reportFreq;)this.time-=this.reportFreq,console.log("FPS: "+this.count/this.reportFreq),this.count=0}}})),n.register("5udHq",(function(r,o){e(r.exports,"DrawShader",(()=>x)),e(r.exports,"DataShader",(()=>m));var i=n("aAGU0"),a=n("6daLX"),s=n("72NEL"),c=n("5W6s1"),u=n("8qbFu"),d=n("d4DhX"),l=n("3ekh2");function f(e){return`#version 300 es\n#define DATA_TEXTURE_SIZE ${l.dataTextureSize}.0\n`+t(i)+"\n"+e}class p{constructor(e,t,n){this.gl=e;const{program:r,shaders:o}=d.GlUtils.makeProgram(e,f(t),f(n));this.program=r,this.shaders=o}use(){this.gl.useProgram(this.program)}delete(){this.gl.deleteProgram(this.program);for(const e of this.shaders)this.gl.deleteShader(e)}}class x extends p{constructor(e){super(e,t(s),t(a)),this.positionX=e.getUniformLocation(this.program,"positionX"),this.positionY=e.getUniformLocation(this.program,"positionY"),this.id=e.getAttribLocation(this.program,"id"),this.screenSize=e.getUniformLocation(this.program,"screenSize")}}class m extends p{constructor(e){super(e,t(c),t(u)),this.screenSize=e.getUniformLocation(this.program,"screenSize"),this.positionX=e.getUniformLocation(this.program,"positionX"),this.positionY=e.getUniformLocation(this.program,"positionY"),this.speedX=e.getUniformLocation(this.program,"speedX"),this.speedY=e.getUniformLocation(this.program,"speedY"),this.deltaTime=e.getUniformLocation(this.program,"deltaTime"),this.vertex=e.getAttribLocation(this.program,"vertex"),this.firstMovedParticleIndex=e.getUniformLocation(this.program,"firstMovedParticleIndex"),this.lastMovedParticleIndex=e.getUniformLocation(this.program,"lastMovedParticleIndex"),this.gravity=e.getUniformLocation(this.program,"gravity"),this.bounce=e.getUniformLocation(this.program,"bounce"),this.sprayX=e.getUniformLocation(this.program,"sprayX"),this.sprayY=e.getUniformLocation(this.program,"sprayY"),this.sprayDirection=e.getUniformLocation(this.program,"sprayDirection"),this.sprayPower=e.getUniformLocation(this.program,"sprayPower"),this.spraySpread=e.getUniformLocation(this.program,"spraySpread"),this.sprayIntensity=e.getUniformLocation(this.program,"sprayIntensity"),this.walls=e.getUniformLocation(this.program,"walls")}}})),n.register("aAGU0",(function(e,t){e.exports="precision mediump float;\nprecision mediump usampler2D;\n#define GLSLIFY 1\n\n#define SPEED_RANGE 5000.0\n#define ANGLE_RANGE 3600.0\n#define INT_RANGEU 0x7fffffffu\n#define INT_RANGEF float(INT_RANGEU)\n#define PI 3.14159265358979323846\n\nfloat decodeFloat(uint value, float range){\n  return (float(value) / INT_RANGEF) * range;\n}\n\nuint encodeFloat(float value, float range){\n  return uint(((value / range) * INT_RANGEF) + INT_RANGEF);\n}\n\nuvec2 getUintPairByCoords(usampler2D texX, usampler2D texY, vec2 coords){\n  return uvec2(uint(texture(texX, coords).x), uint(texture(texY, coords).x));\n}\n\nuvec2 getUintPairByIndex(usampler2D texX, usampler2D texY, uint index){\n  float findex = float(index);\n  float y = floor(findex / DATA_TEXTURE_SIZE);\n  float x = mod(findex, DATA_TEXTURE_SIZE);\n  vec2 texcoord = (vec2(x, y) + 0.5) / DATA_TEXTURE_SIZE;\n  return uvec2(texture(texX, texcoord).x, texture(texY, texcoord).x);\n}\n\n#define getFloatPairByCoords(texX, texY, coords, range) (((vec2(texture(texX, coords).x, texture(texY, coords).x) - INT_RANGEF) / INT_RANGEF) * range)\n#define getFloatPairByIndex(texX, texY, index, range) (((vec2(getUintPairByIndex(texX, texY, index)) - INT_RANGEF) / INT_RANGEF) * range)\n\nvec4 absCoordsIntoScreenCoords(vec2 coords, vec2 screenSize){\n  return vec4(((coords / screenSize) * 2.0) - 1.0, 0, 1);\n}\n\nuint fragCoordToIndex(vec2 fragCoord){\n  return uint(fragCoord.x) + uint(fragCoord.y * DATA_TEXTURE_SIZE);\n}\n\n// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.\nuint hash(uint x) {\n    x += ( x << 10u );\n    x ^= ( x >>  6u );\n    x += ( x <<  3u );\n    x ^= ( x >> 11u );\n    x += ( x << 15u );\n    return x;\n}\n\n#define normalizeRandomUint(value) float(value % 0xffffffu) / float(0xffffffu)"})),n.register("6daLX",(function(e,t){e.exports="#define GLSLIFY 1\nout vec4 outColor;\n\nvoid main() {\n\toutColor = vec4(1, 1, 1, 1);\n}"})),n.register("72NEL",(function(e,t){e.exports="#define GLSLIFY 1\nuniform usampler2D positionX;\nuniform usampler2D positionY;\nuniform vec2 screenSize;\nin uint id;\n\nvoid main(){\n  vec2 absCoords = getFloatPairByIndex(positionX, positionY, id, screenSize);\n  vec4 screenCoords = absCoordsIntoScreenCoords(absCoords, screenSize);\n\tgl_Position = screenCoords;\n  gl_PointSize = 1.0;\n}\n"})),n.register("5W6s1",(function(e,t){e.exports="#define GLSLIFY 1\nin vec4 vertex;\nvoid main() {\n\tgl_Position = vertex;\n}"})),n.register("8qbFu",(function(e,t){e.exports="#define GLSLIFY 1\nuniform vec2 screenSize;\nuniform float deltaTime;\n\nuniform uint firstMovedParticleIndex;\nuniform uint lastMovedParticleIndex;\n\nuniform float gravity;\nuniform float bounce;\nuniform vec4 sprayX;\nuniform vec4 sprayY;\nuniform vec4 sprayDirection;\nuniform vec4 sprayPower;\nuniform vec4 spraySpread;\nuniform uvec4 sprayIntensity;\n\nuniform usampler2D positionX;\nuniform usampler2D positionY;\nuniform usampler2D speedX;\nuniform usampler2D speedY;\nuniform usampler2D walls;\n\nlayout(location = 0) out uint outPosX;\nlayout(location = 1) out uint outPosY;\nlayout(location = 2) out uint outSpeedX;\nlayout(location = 3) out uint outSpeedY;\n\n#define moveBySpray(sprayIndex) moveBySprayFn(position, speed, index, vec2(sprayX[sprayIndex], screenSize.y - sprayY[sprayIndex]), sprayDirection[sprayIndex], sprayPower[sprayIndex], spraySpread[sprayIndex])\n\nvoid moveBySprayFn(inout vec2 position, inout vec2 speed, uint index, vec2 sprayPosition, float direction, float power, float spread){\n\tposition = sprayPosition;\n\tuint rnd = hash(index);\n\tdirection += spread * (normalizeRandomUint(rnd) - 0.5);\n\tpower += (power / 10.0) * (normalizeRandomUint(rnd * 134u) - 0.5);\n\tspeed = vec2(cos(direction) * power, sin(direction) * power);\n}\n\nvoid main(){\n\tvec2 texcoord = gl_FragCoord.xy / DATA_TEXTURE_SIZE;\n\tuint index = fragCoordToIndex(gl_FragCoord.xy);\n\n\tvec2 position = getFloatPairByCoords(positionX, positionY, texcoord, screenSize);\n\tvec2 speed = getFloatPairByCoords(speedX, speedY, texcoord, SPEED_RANGE);\n\n\tuint sprayOffset = index - firstMovedParticleIndex;\n\tif(sprayOffset >= 0u){\n\t\tif(sprayOffset < sprayIntensity[0]){\n\t\t\tmoveBySpray(0);\n\t\t} else {\n\t\t\tsprayOffset -= sprayIntensity[0];\n\t\t\tif(sprayOffset < sprayIntensity[1]){\n\t\t\t\tmoveBySpray(1);\n\t\t\t} else {\n\t\t\t\tsprayOffset -= sprayIntensity[1];\n\t\t\t\tif(sprayOffset < sprayIntensity[2]){\n\t\t\t\t\tmoveBySpray(2);\n\t\t\t\t} else {\n\t\t\t\t\tsprayOffset -= sprayIntensity[2];\n\t\t\t\t\tif(sprayOffset < sprayIntensity[3]){\n\t\t\t\t\t\tmoveBySpray(3);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\tposition = position + (speed * deltaTime);\n\tif(position.x < 0.0){\n\t\tposition.x = 0.01;\n\t\tspeed.x = -speed.x * bounce;\n\t} else if(position.x > screenSize.x){\n\t\tposition.x = screenSize.x - 0.01;\n\t\tspeed.x = -speed.x * bounce;\n\t}\n\tif(position.y < 0.0){\n\t\tposition.y = 0.01;\n\t\tspeed.y = -speed.y * bounce;\n\t} else if(position.y > screenSize.y){\n\t\tposition.y = screenSize.y - 0.01;\n\t\tspeed.y = -speed.y * bounce;\n\t}\n\n\tspeed.y -= gravity * deltaTime;\n\n\tvec2 wallPos = vec2(position.x, screenSize.y - position.y) / screenSize;\n\tuint wall = texture(walls, wallPos).x;\n\tif(wall != 0u){\n\t\tfloat speedAbs = sqrt(speed.x * speed.x + speed.y * speed.y);\n\t\tfloat speedDirection = atan(speed.y, speed.x) + PI;\n\t\tfloat wallNormal = decodeFloat(wall, ANGLE_RANGE) + PI;\n\t\t// wallDir = -45deg, speedDir = 0deg, diff = -45deg, dir = 90deg\n\n\t\t// rotating coord system; that way wall normal will always be 0\n\t\tspeedDirection -= wallNormal;\n\t\tspeedDirection = PI - speedDirection;\n\t\t// speedAbs *= bounce; // FIXME: it's not working that way!\n\t\tspeed.x = speedAbs * cos(speedDirection);\n\t\tspeed.y = speedAbs * sin(speedDirection);\n\t\t// this is (bad) attempt to avert a problem\n\t\t// if a particle don't have enough speed to leave the wall in time, it's getting caught in the wall\n\t\t// and moves in weird pattern\n\t\t// so we move particle a little and hope that it won't be that bad\n\t\t// (it's working, but it is also not a proper solution)\n\t\tposition += (speed * deltaTime * 2.0) / max(bounce, 0.1);\n\t}\n\t\n\toutPosX = encodeFloat(position.x, screenSize.x);\n    outPosY = encodeFloat(position.y, screenSize.y);\n    outSpeedX = encodeFloat(speed.x, SPEED_RANGE);\n    outSpeedY = encodeFloat(speed.y, SPEED_RANGE);\n}"})),n.register("dbJCa",(function(t,n){e(t.exports,"zeroSpray",(()=>r)),e(t.exports,"sprays",(()=>o)),e(t.exports,"particlesMovedPerSecond",(()=>a)),e(t.exports,"uploadSprays",(()=>s));const r={x:0,y:0,direction:0,power:0,spread:0,intensity:0},o=[{...r},{...r},{...r},{...r}];function i(e,t,n){e.uniform4f(t,o[0][n],o[1][n],o[2][n],o[3][n])}let a=0;function s(e,t){a=o.filter((e=>0!==e.x&&0!==e.y)).map((e=>e.intensity)).reduce(((e,t)=>e+t),0),i(e,t.sprayX,"x"),i(e,t.sprayY,"y"),i(e,t.sprayDirection,"direction"),i(e,t.sprayPower,"power"),i(e,t.spraySpread,"spread"),function(e,t,n){e.uniform4ui(t,o[0][n],o[1][n],o[2][n],o[3][n])}(e,t.sprayIntensity,"intensity")}})),n.register("34KeV",(function(t,r){e(t.exports,"walls",(()=>i)),e(t.exports,"wallToRect",(()=>s)),e(t.exports,"uploadWalls",(()=>d));var o=n("3ekh2");const i=[];function a(e){const t=e.from.y-e.to.y,n=e.from.x-e.to.x;return Math.atan2(t,n)}function s(e){const t=a(e);console.log("wall angle: "+t);const n=Math.cos(t+Math.PI/2),r=Math.sin(t+Math.PI/2),o=25;return[{x:e.from.x-o*n,y:e.from.y-o*r},{x:e.from.x+o*n,y:e.from.y+o*r},{x:e.to.x+o*n,y:e.to.y+o*r},{x:e.to.x-o*n,y:e.to.y-o*r}]}function c(e,t,n){let r=a(n);0===r&&(r=.1),console.log(n),function(e,t,n,r){let o=0;const i=Math.floor(n.map((({y:e})=>e)).reduce(((e,t)=>Math.min(e,t)),Number.MAX_SAFE_INTEGER)),a=Math.floor(n.map((({y:e})=>e)).reduce(((e,t)=>Math.max(e,t)),0)),s=[new u(n[0],n[1]),new u(n[1],n[2]),new u(n[2],n[3]),new u(n[3],n[0])];let c=i*t;for(let u=i;u<=a;u++){let i=Number.MAX_SAFE_INTEGER,a=-Number.MAX_SAFE_INTEGER;for(const e of s){const t=e.xByY(u);null!==t&&(i=Math.min(i,t),a=Math.max(a,t))}if(i===Number.MAX_SAFE_INTEGER||a===-Number.MAX_SAFE_INTEGER)throw new Error(`Boundaries not found for y = ${u}! Rect is ${JSON.stringify(n)}, minX = ${i}, maxX = ${a}, lines are ${JSON.stringify(s)}`);for(let t=i;t<=a;t++)o++,e[c+t]=r;c+=t}console.log(`Filled ${o} cells with ${r} (${JSON.stringify(n)})`)}(e,t,s(n),(0,o.encodeFloat)(r,o.angleRange))}class u{constructor(e,t){const n=e.x-t.x,r=e.y-t.y;this.k=n/r,this.offset=e.x-e.y*this.k,this.lowY=Math.floor(Math.min(e.y,t.y)),this.highY=Math.floor(Math.max(e.y,t.y))}xByY(e){return e<this.lowY||e>this.highY?null:Math.floor(this.offset+this.k*e)}}function d(e,t,n){const r=new Uint32Array(n.x*n.y);i.forEach((e=>{c(r,n.x,e)})),t.upload(e,r)}}));
//# sourceMappingURL=particle_toy.8afdab16.js.map