import {sketches} from "sketches"
import {Div} from "widgets/generic/div"
import {SketchCard} from "widgets/specific/sketch_card"

export function MainPage(): string {

	return [
		/*
		Div({class: "sorting-selection"}, [
			Div({class: "label"}, TranslatedStr({en: "Sort by", ru: "Сортировать по"})),
			Select({
				name: "sort-by",
				values: [
					{label: {en: "creation date", ru: "дате добавления"}, value: "date", selected: true},
					{label: {en: "name", ru: "имени"}, value: "name"},
					{label: {en: "tags", ru: "тегам"}, value: "tags"},
					{label: {en: "description", ru: "описанию"}, value: "description"},
					{label: {en: "inspiration", ru: "вдохновению"}, value: "inspiration"}
				]
			}),
			Select({
				name: "sort-direction",
				values: [
					{label: {en: "descending", ru: "по убыванию"}, value: "desc", selected: true},
					{label: {en: "ascending", ru: "по возрастанию"}, value: "asc"}
				]
			}),
			Select({
				name: "tag",
				values: [
					{label: {en: "all tags", ru: "все теги"}, value: "", selected: true},
					...(Object.keys(tags) as (keyof(typeof tags))[]).map(tagName => ({
						value: tagName,
						label: tags[tagName].name
					}))
				]
			})
		]),
		HrTag(),
		*/
		Div({class: "sketch-container"}, [
			...(Object.keys(sketches) as (keyof(typeof sketches))[]).map(sketchName => {
				if(sketches[sketchName].hidden){
					return null
				}
				return SketchCard({sketchName})
			})
		])
	].join("\n")

}