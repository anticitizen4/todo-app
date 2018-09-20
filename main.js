let input_field = document.querySelector(".input").children[0];
let input_button = document.querySelector(".input").children[1];

let list = document.querySelector(".main__list");

let footer_text = document.querySelector(".footer__text");

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

input_button.addEventListener("click", addItem);

function handleInputSubmit(event) {
	if (event.keyCode != 13) return;

	addItem();
}

function addItem(event) {
	if (!input_field.value) return;

	let li = document.createElement("li");
	li.textContent = input_field.value;
	input_field.value = "";

	let close_button = document.createElement("span");
	close_button.classList.add("close-button");
	li.append(close_button);

	storage.add(li.textContent);

	list.append(li);

	updateCounter();
}

list.addEventListener("click", event => {
	let target = event.target;
	if (!target.classList.contains("close-button")) return;

	let li = target.parentElement;
	let index = [...li.parentElement.children].indexOf(li);

	storage.remove(index);

	li.remove();
	updateCounter();
});

function updateCounter() {
	footer_text.textContent = `items total: ${list.children.length}`;
}

function repopulate() {
	let entries = storage.entries;
	entries.forEach(entry => {
		let li = document.createElement("li");
		li.textContent = entry;
		input_field.value = "";

		let close_button = document.createElement("span");
		close_button.classList.add("close-button");
		li.append(close_button);

		list.append(li);
	});
}

(function init() {
	repopulate();
	updateCounter();
})();
