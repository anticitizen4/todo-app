import u from "./utility.js";
import storage from "./storage.js";

let draggedLi;
let list = document.querySelector(".main__list");

list.addEventListener("dragstart", dragstart);
list.addEventListener("dragenter", dragenter);
list.addEventListener("dragover", dragover);
list.addEventListener("dragleave", dragleave);
list.addEventListener("dragend", dragend);
list.addEventListener("drop", drop);

function dragstart({ target, dataTransfer }) {
	if (target.tagName != "LI") return;

	let img = u.constructBlankImg();
	dataTransfer.setDragImage(img, 0, 0);
	dataTransfer.setData("text/html", "");
	draggedLi = target;

	target.classList.add("dragged", "dragged-over");
}

function dragenter({ target }) {
	if (target.tagName != "LI") return;
	target.classList.add("dragged-over");
}

function dragover(event) {
	let target = event.target;
	if (target.tagName != "LI") return;

	event.preventDefault();
}

function dragleave({ target }) {
	if (target.tagName != "LI") return;
	target.classList.remove("dragged-over");
}

function dragend({ target }) {
	if (target.tagName != "LI") return;
	target.classList.remove("dragged", "dragged-over");
}

function drop({ target }) {
	if (target.tagName != "LI") return;
	target.classList.remove("dragged-over");

	if (target === draggedLi) return;

	let i = u.getChildIndex(target);
	let j = u.getChildIndex(draggedLi);
	storage.swap(i, j);

	u.swapElements(draggedLi, target);
}
