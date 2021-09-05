import {contentSet} from "content_set";

export const pageRoot = contentSet.addWidget<{head: string, body: string}>((_, params) => {
	return `<!DOCTYPE html>
<html>
	<head>${params.head}</head>
	<body>${params.body}</body>
</html>`
})