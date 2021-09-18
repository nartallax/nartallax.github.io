import {contentSet} from "content_set";

export const MetaTag = contentSet.addWidgetWithParams<{name?: string, httpEquiv?: string, content: string}>(
	(_, opts) => {
		let result = "<meta "
		if(opts.name){
			result += `name="${opts.name}" `
		}
		if(opts.httpEquiv){
			result += `http-equiv="${opts.httpEquiv}" `
		}
		result += `content="${opts.content}">`
		return result;
	}
)