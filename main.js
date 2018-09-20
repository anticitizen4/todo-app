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
		li.textContent = entry;

		let close_button = document.createElement("span");
		close_button.classList.add("close-button");
		li.append(close_button);

		return li;
	});
	return lis;
}

input_field.addEventListener("keypress", function() {
	if (event.keyCode != 13) return;

	addItem();
});

list.addEventListener("click", event => {
	let target = event.target;
	if (!target.classList.contains("close-button")) return;

	let li = target.parentElement;
	let index = [...li.parentElement.children].indexOf(li);

	storage.remove(index);

	li.remove();
	updateCounter();
});

footer_fill_button.addEventListener("click", _ => {
	clear();

	let total = 5;
	let data = [];
	for (let i = 0; i < total; i++) {
		data[i] = `${Math.random()}`;
	}
	storage.entries = data;

	repopulate();
	updateCounter();
});

footer_clear_button.addEventListener("click", _ => {
	clear();

	updateCounter();
});

(function init() {
	repopulate();
	updateCounter();
})();
