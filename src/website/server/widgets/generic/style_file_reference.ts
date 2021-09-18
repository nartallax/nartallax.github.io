import {contentSet} from "content_set";

export const StyleFileReference = contentSet.addWidgetWithParams<{url:string}>((context, {url}) => {
	if(context.isRelativeUrl(url) && !context.urlPointsToCssFile(url)){
		throw new Error(`Expected ${url} to point to CSS file, but it's not.`)
	}
	return `<link rel="stylesheet" href="${url}">`
});