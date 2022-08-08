import {contentSet} from "content_set"

export const PageTitle = contentSet.addWidgetWithoutParams((_, body) => `<title>${body}</title>`)