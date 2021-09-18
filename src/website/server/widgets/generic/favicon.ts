import {contentSet} from "content_set";
import {LinkTag} from "./link_tag";

export const Favicon = contentSet.addWidgetWithParams<{path: string}>(
	(context, opts) => {
		let img = context.getImageInfo(opts.path);
		return LinkTag({type: "image/" + img.format, href: opts.path, rel: "icon"})
	}
)