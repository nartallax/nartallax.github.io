import * as TS from "typescript"

let currentFile: TS.SourceFile | undefined = undefined

export function convertTypescriptToRibcage(input: string): string {
	try {
		currentFile = TS.createSourceFile("input.ts", input, TS.ScriptTarget.Latest)
		return currentFile.getChildren().map(node => handleNode(node, "")).join("\n")
	} finally {
		currentFile = undefined
	}

}

function handleNode(node: TS.Node, tabs: string): string {
	if(TS.isInterfaceDeclaration(node)){
		if((node.typeParameters?.length ?? 0) > 0){
			return "/* Generic arguments are not supported yet */"
		}
		const name = node.name
		const props = partitionProps(node.members)
		const exported = haveModifier(node, TS.SyntaxKind.ExportKeyword)
		let valueCode = buildRcStructCall(props, tabs)
		if(node.heritageClauses && node.heritageClauses.length > 0){
			const types = node.heritageClauses.map(x => x.types).flat().map(x => handleNode(x, tabs + "\t"))
			valueCode = `RC.intersection([${types.join(", ")}, ${valueCode}])`
		}
		const valueDecl = `${exported ? "export " : ""}const ${name.text} = ${valueCode}`
		const typeDecl = `${exported ? "export " : ""}type ${name.text} = RC.Value<typeof ${name.text}>`
		return typeDecl + "\n" + tabs + valueDecl
	} else if(TS.isTypeAliasDeclaration(node)){
		return "type!"
	} else if(TS.isPropertySignature(node)){
		if(!node.type){
			return "/* no type? */"
		}
		return handleNode(node.type, tabs)
	} else if(TS.isTypeReferenceNode(node)){
		return node.typeName.getText(currentFile)
	} else if(TS.isUnionTypeNode(node)){
		return `RC.union([\n${tabs}\t${node.types.map(node => handleNode(node, tabs + "\t")).join(",\n" + tabs + "\t")}\n${tabs}])`
	} else if(TS.isLiteralTypeNode(node)){
		let text = node.getText(currentFile)
		if(text !== "null" && text !== "undefined"){
			text += " as const"
		}
		return `RC.constant(${text})`
	} else if(TS.isExpressionWithTypeArguments(node)){
		return handleNode(node.expression, tabs)
	} else {
		switch(node.kind){
			case TS.SyntaxKind.Identifier: return node.getText(currentFile)
			case TS.SyntaxKind.NumberKeyword: return "RC.number()"
			case TS.SyntaxKind.StringKeyword: return "RC.string()"
			case TS.SyntaxKind.BooleanKeyword: return "RC.bool()"
			case TS.SyntaxKind.SyntaxList: return node.getChildren().map(node => handleNode(node, tabs)).join("\n" + tabs)
			case TS.SyntaxKind.EndOfFileToken: return ""
			default: return `/* Unsupported syntax kind: ${TS.SyntaxKind[node.kind]} */`
		}
	}

}

function buildRcStructCall(props: PartitionedProps, tabs: string): string {
	let builderName = "struct"
	let propBuilder = buildStructPropsFull
	if(props.opt.length === 0 && props.roOpt.length === 0){
		if(props.ro.length === 0){
			if(props.normal.length === 0){
				propBuilder = buildStructPropsEmpty
			} else {
				propBuilder = buildStructPropsSimple
			}
		} else if(props.normal.length === 0){
			builderName = "roStruct"
			propBuilder = buildStructPropsSimple
		}
	}
	return `RC.${builderName}(${propBuilder(props, tabs)})`
}

function buildStructPropsSimple(props: PartitionedProps, tabs: string): string {
	const arr = props.normal.length > 0 ? props.normal : props.ro
	return buildStructPropsFromArray(arr, tabs)
}

function buildStructPropsEmpty() {
	return "{}"
}

function buildStructPropsFromArray(arr: readonly TS.TypeElement[], tabs: string): string {
	const list = arr.map(prop => {
		const name = prop.name
		const nameStr = !name ? "/* no name? */" : name.getText(currentFile)
		return nameStr + ": " + handleNode(prop, tabs + "\t")
	}).join(",\n" + tabs + "\t")
	return `{\n${tabs}\t${list}\n${tabs}}`
}

function buildStructPropsFull(props: PartitionedProps, tabs: string): string {
	const partsCount = (props.ro.length === 0 ? 0 : 1)
		+ (props.roOpt.length === 0 ? 0 : 1)
		+ (props.opt.length === 0 ? 0 : 1)
		+ (props.normal.length === 0 ? 0 : 1)
	const partTabs = partsCount < 2 ? tabs : tabs + "\t"
	const parts = [
		props.ro.length === 0 ? "" : "ro: " + buildStructPropsFromArray(props.ro, partTabs),
		props.roOpt.length === 0 ? "" : "roOpt: " + buildStructPropsFromArray(props.roOpt, partTabs),
		props.normal.length === 0 ? "" : "normal: " + buildStructPropsFromArray(props.normal, partTabs),
		props.opt.length === 0 ? "" : "opt: " + buildStructPropsFromArray(props.opt, partTabs)
	].filter(x => !!x)
	let body: string
	if(partsCount === 1){
		body = parts[0]!
	} else {
		body = "\n" + tabs + "\t" + parts.join(",\n" + tabs + "\t") + "\n" + tabs
	}

	return `RC.structFields({${body}})`
}

function haveModifier(node: TS.HasModifiers, modifier: TS.SyntaxKind): boolean {
	const mods = TS.getModifiers(node)
	if(!mods){
		return false
	}
	return !!mods.find(x => x.kind === modifier)
}

type PartitionedProps = {normal: TS.TypeElement[], ro: TS.TypeElement[], roOpt: TS.TypeElement[], opt: TS.TypeElement[]}
function partitionProps(props: TS.NodeArray<TS.TypeElement>): PartitionedProps {
	const result: PartitionedProps = {normal: [], ro: [], roOpt: [], opt: []}
	for(const prop of props){
		const opt = !!prop.questionToken
		let ro = false
		if(TS.canHaveModifiers(prop)){
			ro = haveModifier(prop, TS.SyntaxKind.ReadonlyKeyword)
		}
		result[opt ? ro ? "roOpt" : "opt" : ro ? "ro" : "normal"].push(prop)
	}
	return result
}