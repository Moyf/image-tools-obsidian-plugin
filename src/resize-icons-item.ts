import {PluginValue, ViewUpdate} from "@codemirror/view";
import MDText from "./md-text";

export default class ResizeIconsItem implements PluginValue {
	rightResizeIconClassName = "right-resize-icon-class-name"
	leftResizeIconClassName = "left-resize-icon-class-name"
	viewUpdate: ViewUpdate
	mdText: MDText

	update(update: ViewUpdate) {
		this.viewUpdate = update
		this.mdText = new MDText(update.state.doc.toString())
		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			if (img.children[0].tagName === "IMG" && !(img.children[2]?.className === this.rightResizeIconClassName)) {
				this.addRightResizeIcon(img.children[0])
			}
		})

		Array.from(images).forEach(img => {
			if (img.children[0].tagName === "IMG" && !(img.children[3]?.className === this.leftResizeIconClassName)) {
				this.addLeftResizeIcon(img.children[0])
			}
		})

		Array.from(images).forEach((img: any) => {
			if (!img.style.textAlign) {
				const imageText = this.mdText.getImageText(img.getAttribute("src"))
				img.style.textAlign = imageText.align
			}
		})
	}

	addRightResizeIcon(item: any) {
		const icon = this.createResizeIcon()
		icon.style.cursor = 'ew-resize'
		icon.className = this.rightResizeIconClassName

		item.parentNode.addEventListener('mousemove', () => {
			const width = Math.min(item.parentNode.clientWidth, item.width)
			const left = width + item.getBoundingClientRect().left - item.parentNode.getBoundingClientRect().left
			icon.style.opacity = '1'
			icon.style.left = (left - 12) + "px"
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

	addLeftResizeIcon(item: any) {
		const icon = this.createResizeIcon()
		icon.style.cursor = 'ew-resize'
		icon.className = this.leftResizeIconClassName

		item.parentNode.addEventListener('mousemove', () => {
			const left = item.getBoundingClientRect().left - item.parentNode.getBoundingClientRect().left
			icon.style.opacity = '1'
			icon.style.left = (left + 3) + "px"
		})
		item.parentNode.addEventListener('mouseout', () => icon.style.opacity = '0')

		icon.addEventListener("mousedown", (e) => {
			const startX = e.clientX;

			let startWidth = 0
			if (document.defaultView) {
				startWidth = parseInt(document?.defaultView?.getComputedStyle(item).width, 10);
			}

			const mousemove = (e: any) => {
				const newWidth = startWidth - e.clientX + startX
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

	createResizeIcon() {
		const icon = document.createElement("div")
		icon.style.position = "absolute"
		icon.style.bottom = "8px"
		icon.style.right = "0px"
		icon.style.width = "8px"
		icon.style.height = "70px"
		icon.style.top = "calc(50% - 35px)"
		icon.style.backgroundColor = "white"
		icon.style.borderRadius = "10px"
		icon.style.border = "2px solid grey"
		icon.style.opacity = '0'
		return icon
	}

	setNewWidthForImage(img: any, newWidth: number) {
		const imgName = img.parentNode.getAttribute("src")
		let imageText = this.mdText.getImageText(imgName)
		let [indexStart, indexEnd] = this.mdText.getImageIndexes(imgName)
		imageText.setWidth(newWidth.toString())

		const changes = this.viewUpdate.state.update({
			changes: {from: indexStart, to: indexEnd, insert: imageText.getImageText()}
		})
		this.viewUpdate.view.dispatch(changes)
	}
}
