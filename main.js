let inputField = document.querySelector(".input__field");

let list = document.querySelector(".main__list");

let footerCounter = document.querySelector(".footer__counter");
let footerFillButton = document.querySelector(".footer__fill");
let footerClearCompletedButton = document.querySelector(
	".footer__clear-completed"
);
let footerClearButton = document.querySelector(".footer__clear");

// storage
//#region
let storage = {
	unshift(entry) {
		let data = this.entries;
		data.unshift(entry);
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

	update(index, options) {
		let data = this.entries;
		let entry = data[index];

		if (options.value != undefined) {
			entry.value = options.value;
		}
		if (options.completed != undefined) {
			entry.completed = options.completed;
		}

		data[index] = entry;
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
//#endregion

function addItem(event) {
	if (!inputField.value) return;

	let entry = { value: inputField.value };
	let lis = constructLis([entry]);

	storage.unshift(entry);
	inputField.value = "";

	list.firstChild.after(...lis);

	updateCounter();
}

function updateCounter() {
	footerCounter.textContent = `items total: ${list.children.length}`;
}

function repopulate() {
	let entries = storage.entries;

	let lis = constructLis(entries);

	list.append(...lis);
}

function clearCompleted() {
	[...list.children].forEach(li => {
		if (!li.classList.contains("completed")) return;

		let index = getChildIndex(li);
		storage.remove(index);

		li.remove();
	});
}

function clear() {
	storage.entries = [];

	[...list.children].forEach(el => el.remove());
}

function constructLis(entries) {
	let lis = entries.map(({ value, completed }) => {
		let li = document.createElement("li");
		li.draggable = true;

		if (completed) {
			li.classList.add("completed");
		}

		let checkbox = constructCheckbox(completed);

		let p = document.createElement("p");
		p.textContent = value;

		let closeButton = document.createElement("span");
		closeButton.classList.add("close-button");

		li.append(checkbox, p, closeButton);
		return li;
	});
	return lis;
}

function constructCheckbox(checked) {
	let div = document.createElement("div");
	div.classList.add("checkbox");

	let input = document.createElement("input");
	input.type = "checkbox";
	// TODO: change id to something unique
	let id = `${Math.random()}`;

	if (checked) {
		input.checked = checked;
	}

	let label = document.createElement("label");
	label.htmlFor = input.id = id;

	div.append(input, label);

	return div;
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

function getChildIndex(child) {
	let index = [...child.parentElement.children].indexOf(child);
	return index;
}

// entry
inputField.addEventListener("keypress", event => {
	if (event.keyCode != 13) return;

	addItem();
});

// close buttons
list.addEventListener("click", event => {
	let target = event.target;
	if (!target.classList.contains("close-button")) return;

	let li = target.parentElement;

	let index = getChildIndex(li);
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

		let index = getChildIndex(li);
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
	let index = getChildIndex(li);
	if (target.checked) {
		li.classList.add("completed");
		storage.update(index, { completed: true });

		return;
	}
	li.classList.remove("completed");
	storage.update(index, { completed: false });
});

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

// DnD
//#region
let draggedLi;
list.addEventListener("dragstart", event => {
	let target = event.target;
	if (target.tagName != "LI") return;

	target.classList.add("dragged", "dragged-over");

	let img = constructBlankImg();
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

	let i = getChildIndex(target);
	let j = getChildIndex(draggedLi);

	storage.swap(i, j);

	swapElements(draggedLi, target);
});
//#endregion

(function init() {
	repopulate();
	updateCounter();
})();
