import {ViewPlugin,} from "@codemirror/view";
import {Plugin} from "obsidian";
import AlignIconsItem from "./src/align-icons-item";
import ResizeIconsItem from "./src/resize-icons-item";
import ZoomIconItem from "./src/zoom-icon-item"
import CopyImageItem from "./src/copy-image-item";


export default class extends Plugin {
	onload() {
		this.registerEditorExtension([
			ViewPlugin.fromClass(AlignIconsItem),
			ViewPlugin.fromClass(ZoomIconItem),
			ViewPlugin.fromClass(ResizeIconsItem),
			ViewPlugin.fromClass(CopyImageItem),
		]);
	}
}
