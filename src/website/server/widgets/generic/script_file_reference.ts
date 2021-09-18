import {contentSet} from "content_set";

export const ScriptFileReference = contentSet.addWidgetWithParams<{url: string, asyncType?: "async" | "defer" | "none"}>(
	(context, {url, asyncType}) => {
		if(context.isRelativeUrl(url) && !context.urlPointsToJsFile(url)){
			throw new Error(`Expected ${url} to point to JS file, but it's not.`)
		}
		return `<script src="${url}" ${asyncType || "async"}></script>`;
	}
)