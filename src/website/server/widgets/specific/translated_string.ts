import {contentSet} from "content_set"
import {TranslatedString} from "website_common"

export const TranslatedStr = contentSet.addWidgetWithParams<TranslatedString>(
	(context, opts) => opts[context.pageParams.lang]
)