import {contentSet} from "content_set"

export const Picture = contentSet.addWidgetWithParams<{src: string, alt: string}>((context, opts) => {
	if(!context.urlPointsToImage(opts.src)){
		throw new Error(`Expected url path ${opts.src} to point to image, but it's not.`)
	}

	let webpPart = ""
	if(context.hasWebp && context.isRelativeUrl(opts.src)){
		let webpPath = context.getImageWebpUrlPath(opts.src)
		webpPart = `<source type="image/webp" srcset="${webpPath}">`
	}

	return `<picture>
		${webpPart}
		<img alt="${context.escapeAttribute(opts.alt)}" src="${opts.src}">
	</picture>`
})