(
function imploderLoader(defs, params, evl) {
    "use strict";
    var req = typeof (require) !== "undefined" ? require : function () { throw new Error("External require() function is not defined! Could not load any external module."); };
    function handleError(e, action) {
        var handler = params.errorHandler;
        if (handler) {
            handler(e, action);
        }
        else {
            console.error((action ? "Error during " + action + ": " : "") + (e.stack || e.message || e));
        }
        throw e;
    }
    // разбираем полученный массив определений
    var renames = {};
    var defMap = {};
    for (var i = 0; i < defs.length; i++) {
        var v = defs[i];
        var m = typeof (v[2]) !== "string" ? v[2] : undefined;
        var def = m ? m : {};
        def.name = v[0];
        def.code = v[v.length - 1];
        if (m && m.altName) {
            renames[m.altName] = def.name;
        }
        def.dependencies = Array.isArray(v[1]) ? v[1] : [];
        defMap[def.name] = def;
    }
    var amd = typeof (define) === "function" && !!define.amd;
    /** функция, которую будут дергать в качестве require изнутри модулей */
    function requireAny(names, onOk, onError) {
        if (!onOk) {
            // дернуты как commonjs, т.е. синхронно с одним именем
            var name_1 = names;
            if (name_1 in defMap) {
                return getProduct(name_1);
            }
            else {
                // тут мы просто надеемся, что человек, который пишет код - не дурак
                // и знает, в каком окружении он будет запускаться
                // и поэтому просто дергаем require как commonjs синхронный require
                return req(name_1);
            }
        }
        else {
            // дернуты как amd
            var callError = function (e) {
                if (onError) {
                    onError(e);
                }
                else {
                    handleError(e);
                }
            };
            try {
                var nameArr = Array.isArray(names) ? names : [names];
                var resultArr_1 = [];
                var nameIndex_1 = {};
                var externalNameArr_1 = nameArr.filter(function (name, index) {
                    nameIndex_1[name] = index;
                    if (name in defMap) {
                        resultArr_1[index] = getProduct(name);
                        return false;
                    }
                    return true;
                });
                if (externalNameArr_1.length === 0) {
                    return onOk.apply(null, resultArr_1);
                }
                else {
                    if (amd) {
                        return req(externalNameArr_1, function (externalResults) {
                            for (var i = 0; i < externalNameArr_1.length; i++) {
                                resultArr_1[nameIndex_1[externalNameArr_1[i]]] = externalResults[i];
                            }
                            onOk.apply(null, resultArr_1);
                        }, onError);
                    }
                    else {
                        // если у нас запросили модули асинхронно, но при этом у нас есть только синрохнный commonjs-овый require - 
                        // то используем его, чего еще делать
                        externalNameArr_1.forEach(function (name) { return resultArr_1[nameIndex_1[name]] = req(name); });
                        onOk.apply(null, resultArr_1);
                    }
                }
            }
            catch (e) {
                callError(e);
            }
        }
    }
    var currentlyDefiningProductMap = {};
    var currentlyDefiningProductSeq = [];
    var products = {};
    function throwCircularDependencyError(name) {
        var str = name;
        for (var i = currentlyDefiningProductSeq.length - 1; i >= 0; i--) {
            var n = currentlyDefiningProductSeq[i];
            str += " <- " + currentlyDefiningProductSeq[i];
            if (n === name)
                break;
        }
        throw new Error("Unresolvable circular dependency detected: " + str);
    }
    function getProduct(name) {
        name = renames[name] || name;
        var meta = defMap[name];
        if (!(name in products)) {
            if (name in currentlyDefiningProductMap) {
                throwCircularDependencyError(name);
            }
            currentlyDefiningProductMap[name] = true;
            currentlyDefiningProductSeq.push(name);
            try {
                var product = {};
                var deps_1 = [product, requireAny];
                meta.dependencies.forEach(function (name) {
                    if (name in renames) {
                        name = renames[name];
                    }
                    var product = products[name];
                    if (product) {
                        deps_1.push(product);
                        return;
                    }
                    var depMeta = defMap[name];
                    if (!depMeta) {
                        throw new Error("Failed to get module \"" + name + "\": no definition is known and no preloaded external module is present.");
                    }
                    deps_1.push(depMeta.arbitraryType || (!depMeta.exports && !depMeta.exportRefs) ? getProduct(name) : getProxy(depMeta));
                });
                var fullCode = meta.code;
                if (meta.nonModule) {
                    fullCode = "function(){" + fullCode + "}";
                }
                fullCode = "'use strict';(" + fullCode + ")\n//# sourceURL=" + meta.name;
                var defFunc = evl(fullCode);
                var returnProduct = defFunc.apply(null, deps_1);
                if (meta.arbitraryType) {
                    product = returnProduct;
                }
                products[name] = product;
            }
            finally {
                delete currentlyDefiningProductMap[name];
                currentlyDefiningProductSeq.pop();
            }
        }
        return products[name];
    }
    var proxies = {};
    function getProxy(def) {
        if (!(def.name in proxies)) {
            var proxy_1 = {};
            getAllExportNames(def).forEach(function (arr) {
                arr.forEach(function (name) {
                    defineProxyProp(def, proxy_1, name);
                });
            });
            proxies[def.name] = proxy_1;
        }
        return proxies[def.name];
    }
    function getAllExportNames(meta, result, noDefault) {
        if (result === void 0) { result = []; }
        if (noDefault === void 0) { noDefault = false; }
        if (meta.exports) {
            if (noDefault) {
                result.push(meta.exports.filter(function (_) { return _ !== "default"; }));
            }
            else {
                result.push(meta.exports);
            }
        }
        if (meta.exportRefs) {
            meta.exportRefs.forEach(function (ref) {
                // тут, теоретически, могла бы возникнуть бесконечная рекурсия
                // но не возникнет, еще при компиляции есть проверка
                if (ref in defMap) {
                    getAllExportNames(defMap[ref], result, true);
                }
                else if (ref in products) {
                    // модуля может не быть, если он внешний и в бандл не вошел
                    result.push(Object.keys(products[ref]));
                }
                else {
                    // такого по идее произойти не должно никогда, т.к. оно упадет раньше
                    // еще на этапе подгрузки внешних модулей
                    throw new Error("External module " + ref + " is not loaded at required time.");
                }
            });
        }
        return result;
    }
    function defineProxyProp(meta, proxy, name) {
        if (proxy.hasOwnProperty(name)) {
            return;
        }
        Object.defineProperty(proxy, name, {
            get: function () { return getProduct(meta.name)[name]; },
            set: function (v) { return getProduct(meta.name)[name] = v; },
            enumerable: true
        });
    }
    function discoverExternalModules(moduleName, result, visited) {
        if (result === void 0) { result = []; }
        if (visited === void 0) { visited = {}; }
        if (moduleName in renames) {
            moduleName = renames[moduleName];
        }
        if (!(moduleName in visited)) {
            visited[moduleName] = true;
            if (moduleName in defMap) {
                defMap[moduleName].dependencies.forEach(function (depName) { return discoverExternalModules(depName, result, visited); });
            }
            else {
                result.push(moduleName);
            }
        }
        return result;
    }
    function afterExternalsLoaded() {
        var mainProduct = getProduct(params.entryPoint.module);
        // инициализируем все модули в бандле, ради сайд-эффектов
        Object.keys(defMap).forEach(function (name) {
            if (!(name in products)) {
                getProduct(name);
            }
        });
        var err = null;
        if (params.entryPoint.function) {
            try {
                mainProduct[params.entryPoint.function].apply(null, params.entryPointArgs || []);
            }
            catch (e) {
                err = e;
            }
        }
        if (err) {
            handleError(err);
        }
        if (typeof (module) === "object" && module.exports) {
            module.exports = mainProduct;
        }
        return mainProduct;
    }
    function start() {
        if (amd) {
            var externalModuleNames_1 = discoverExternalModules(params.entryPoint.module, ["require"]);
            define(externalModuleNames_1, function (require) {
                req = require;
                for (var i = externalModuleNames_1.length; i < arguments.length; i++) {
                    products[externalModuleNames_1[i]] = arguments[i];
                }
                return afterExternalsLoaded();
            });
        }
        else {
            var externalModuleNames_2 = discoverExternalModules(params.entryPoint.module);
            requireAny(externalModuleNames_2, function () {
                for (var i = 0; i < arguments.length; i++) {
                    products[externalModuleNames_2[i]] = arguments[i];
                }
                afterExternalsLoaded();
            });
        }
    }
    start();
})(

[["/client/client_entrypoint",["/client/threejs_decl","/client/graphic_utils","/client/event_listeners"],"function (exports, require, threejs_decl_1, graphic_utils_1, event_listeners_1) {\n    function main() {\n        checkWebglVersion(1);\n        let threeContext = createScene();\n        (0, event_listeners_1.setupEventHandlers)(threeContext);\n        animate(threeContext);\n    }\n    exports.main = main;\n    function checkWebglVersion(version) {\n        if ((0, graphic_utils_1.isWebGLAvailable)(version)) {\n            return;\n        }\n        let container = document.getElementById(\"loading-screen\");\n        if (container) {\n            container.appendChild((0, graphic_utils_1.getWebglErrorElement)(version));\n        }\n        throw new Error(\"No webGL, aborted\");\n    }\n    function createScene() {\n        const scene = new threejs_decl_1.THREE.Scene();\n        const camera = new threejs_decl_1.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\n        camera.position.set(0, 0, 0);\n        camera.lookAt(1, 0, 0);\n        const renderer = new threejs_decl_1.THREE.WebGLRenderer();\n        renderer.setSize(window.innerWidth, window.innerHeight);\n        document.body.appendChild(renderer.domElement);\n        {\n            let geom = new threejs_decl_1.THREE.CylinderGeometry(75, 75, 200, 256);\n            updateUV(geom);\n            let texture = new threejs_decl_1.THREE.TextureLoader().load(\"./img/test_pano.jpg\");\n            let material = new threejs_decl_1.THREE.MeshBasicMaterial({ map: texture, side: threejs_decl_1.THREE.BackSide });\n            let skybox = new threejs_decl_1.THREE.Mesh(geom, material);\n            scene.add(skybox);\n        }\n        return { scene, camera, renderer };\n    }\n    function updateUV(geom) {\n        let pos = geom.attributes.position;\n        let uv = geom.attributes.uv;\n        let norm = geom.attributes.normal;\n        console.log(Object.keys(geom.attributes));\n        for (let i = 0; i < uv.count; i++) {\n            let uvx = uv.getX(i);\n            let uvy = uv.getY(i);\n            let posx = pos.getX(i);\n            let posy = pos.getY(i);\n            let posz = pos.getZ(i);\n            let nx = norm.getX(i);\n            let ny = norm.getY(i);\n            let nz = norm.getZ(i);\n            void `At ${posx},${posy},${posz} UV = ${uvx},${uvy} and normals = ${nx},${ny},${nz}`;\n            if (ny > 0.6 || ny < -0.6) {\n                uv.setX(i, 0);\n                uv.setY(i, 0);\n            }\n        }\n        uv.needsUpdate = true;\n    }\n    function animate(context) {\n        (0, graphic_utils_1.raf)(() => {\n            context.renderer.render(context.scene, context.camera);\n        });\n    }\n}\n"],["/client/event_listeners","function (exports, require) {\n    function setupEventHandlers(context) {\n        let canvas = context.renderer.domElement;\n        let pointerIsLocked = false;\n        let dragX = 0, dragY = 0;\n        function onDragMove(dx, dy) {\n            context.camera.rotation.order = \"ZYX\";\n            context.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, context.camera.rotation.x + (dy / 350)));\n            context.camera.rotation.y += dx / 350;\n            context.camera.rotation.z = 0;\n        }\n        function onTouchMove(evt) {\n            let firstTouch = evt.touches[0];\n            if (!firstTouch) {\n                onTouchEnd();\n                return;\n            }\n            onDragMove(dragX - firstTouch.clientX, dragY - firstTouch.clientY);\n            dragX = firstTouch.clientX;\n            dragY = firstTouch.clientY;\n        }\n        function onMouseMove(evt) {\n            if (pointerIsLocked) {\n                onDragMove(-evt.movementX, -evt.movementY);\n            }\n            else {\n                onDragMove(dragX - evt.clientX, dragY - evt.clientY);\n                dragX = evt.clientX;\n                dragY = evt.clientY;\n            }\n        }\n        function onTouchEnd() {\n            window.removeEventListener(\"touchmove\", onTouchMove);\n            window.removeEventListener(\"touchend\", onTouchEnd);\n        }\n        function onMouseUp() {\n            window.removeEventListener(\"mousemove\", onMouseMove);\n            window.removeEventListener(\"mouseup\", onMouseUp);\n            if (pointerIsLocked) {\n                document.exitPointerLock();\n            }\n        }\n        function installDragListeners(evt) {\n            evt.preventDefault();\n            evt.stopPropagation();\n            if (evt instanceof TouchEvent) {\n                let firstTouch = evt.touches[0];\n                dragX = firstTouch.clientX;\n                dragY = firstTouch.clientY;\n                window.addEventListener(\"touchmove\", onTouchMove);\n                window.addEventListener(\"touchend\", onTouchEnd);\n            }\n            else {\n                dragX = evt.clientX;\n                dragY = evt.clientY;\n                window.addEventListener(\"mousemove\", onMouseMove);\n                window.addEventListener(\"mouseup\", onMouseUp);\n            }\n        }\n        canvas.addEventListener(\"mousedown\", evt => {\n            if (evt.button !== 2) {\n                return;\n            }\n            pointerIsLocked = lockPointer(canvas);\n            installDragListeners(evt);\n        });\n        canvas.addEventListener(\"touchstart\", evt => {\n            installDragListeners(evt);\n        });\n        canvas.addEventListener(\"contextmenu\", evt => {\n            evt.preventDefault();\n            evt.stopPropagation();\n        });\n        document.addEventListener(\"pointerlockchange\", () => {\n            pointerIsLocked = document.pointerLockElement === canvas;\n        }, false);\n    }\n    exports.setupEventHandlers = setupEventHandlers;\n    function lockPointer(canvas) {\n        if (!canvas.requestPointerLock) {\n            return false;\n        }\n        canvas.requestPointerLock();\n        return true;\n    }\n}\n"],["/client/graphic_utils","function (exports, require) {\n    function isWebGLAvailable(version) {\n        try {\n            const canvas = document.createElement(\"canvas\");\n            if (version === 1) {\n                return !!(window.WebGLRenderingContext && (canvas.getContext(\"webgl\") || canvas.getContext('experimental-webgl')));\n            }\n            else {\n                return !!(window.WebGL2RenderingContext && canvas.getContext(\"webgl2\"));\n            }\n        }\n        catch (e) {\n            return false;\n        }\n    }\n    exports.isWebGLAvailable = isWebGLAvailable;\n    function getWebglErrorElement(version) {\n        const names = {\n            1: \"WebGL\",\n            2: \"WebGL 2\"\n        };\n        const contexts = {\n            1: window.WebGLRenderingContext,\n            2: window.WebGL2RenderingContext\n        };\n        const result = document.createElement(\"div\");\n        result.className = \"webgl-error-message\";\n        let target = contexts[version] ? \"graphics card\" : \"browser\";\n        result.textContent = `Your ${target} does not seem to support `;\n        let link = document.createElement(\"a\");\n        link.setAttribute(\"href\", \"http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation\");\n        link.textContent = names[version];\n        result.appendChild(link);\n        return result;\n    }\n    exports.getWebglErrorElement = getWebglErrorElement;\n    function raf(handler) {\n        let lastInvokeTime = Date.now();\n        let stopped = false;\n        let wrappedHandler = () => {\n            if (stopped) {\n                return;\n            }\n            requestAnimationFrame(wrappedHandler);\n            let newNow = Date.now();\n            let diff = newNow - lastInvokeTime;\n            lastInvokeTime = newNow;\n            handler(diff);\n        };\n        requestAnimationFrame(wrappedHandler);\n        return () => stopped = true;\n    }\n    exports.raf = raf;\n}\n"],["/client/threejs_decl","function (exports, require) {\n    exports.THREE = window.THREE;\n}\n"]]
,
{"entryPoint":{"module":"/client/client_entrypoint","function":"main"}},eval);