import {contentSet} from "content_set";
import {Favicon} from "widgets/generic/favicon";
import {LinkTag} from "widgets/generic/link_tag";
import {MetaTag} from "widgets/generic/meta_tag";
import {PageRoot} from "widgets/generic/page_root";
import {PageTitle} from "widgets/generic/page_title";
import {ScriptFileReference} from "widgets/generic/script_file_reference";
import {StyleFileReference} from "widgets/generic/style_file_reference";

/** Base of all the pages. Contains most basic set of resources in head */
export const PageBase = contentSet.addWidgetWithParams<{title: string, description?: string, scripts?: string[]}>(
	(context, opts, body) => {
		return PageRoot({
			head: [
				MetaTag({httpEquiv:"Content-Type", content: "text/html; charset=utf-8"}),
				MetaTag({name: "viewport", content: "width=device-width, initial-scale=1"}),
				Favicon({path: "/img/favicon.png"}),
				!opts.description? null: MetaTag({name: "description", content: opts.description}),
				LinkTag({rel: "canonical", href: `${context.options.preferredProtocol}://${context.options.domain}${context.urlPath}`}),
				PageTitle(opts.title),
				ScriptFileReference({url: "/js/main.js"}),
				StyleFileReference({url: "/css/main.css"}),
				!opts.scripts? null: opts.scripts.map(script => ScriptFileReference({url: script}))
			].filter(x => !!x).join("\n"),
			body
		})
	}
)