import u from "./utility.js";
import storage from "./storage.js";

import "./dnd.js";

let inputField = document.querySelector(".input__field");

let list = document.querySelector(".main__list");

let footerCounter = document.querySelector(".footer__counter");
let footerFillButton = document.querySelector(".footer__fill");
let footerClearCompletedButton = document.querySelector(
	".footer__clear-completed"
);
let footerClearButton = document.querySelector(".footer__clear");

function repopulate() {
	let entries = storage.entries;

	let lis = u.constructLis(entries);

	list.append(...lis);
}

function updateCounter() {
	footerCounter.textContent = `items total: ${list.children.length}`;
}

// entry field
//#region
function addItem(event) {
	if (!inputField.value) return;

	let entry = { value: inputField.value };
	let lis = u.constructLis([entry]);

	storage.unshift(entry);
	inputField.value = "";

	list.firstChild.after(...lis);

	updateCounter();
}

// entry
inputField.addEventListener("keypress", event => {
	// TODO: use string keycode comparison
	if (event.keyCode != 13) return;

	addItem();
});
//#endregion

// list entry control
//#region
// close buttons
list.addEventListener("click", event => {
	let target = event.target;
	if (!target.classList.contains("close-button")) return;

	let li = target.parentElement;

	let index = u.getChildIndex(li);
	storage.remove(index);

	li.remove();
	updateCounter();
});

// edit li
list.addEventListener("dblclick", event => {
	let target = event.target;
	if (target.tagName != "P") return;

	let editField = document.createElement("input");
	editField.type = "text";
	editField.value = target.textContent;

	let li = target.parentElement;
	li.draggable = false;

	target.replaceWith(editField);
	editField.focus();

	[...list.children].forEach(child => {
		if (child === li) return;
		child.classList.add("inactive");
	});

	// TODO: extract to parent
	editField.addEventListener("blur", event => {
		let target = event.target;
		if (target.tagName != "INPUT") return;

		let value = target.value;
		let p = document.createElement("p");
		p.textContent = value;

		let index = u.getChildIndex(li);
		storage.update(index, { value: value });

		li.draggable = true;

		target.replaceWith(p);

		[...list.children].forEach(child => {
			if (child === li) return;
			child.classList.remove("inactive");
		});
	});
});

// checkbox change
list.addEventListener("change", event => {
	let target = event.target;
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
});
//#endregion

// list control
//#region
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

// fill list with random strings
footerFillButton.addEventListener("click", _ => {
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
});

// clear completed entries
footerClearCompletedButton.addEventListener("click", _ => {
	clearCompleted();

	updateCounter();
});

// clear all entries
footerClearButton.addEventListener("click", _ => {
	clear();

	updateCounter();
});
//#endregion

function init() {
	repopulate();
	updateCounter();
}

init();
