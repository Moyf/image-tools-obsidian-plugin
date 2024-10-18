import {PluginValue, ViewUpdate} from "@codemirror/view";
import MDText from "./md-text";

export default class AlignIconsItem implements PluginValue {
	alignIconsClassName = "align-icons-class-name"
	viewUpdate: ViewUpdate
	mdText: MDText

	update(update: ViewUpdate) {
		this.viewUpdate = update
		this.mdText = new MDText(update.state.doc.toString())
		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			const classes = Array.from(img.children).map(x => x.className)
			if (img.children[0].tagName === "IMG" && !(classes.includes(this.alignIconsClassName))) {
				this.addAlignIcons(img.children[0])
			}
		})

		Array.from(images).forEach((img: any) => {
			if (!img.style.textAlign) {
				const imageText = this.mdText.getImageText(img.getAttribute("src"))
				img.style.textAlign = imageText.align
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

	setNewAlignForImage(img: any, newAlign: string) {
		const imgName = img.parentNode.getAttribute("src")
		const text = this.viewUpdate.state.doc.toString()
		let imageText = this.mdText.getImageText(imgName)
		let [indexStart, indexEnd] = this.mdText.getImageIndexes(imgName)
		imageText.setAlign(newAlign)

		const changes = this.viewUpdate.state.update({
			changes: {from: indexStart, to: indexEnd, insert: imageText.getImageText()}
		})
		this.viewUpdate.view.dispatch(changes)
	}
}
