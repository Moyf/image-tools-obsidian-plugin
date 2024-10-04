import {PluginValue, ViewPlugin, ViewUpdate,} from "@codemirror/view";
import {Plugin} from "obsidian";

class AlignImage implements PluginValue {
	alignIconsClassName = "align-icons-class-name"
	resizeIconClassName = "resize-icon-class-name"
	viewUpdate: ViewUpdate

	update(update: ViewUpdate) {
		this.viewUpdate = update

		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			if (img.children[0].tagName === "IMG" && !(img.children[1]?.className === this.alignIconsClassName)) {
				console.log("added align buttons to image")
				this.addAlignIcons(img.children[0])
			}
		})

		Array.from(images).forEach(img => {
			if (img.children[0].tagName === "IMG" && !(img.children[2]?.className === this.resizeIconClassName)) {
				console.log("added resize buttons to image")
				this.addResizeIcon(img.children[0])
			}
		})
	}

	addAlignIcons(item: any) {
		const iconsContainer = document.createElement("div")
		iconsContainer.style.position = "absolute"
		iconsContainer.style.top = "0px"
		iconsContainer.style.right = "0px"
		iconsContainer.style.opacity = '0'
		iconsContainer.className = this.alignIconsClassName

		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/align-left.png?raw=true",
			() => {
				this.setNewAlignForImage(item, "left")
				item.parentNode.style.textAlign = "left"
			}
		))
		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/align-center.png?raw=true",
			() => {
				this.setNewAlignForImage(item, "center")
				item.parentNode.style.textAlign = "center"
			}
		))
		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/align-right.png?raw=true",
			() => {
				this.setNewAlignForImage(item, "right")
				item.parentNode.style.textAlign = "right"
			}
		))

		item.parentNode.addEventListener('mousemove', () => {
			const left = Math.min(item.parentNode.clientWidth, item.width)
			iconsContainer.style.opacity = '1'
			iconsContainer.style.left = (left - 93) + "px"
		})
		item.parentNode.addEventListener('mouseout', () => iconsContainer.style.opacity = '0')
		item.parentNode?.append(iconsContainer)
	}

	createIconElement(src: string, clickEvent: any) {
		const icon = document.createElement("img")
		icon.src = src
		icon.style.backgroundColor = 'white';

		icon.addEventListener('mouseover', () => {
			icon.style.backgroundColor = '#d7e2ff';
		});
		icon.addEventListener('mouseout', () => {
			icon.style.backgroundColor = 'white';
		});
		icon.addEventListener("click", clickEvent)

		icon.style.height = "25px"
		icon.style.padding = "5px"
		icon.style.margin = "3px"
		icon.style.borderRadius = "4px"
		icon.style.cursor = "pointer"
		return icon
	}

	addResizeIcon(item: any) {
		const icon = document.createElement("div")
		icon.style.position = "absolute"
		icon.style.bottom = "8px"
		icon.style.right = "0px"
		icon.style.width = "15px"
		icon.style.height = "15px"
		icon.style.backgroundColor = "white"
		icon.style.borderRadius = "10px"
		icon.style.border = "2px solid grey"
		icon.style.opacity = '0'
		icon.style.cursor = 'nwse-resize'
		icon.className = this.resizeIconClassName

		item.parentNode.addEventListener('mousemove', () => {
			console.log("Hello")
			const left = Math.min(item.parentNode.clientWidth, item.width)
			icon.style.opacity = '1'
			icon.style.left = (left - 17) + "px"
		})
		item.parentNode.addEventListener('mouseout', () => icon.style.opacity = '0')

		icon.addEventListener("mousedown", (e) => {
			const startX = e.clientX;

			let startWidth = 0
			if (document.defaultView) {
				startWidth = parseInt(document?.defaultView?.getComputedStyle(item).width, 10);
			}

			const mousemove = (e: any) => {
				const newWidth = startWidth + e.clientX - startX
				this.setNewWidthForImage(item, newWidth)
				item.setAttribute("width", `${newWidth}px`)
			}

			const mouseup = (e: any) => {
				document.documentElement.removeEventListener('mousemove', mousemove, false);
				document.documentElement.removeEventListener('mouseup', mouseup, false);
			}

			document.documentElement.addEventListener('mousemove', mousemove, false);
			document.documentElement.addEventListener('mouseup', mouseup, false);
		})

		item.parentNode?.append(icon)
	}

	setNewWidthForImage(img: any, newWidth: number) {
		const imgName = img.parentNode.getAttribute("src")
		const text = this.viewUpdate.state.doc.toString()
		const [indexStart, indexEnd] = this.getIndexes(text, imgName)

		let imageText = new ImageText(text.slice(indexStart, indexEnd))
		imageText.setWidth(newWidth.toString())

		const changes = this.viewUpdate.state.update({
			changes: {from: indexStart, to: indexEnd, insert: imageText.getImageText()}
		})
		this.viewUpdate.view.dispatch(changes)
	}

	setNewAlignForImage(img: any, newAlign: string) {
		const imgName = img.parentNode.getAttribute("src")
		const text = this.viewUpdate.state.doc.toString()
		const [indexStart, indexEnd] = this.getIndexes(text, imgName)

		let imageText = new ImageText(text.slice(indexStart, indexEnd))
		imageText.setAlign(newAlign)

		const changes = this.viewUpdate.state.update({
			changes: {from: indexStart, to: indexEnd, insert: imageText.getImageText()}
		})
		this.viewUpdate.view.dispatch(changes)
	}

	getIndexes(text: string, imgText: string) {
		const indexStart = text.indexOf(`![[${imgText}`) + 3
		let indexEnd = indexStart
		for (let i = indexStart + 1; i < text.length; i++) {
			if (text[i] === "]" && text[i+1] === "]") {
				indexEnd = i
				break
			}
		}
		return [indexStart, indexEnd]
	}
}

class ImageText {
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

export default class extends Plugin {
	onload() {
		this.registerEditorExtension([ViewPlugin.fromClass(AlignImage)]);
	}
}
