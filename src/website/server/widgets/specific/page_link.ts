import {contentSet} from "content_set";

export const PageLink = contentSet.addWidgetWithParams<{href: string, class?: string, attrs?:{[k: string]: string}}>(
	(context, opts, body) => {
		if(!context.urlPointsToPage(opts.href)){
			throw new Error("Href " + opts.href + " is expected to point to page, but it's not.");
		}
		if(context.isRelativeUrl(opts.href)){
			opts.href = context.resolveUrlPath(opts.href)
		}
		let result = `<a href="${opts.href}"`;
		if(opts.class){
			result += ` class="${opts.class}"`
		}
		if(opts && opts.attrs){
			for(let k in opts.attrs){
				result += ` ${k}="${opts.attrs[k]}"`
			}
		}
		return result + ">" + body + "</a>";
	}
)