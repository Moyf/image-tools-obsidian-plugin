export default class ImageText {
	text: string
	img: string | undefined
	align: string | undefined
	width: string | undefined

	constructor(text: string) {
		this.text = text
		const params = text.split("|")
		this.img = params[0]

		if (params.length == 3) {
			this.align = params[1]
			this.width = params[2]
			return
		}

		if (params.length == 2) {
			if (params[1] == "left" || params[1] == "center" || params[1] == "right") {
				this.align = params[1]
			} else {
				this.width = params[1]
			}
		}
	}

	setWidth(newWidth: string) {
		this.width = newWidth
	}

	setAlign(newAlign: string) {
		this.align = newAlign
	}

	getImageText() {
		let output = this.img
		if (this.align !== undefined) {
			output += "|" + this.align
		}
		if (this.width !== undefined) {
			output += "|" + this.width
		}
		return output
	}
}
