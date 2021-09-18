import {contentSet} from "content_set";
import {TranslatedString} from "types";
import {TranslatedStr} from "widgets/specific/translated_string";

export const Select = contentSet.addWidgetWithParams<{values: {label: TranslatedString, value: string, selected?: boolean}[], name?: string}>(
	(_, opts) => {
		let result = "<select";
		if(opts.name){
			result += ` name="${opts.name}"`
		}
		result += ">";

		for(let i = 0; i < opts.values.length; i++){
			let opt = opts.values[i];
			let optStr = `<option value="${opt.value}"`
			if(opt.selected){
				optStr += ' selected="selected"'
			}
			optStr += `>${TranslatedStr(opt.label)}</option>`
			result += optStr;
		}

		return result + "</select>"
	}
)