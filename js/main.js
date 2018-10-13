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

// item add
//#region
inputField.addEventListener("keypress", handleItemAdd);

function handleItemAdd(event) {
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

	if (target.checked) {
		li.classList.add("completed");
		storage.update(index, { completed: true });

		return;
	}
	li.classList.remove("completed");
	storage.update(index, { completed: false });
}

//#endregion

// list control
//#region
btnFill.addEventListener("click", handleFill);
btnClearCompleted.addEventListener("click", handleClearCompleted);
btnClear.addEventListener("click", handleClear);

function handleFill() {
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

function handleClearCompleted() {
	clearCompleted();
	updateCounter();
}

function handleClear() {
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
