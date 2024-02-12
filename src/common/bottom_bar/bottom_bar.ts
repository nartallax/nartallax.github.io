import {tag} from "@nartallax/cardboard-dom"
import * as css from "./bottom_bar.module.scss"

interface Props {
	parent: HTMLElement
	contents: HTMLElement[]
}

// this will return not the container itself, but the element you can add other stuff to
export const makeBottomBarredScreenContainer = (props: Props): HTMLElement => {
	const bar = tag({class: css.bottomBar}, props.contents)
	const contentContainer = tag({class: css.contentContainer})
	const wrap = tag({class: css.pageContainer}, [contentContainer, bar])

	props.parent.appendChild(wrap)

	return contentContainer
}