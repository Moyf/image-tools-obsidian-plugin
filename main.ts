import {PluginValue, ViewPlugin, ViewUpdate,} from "@codemirror/view";
import {Plugin} from "obsidian";

class AlignImage implements PluginValue {
	update(update: ViewUpdate) {
		// const images = update.view.dom.getElementsByTagName("img")
		const images = update.view.dom.getElementsByClassName("image-embed")
		Array.from(images).forEach(img => {
			console.log(img)
			// if (img.parentElement && !img.parentElement.getElementsByClassName("icon-some-name").length) {
			console.log(img.children[0].tagName)
			console.log(img.children[1]?.className)
			console.log(!(img.children[1]?.className === "icon-some-name"))
			if (img.children[0].tagName === "IMG" && !(img.children[1]?.className === "icon-some-name")) {
				console.log("added")
				this.addIcons(img.children[0])
			}
		})
	}

	addIcons(item: any) {
		const iconsContainer = document.createElement("div")
		iconsContainer.style.position = "absolute"
		iconsContainer.style.top = "0px"
		iconsContainer.style.right = "0px"
		iconsContainer.style.transition = "0.1s"
		iconsContainer.style.opacity = '0'
		iconsContainer.className = "icon-some-name"

		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/align-left.png?raw=true"
		))
		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/align-center.png?raw=true"
		))
		iconsContainer.append(this.createIconElement(
			"https://github.com/Hosstell/image-editor-obsidian-plugin/blob/main/static/align-right.png?raw=true"
		))

		item.parentNode.addEventListener('mouseover', () => {
			const left = Math.min(item.parentNode.clientWidth, item.width)
			iconsContainer.style.opacity = '1'
			iconsContainer.style.left = (left - 93) + "px"
		})
		item.parentNode.addEventListener('mouseout', () => iconsContainer.style.opacity = '0')
		item.parentNode.addEventListener('change', () => console.log("hello"))
		item.addEventListener('change', () => console.log("hello"))
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

		icon.style.height = "25px"
		icon.style.padding = "5px"
		icon.style.margin = "3px"
		icon.style.borderRadius = "4px"
		icon.style.cursor = "pointer"
		return icon
	}
}


export default class extends Plugin {
	onload() {
		this.registerEditorExtension([ViewPlugin.fromClass(AlignImage)]);
	}
}
