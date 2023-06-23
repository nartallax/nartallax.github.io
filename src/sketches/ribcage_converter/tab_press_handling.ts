/** This function handles press of Tab key in input field that is expected to behave like most IDEs do
 * (insert tab symbol, add/remove paddings, handle multiple line selection etc)
 * @param value input.value
 * @param start input.selectionStart
 * @param end input.selectionEnd
 * @param shiftHold keyboardEvent.shift
 * @returns [newValue, newStart, newEnd] */
export function handleTabPress(value: string, start: number, end: number, shiftHold: boolean): [newValue: string, newStart: number, newEnd: number] {
	if(start === end){
		const [newValue, newPos] = handleTabPressWithoutSelection(value, start, shiftHold)
		return [newValue, newPos, newPos]
	} else {
		return handleTabPressWithSelection(value, start, end, shiftHold)
	}
}

function handleTabPressWithoutSelection(value: string, pos: number, shiftHold: boolean): [string, number] {
	if(!shiftHold){
		// just insert tab inplace like a symbol
		return [
			value.substring(0, pos) + "\t" + value.substring(pos),
			pos + 1
		]
	} else {
		// should reuse code about handling with selection, that's just more specific case of that code
		const lines = value.split("\n")
		let currentLineEnd = lines[0]!.length
		let i = 0
		while(currentLineEnd < pos && ++i < lines.length){
			currentLineEnd += lines[i]!.length + 1 // +1 for newline
		}
		let selectionShift = 0
		if(i < lines.length){
			let l = lines[i]!
			if(l.startsWith("\t") || l.startsWith(" ")){
				l = l.substring(1)
				lines[i] = l
				if(pos + l.length !== currentLineEnd - 1){ // line start
					selectionShift = 1
				}
			}
		}

		return [lines.join("\n"), pos - selectionShift]
	}
}

function handleTabPressWithSelection(value: string, start: number, end: number, shiftHold: boolean): [string, number, number] {
	const lines = value.split("\n")
	let currentLineEnd = lines[0]!.length
	let currentLineStart = 0
	let i = 0

	while(currentLineEnd < start && i < lines.length){
		currentLineStart += lines[i]!.length + 1
		i++
		currentLineEnd += (lines[i]?.length ?? 0) + 1
	}

	let firstLine = true
	let shouldMoveStart = false
	let tabsInserted = 0
	while(currentLineStart <= end && i < lines.length){
		let l = lines[i]!
		if(shiftHold){
			if(l.startsWith("\t") || l.startsWith(" ")){
				l = l.substring(1)
				tabsInserted--
				if(firstLine){
					shouldMoveStart = currentLineStart !== start
				}
			}
		} else {
			tabsInserted++
			l = "\t" + lines[i]!
			if(firstLine){
				shouldMoveStart = true
			}
		}
		currentLineStart += lines[i]!.length + 1
		lines[i] = l
		i++
		currentLineEnd += (lines[i]?.length ?? 0) + 1
		firstLine = false
	}

	return [
		lines.join("\n"),
		start + (!shouldMoveStart ? 0 : shiftHold ? -1 : 1),
		end + tabsInserted
	]
}