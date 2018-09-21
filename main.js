let input_field = document.querySelector(".input__text");

let list = document.querySelector(".main__list");

let footer_counter = document.querySelector(".footer__counter");
let footer_fill_button = document.querySelector(".footer__fill");
let footer_clear_button = document.querySelector(".footer__clear");

let storage = {
	add(string) {
		let data = this.entries;
		data.push(string);
		this.entries = data;
	},

	remove(index) {
		let data = this.entries;
		data.splice(index, 1);
		this.entries = data;
	},

	swap(i, j) {
		let data = this.entries;
		[data[i], data[j]] = [data[j], data[i]];
		this.entries = data;
	},

	update(index, string) {
		let data = this.entries;
		data[index] = string;
		this.entries = data;
	},
};
Object.defineProperty(storage, "entries", {
	get() {
		let data = [];
		if (localStorage.entries) {
			data = JSON.parse(localStorage.entries);
		}
		return data;
	},

	set(data) {
		localStorage.entries = JSON.stringify(data);
	},
});

function addItem(event) {
	if (!input_field.value) return;

	let lis = constructLis([input_field.value]);

	storage.add(input_field.value);
	input_field.value = "";

	list.append(...lis);

	updateCounter();
}

function updateCounter() {
	footer_counter.textContent = `items total: ${list.children.length}`;
}

function repopulate() {
	let entries = storage.entries;

	let lis = constructLis(entries);

	list.append(...lis);
}

function clear() {
	storage.entries = [];

	[...list.children].forEach(el => el.remove());
}

function constructLis(entries) {
	let lis = entries.map(entry => {
		let li = document.createElement("li");
		li.draggable = "true";

		let p = document.createElement("p");
		p.textContent = entry;
		li.append(p);

		let close_button = document.createElement("span");
		close_button.classList.add("close-button");
		li.append(close_button);

		return li;
	});
	return lis;
}

function constructBlankImg() {
	let img = document.createElement("img");
	img.src =
		"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
	return img;
}

function swapElements(el1, el2) {
	let prev1 = el1.previousSibling;
	let prev2 = el2.previousSibling;

	prev1.after(el2);
	prev2.after(el1);
}

// entry
input_field.addEventListener("keypress", function() {
	if (event.keyCode != 13) return;

	addItem();
});

// close buttons
list.addEventListener("click", event => {
	let target = event.target;
	if (!target.classList.contains("close-button")) return;

	let li = target.parentElement;
	let index = [...li.parentElement.children].indexOf(li);

	storage.remove(index);

	li.remove();
	updateCounter();
});

// edit li
list.addEventListener("dblclick", event => {
	let target = event.target;
	if (target.tagName != "P") return;

	let edit_field = document.createElement("input");
	edit_field.type = "text";
	edit_field.value = target.textContent;

	let li = target.parentElement;
	li.draggable = "";

	target.replaceWith(edit_field);
	edit_field.focus();

	[...list.children].forEach(child => {
		if (child === li) return;
		child.classList.add("inactive");
	});

	edit_field.addEventListener("blur", event => {
		let target = event.target;
		if (target.tagName != "INPUT") return;

		let str = target.value;
		let p = document.createElement("p");
		p.textContent = str;

		let index = [...li.parentElement.children].indexOf(li);

		storage.update(index, str);

		li.draggable = "true";

		target.replaceWith(p);

		[...list.children].forEach(child => {
			if (child === li) return;
			child.classList.remove("inactive");
		});
	});
});

// fill list with random strings
footer_fill_button.addEventListener("click", _ => {
	clear();

	let total = 5;
	let data = [];
	for (let i = 0; i < total; i++) {
		data[i] = `${Math.random()}`;
	}
	data.push(`---- `.repeat(140));
	storage.entries = data;

	repopulate();
	updateCounter();
});

// clear list
footer_clear_button.addEventListener("click", _ => {
	clear();

	updateCounter();
});

// DnD
let dragged_li;
list.addEventListener("dragstart", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.add("dragged", "dragged_over");

	let img = constructBlankImg();
	event.dataTransfer.setDragImage(img, 0, 0);

	event.dataTransfer.setData("text/html", "");

	dragged_li = target;
});

list.addEventListener("dragenter", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.add("dragged_over");
});
list.addEventListener("dragover", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	event.preventDefault();
});
list.addEventListener("dragleave", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged_over");
});

list.addEventListener("dragend", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged", "dragged_over");
});

list.addEventListener("drop", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.remove("dragged_over");
	if (target === dragged_li) return;

	let i = [...target.parentElement.children].indexOf(target);
	let j = [...dragged_li.parentElement.children].indexOf(dragged_li);
	storage.swap(i, j);

	swapElements(dragged_li, target);
});

(function init() {
	repopulate();
	updateCounter();
})();
