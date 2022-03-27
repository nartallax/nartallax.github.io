import {contentSet} from "content_set"

export const PageRoot = contentSet.addWidgetWithParams<{head: string, body: string, lang?: string}>((_, params) => {
	return `<!DOCTYPE html>
<html${!params.lang ? "" : " lang=" + JSON.stringify(params.lang)}>
	<head>${params.head}</head>
	<body>${params.body}</body>
</html>`
})