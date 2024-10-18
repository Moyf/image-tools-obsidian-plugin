import ImageText from "./image-text";

export default class MDText {
	text: string

	constructor(text: string) {
		this.text = text
	}

	getImageIndexes(imgText: string) {
		const indexStart = this.text.indexOf(`![[${imgText}`) + 3
		let indexEnd = indexStart
		for (let i = indexStart + 1; i < this.text.length; i++) {
			if (this.text[i] === "]" && this.text[i+1] === "]") {
				indexEnd = i
				break
			}
		}
		return [indexStart, indexEnd]
	}

	getImageText(imgText: string) {
		const [indexStart, indexEnd] = this.getImageIndexes(imgText)
		return new ImageText(this.text.slice(indexStart, indexEnd))
	}
}
