import {
	ViewUpdate,
	PluginValue,
	EditorView,
	ViewPlugin,
} from "@codemirror/view";
import {Plugin} from "obsidian";

class ExamplePlugin implements PluginValue {
	constructor(view: EditorView) {
		// ...
	}

	update(update: ViewUpdate) {
		const images = update.view.dom.getElementsByTagName("img")
		Array.from(images).forEach(img => {
			if (img.parentElement && !img.parentElement.getElementsByClassName("icon-some-name").length) {
				this.addIcons(img)
			}
		})
	}

	addIcons(item: any) {
		const div = document.createElement("div")
		div.className = "icon-some-name"
		div.innerText = "some text"
		div.style.position = "absolute"
		div.style.top = "0px"
		div.style.right = "0px"
		item.parentNode?.append(div)
	}

	destroy() {
		// ...
	}
}


export default class MainPlugin extends Plugin {
	onload() {
		this.registerEditorExtension([ViewPlugin.fromClass(ExamplePlugin)]);
	}
}
