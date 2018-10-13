import u from "./utility.js";
import storage from "./storage.js";

import "./dnd.js";

let inputField = document.querySelector(".input__field");
let list = document.querySelector(".main__list");

let footerCounter = document.querySelector(".footer__counter");
let btnFill = document.querySelector(".footer__fill");
let btnClearCompleted = document.querySelector(".footer__clear-completed");
let btnClear = document.querySelector(".footer__clear");

function repopulate() {
	let entries = storage.entries;

	let lis = u.constructLis(entries);

	list.append(...lis);
}

function updateCounter() {
	footerCounter.textContent = `items total: ${list.children.length}`;
}

// list add
//#region
inputField.addEventListener("keypress", handleListAdd);

function handleListAdd(event) {
	if (event.key != "Enter") return;
	addItem();
}

function addItem(event) {
	if (!inputField.value) return;

	let entry = { value: inputField.value };
	let lis = u.constructLis([entry]);

	storage.unshift(entry);
	inputField.value = "";

	list.firstChild.after(...lis);

	updateCounter();
}
//#endregion

// item control
//#region
list.addEventListener("click", handleItemDelete);
list.addEventListener("dblclick", handleItemEditStart);
list.addEventListener("focusout", handleItemEditStop);
list.addEventListener("change", handleItemToggle);

function handleItemDelete({ target }) {
	if (!target.classList.contains("close-button")) return;

	let li = target.parentElement;
	let index = u.getChildIndex(li);

	storage.remove(index);
	li.remove();

	updateCounter();
}

function handleItemEditStart({ target }) {
	if (target.tagName != "P") return;

	let li = target.parentElement;

	let editField = document.createElement("input");
	editField.type = "text";
	editField.value = target.textContent;

	target.replaceWith(editField);
	li.draggable = false;
	editField.focus();

	[...list.children].forEach(child => {
		if (child === li) return;
		child.classList.add("inactive");
	});
}

function handleItemEditStop({ target }) {
	if (target.tagName != "INPUT") return;

	let li = target.parentElement;
	let index = u.getChildIndex(li);
	let value = target.value;

	storage.update(index, { value });

	let p = document.createElement("p");
	p.textContent = value;

	target.replaceWith(p);
	li.draggable = true;

	[...list.children].forEach(child => {
		if (child === li) return;
		child.classList.remove("inactive");
	});
}

function handleItemToggle({ target }) {
	if (target.tagName != "INPUT" || target.type != "checkbox") return;

	let li = target.parentElement.parentElement;
	let index = u.getChildIndex(li);

	storage.update(index, { completed: target.checked });
	target.checked
		? li.classList.add("completed")
		: li.classList.remove("completed");
}

//#endregion

// list control
//#region
btnFill.addEventListener("click", handleListFill);
btnClearCompleted.addEventListener("click", handleListClearCompleted);
btnClear.addEventListener("click", handleListClear);

function handleListFill() {
	clear();

	let total = 5;
	let data = [];
	for (let i = 0; i < total; i++) {
		data[i] = { value: `${Math.random()}` };
	}
	data.push({ value: `---- `.repeat(140) });
	storage.entries = data;

	repopulate();
	updateCounter();
}

function handleListClearCompleted() {
	clearCompleted();
	updateCounter();
}

function handleListClear() {
	clear();
	updateCounter();
}

function clearCompleted() {
	[...list.children].forEach(li => {
		if (!li.classList.contains("completed")) return;

		let index = u.getChildIndex(li);
		storage.remove(index);

		li.remove();
	});
}

function clear() {
	storage.entries = [];

	[...list.children].forEach(el => el.remove());
}
//#endregion

function init() {
	repopulate();
	updateCounter();
}

init();
