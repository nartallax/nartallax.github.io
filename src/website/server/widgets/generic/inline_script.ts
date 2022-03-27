import {contentSet} from "content_set"

export const InlineScript = contentSet.addWidgetWithParams<{code: string}>(
	(_, {code}) => {
		let escapedCode = code.replace(/<\/script/g, "<\\/script")
		return `<script>${escapedCode}</script>`
	}
)