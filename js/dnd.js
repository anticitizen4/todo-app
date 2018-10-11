// dnd functionality

import u from "./utility.js";
import storage from "./storage.js";

let list = document.querySelector(".main__list");

let draggedLi;

list.addEventListener("dragstart", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.add("dragged", "dragged-over");

	let img = u.constructBlankImg();
	event.dataTransfer.setDragImage(img, 0, 0);

	event.dataTransfer.setData("text/html", "");

	draggedLi = target;
});

list.addEventListener("dragenter", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.add("dragged-over");
});
list.addEventListener("dragover", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	event.preventDefault();
});
list.addEventListener("dragleave", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged-over");
});

list.addEventListener("dragend", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged", "dragged-over");
});

list.addEventListener("drop", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged-over");
	if (target === draggedLi) return;

	let i = u.getChildIndex(target);
	let j = u.getChildIndex(draggedLi);

	storage.swap(i, j);

	u.swapElements(draggedLi, target);
});
