import {PluginValue, ViewUpdate} from "@codemirror/view";

export default class ZoomIconItem implements PluginValue {
	zoomIconsClassName = "zoom-icons-class-name"
	viewUpdate: ViewUpdate

	update(update: ViewUpdate) {
		this.viewUpdate = update
		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			const classes = Array.from(img.children).map(x => x.className)
			if (img.children[0].tagName === "IMG" && !(classes.includes(this.zoomIconsClassName))) {
				this.addZoomIcon(img.children[0])
			}
		})
	}

	addZoomIcon(item: any) {
		const iconsContainer = document.createElement("div")
		iconsContainer.style.position = "absolute"
		iconsContainer.style.top = "0px"
		iconsContainer.style.left = "0px"
		iconsContainer.style.opacity = '0'
		iconsContainer.className = this.zoomIconsClassName

		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/zoom.png?raw=true",
			() => this.openImageDialog(item, item.parentNode)
		))

		item.parentNode.addEventListener('mousemove', () => {
			iconsContainer.style.opacity = '1'
			const left = item.getBoundingClientRect().left - item.parentNode.getBoundingClientRect().left
			iconsContainer.style.left = (left + 3) + "px"
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

	openImageDialog(image: any, parent: any) {
		console.log("openImageDialog")

		const imageContainer = document.createElement("dialog")
		imageContainer.style.position = "absolute"
		imageContainer.style.width = "100%"
		imageContainer.style.height = "100%"
		imageContainer.style.border = "0"
		imageContainer.style.backgroundColor = "#ffffff00"
		imageContainer.style.textAlign = "center"
		imageContainer.style.display = "flex"
		imageContainer.style.justifyContent = "center"
		imageContainer.style.alignItems = "center"

		imageContainer.addEventListener("click", imageContainer.remove)

		const img = document.createElement("img")
		img.src = image.src
		img.style.borderRadius = "10px"
		img.style.border = "2px solid white"
		// TODO: Относительно выбранной темы (темная\светлая) определять цвет границы
		// img.style.border = "2px solid grey"
		img.style.maxHeight = "100%"
		img.style.maxWidth = "100%"

		if (image.clientHeight > image.clientWidth) {
			img.style.minHeight = "-webkit-fill-available"
		} else {
			img.style.minWidth = "-webkit-fill-available"
		}

		imageContainer.append(img)
		parent.append(imageContainer)
		imageContainer.showModal()
	}
}
