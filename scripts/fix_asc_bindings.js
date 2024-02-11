#!/usr/bin/env node

/*
This file exists because default AssemblyScript bindings suck, for several reasons:
1. no support for instantiateStreaming
2. they are just straight out broken sometimes (getting `exports` from wrong object)
3. .d.ts file is inconsistent with what .js file expects/can do (`imports` can be optional)
But we are still bound to use them, because they are otherwise useful (take for instance array conversion back and forth)

This script fixes them.

Usage: ./fix_asc_bindings.js ./src/sketches/random_rhombus_tilings/wasm/rhombus_randomiser
*/

const Fs = require("fs")

function fixJs(basePath) {
	const jsPath = basePath + ".js"
	let js = Fs.readFileSync(jsPath, "utf-8")
	js = js.replace(
		/await WebAssembly\.instantiate\(module, adaptedImports\)/,
		"(await WebAssembly.instantiateStreaming(module, adaptedImports)).instance"
	)
	Fs.writeFileSync(jsPath, js, "utf-8")
}

function fixDts(basePath) {
	const dtsPath = basePath + ".d.ts"
	// export declare function instantiate(module: WebAssembly.Module, imports:
	let dts = Fs.readFileSync(dtsPath, "utf-8")
	dts = dts.replace(
		/export declare function instantiate\(module: WebAssembly\.Module, imports:/,
		"export declare function instantiate(source: Response | PromiseLike<Response>, imports?:"
	)
	Fs.writeFileSync(dtsPath, dts, "utf-8")
}

const basePath = process.argv[2]
fixJs(basePath)
fixDts(basePath)