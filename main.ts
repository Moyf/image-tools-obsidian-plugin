import {ViewPlugin,} from "@codemirror/view";
import {Plugin} from "obsidian";
import AlignIconsItem from "./src/align-icons-item";
import ResizeIconsItem from "./src/resize-icons-item";

export default class extends Plugin {
	onload() {
		this.registerEditorExtension([
			ViewPlugin.fromClass(AlignIconsItem),
			ViewPlugin.fromClass(ResizeIconsItem)
		]);
	}
}
