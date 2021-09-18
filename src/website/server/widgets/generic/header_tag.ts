import {contentSet} from "content_set";

export const HeaderTag = contentSet.addWidgetWithParams<{level: 1|2|3|4|5|6, class?: string, attrs?:{[k: string]: string}}>(
	(_, opts, body) => {
		let result = "<h" + opts.level;
		if(opts && opts.class){
			result += ` class="${opts.class}"`
		}
		if(opts && opts.attrs){
			for(let k in opts.attrs){
				result += ` ${k}="${opts.attrs[k]}"`
			}
		}
		return result + ">" + body + "</h" + opts.level + ">";
	}
)