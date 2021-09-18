import {contentSet} from "content_set";
import {TranslatedString} from "types";

export const TranslatedStr = contentSet.addWidgetWithParams<TranslatedString>(
	(context, opts) => opts[context.pageParams.lang]
)