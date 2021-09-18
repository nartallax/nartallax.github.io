import {contentSet} from "content_set";

export const LinkTag = contentSet.addWidgetWithParams<{rel: string, href: string, type?: string}>(
	(_, opts) => `<link rel="${opts.rel}" href="${opts.href}"${!opts.type?"":" type=\"" + opts.type + "\""}>`
)