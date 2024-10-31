import {PluginValue, ViewUpdate} from "@codemirror/view";

export default class CopyImageItem implements PluginValue {
	copyImageClassName = "copy-image-class-name"
	viewUpdate: ViewUpdate

	update(update: ViewUpdate) {
		this.viewUpdate = update
		const images = update.view.dom.getElementsByClassName("image-embed")

		Array.from(images).forEach(img => {
			const classes = Array.from(img.children).map(x => x.className)
			if (img.children[0].tagName === "IMG" && !(classes.includes(this.copyImageClassName))) {
				this.addCopyImageIcon(img.children[0])
			}
		})
	}

	addCopyImageIcon(item: any) {
		const iconsContainer = document.createElement("div")
		iconsContainer.style.position = "absolute"
		iconsContainer.style.top = "0px"
		iconsContainer.style.left = "0px"
		iconsContainer.style.opacity = '0'
		iconsContainer.className = this.copyImageClassName

		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/copy.png?raw=true",
			() => this.copyImage(item.src)
		))

		item.parentNode.addEventListener('mousemove', () => {
			iconsContainer.style.opacity = '1'
			const left = item.getBoundingClientRect().left - item.parentNode.getBoundingClientRect().left
			iconsContainer.style.left = (left + 32) + "px"
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

	async copyImage(src: string) {
		const response = await fetch(src)
		let blob = await response.blob()
		blob = await this.convertBlobToPng(blob)
		await this.copyBlobToClipboard(blob)
	}

	async copyBlobToClipboard(blob: Blob): Promise<void> {
		const items = { [blob.type]: blob } as unknown as Record<
			string,
			ClipboardItemData
		>

		const clipboardItem = new ClipboardItem(items)
		await navigator.clipboard.write([clipboardItem])
	}

	async convertBlobToPng(imageBlob: Blob): Promise<Blob> {
		const imageSource = URL.createObjectURL(imageBlob)
		const imageElement = await this.createImageElement(imageSource)
		return await this.getBlobFromImageElement(imageElement)
	}

	async createImageElement(imageSource: string,): Promise<HTMLImageElement> {
		return new Promise(function (resolve, reject) {
			const imageElement = document.createElement('img')
			imageElement.crossOrigin = 'anonymous'
			imageElement.src = imageSource

			imageElement.onload = function (event) {
				const target = event.target as HTMLImageElement
				resolve(target)
			}

			imageElement.onabort = reject
			imageElement.onerror = reject
		})
	}

	async getBlobFromImageElement(
		imageElement: HTMLImageElement,
	): Promise<Blob> {
		return new Promise(function (resolve, reject) {
			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')

			if (context) {
				const { width, height } = imageElement
				canvas.width = width
				canvas.height = height
				context.drawImage(imageElement, 0, 0, width, height)

				canvas.toBlob(
					function (blob) {
						if (blob) resolve(blob)
						else reject('Cannot get blob from image element')
					},
					'image/png',
					1,
				)
			}
		})
	}
}
