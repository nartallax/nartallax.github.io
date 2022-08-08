import {contentSet} from "content_set"

export const Div = contentSet.addWidgetWithOptionalParams<{class?: string, attrs?: {[k: string]: string}}>(
	(_, opts, body) => {
		let result = "<div"
		if(opts && opts.class){
			result += ` class="${opts.class}"`
		}
		if(opts && opts.attrs){
			for(let k in opts.attrs){
				result += ` ${k}="${opts.attrs[k]}"`
			}
		}
		return body ? result + ">" + body + "</div>" : "/>"
	}
)