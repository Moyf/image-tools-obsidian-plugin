import {PluginValue, ViewUpdate} from "@codemirror/view";
import MDText from "./md-text";

export default class ZoomIconItem implements PluginValue {
	zoomIconsClassName = "zoom-icons-class-name"
	viewUpdate: ViewUpdate
	mdText: MDText

	update(update: ViewUpdate) {
		this.viewUpdate = update
		this.mdText = new MDText(update.state.doc.toString())
		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			if (img.children[0].tagName === "IMG" && !(img.children[1]?.className === this.zoomIconsClassName)) {
				this.addZoomIcon(img.children[0])
			}
		})

		// Array.from(images).forEach((img: any) => {
		// 	if (!img.style.textAlign) {
		// 		const imageText = this.mdText.getImageText(img.getAttribute("src"))
		// 		img.style.textAlign = imageText.align
		// 	}
		// })
	}

	addZoomIcon(item: any) {
		const iconsContainer = document.createElement("div")
		iconsContainer.style.position = "absolute"
		iconsContainer.style.top = "0px"
		iconsContainer.style.left = "0px"
		iconsContainer.style.opacity = '0'
		iconsContainer.className = this.zoomIconsClassName

		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/zoom.png?raw=true"
		))

		item.parentNode.addEventListener('mousemove', () => {
			const left = Math.min(item.parentNode.clientWidth, item.width)
			iconsContainer.style.opacity = '1'
			// iconsContainer.style.left = (left - 93) + "px"
		})
		item.parentNode.addEventListener('mouseout', () => iconsContainer.style.opacity = '0')
		item.parentNode?.append(iconsContainer)
	}

	createIconElement(src: string) {
		const icon = document.createElement("img")
		icon.src = src
		icon.style.backgroundColor = 'white';

		icon.addEventListener('mouseover', () => {
			icon.style.backgroundColor = '#d7e2ff';
		});
		icon.addEventListener('mouseout', () => {
			icon.style.backgroundColor = 'white';
		});
		// icon.addEventListener("click", clickEvent)

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
