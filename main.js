let input = document.querySelector(".input");
let input_field = input.children[0];
let input_button = input.children[1];

let list = document.querySelector(".main__list");

let footer_text = document.querySelector(".footer__text");

input_button.addEventListener("click", _ => {
	let li = document.createElement("li");
	li.textContent = input_field.value;
	input_field.value = "";

	let close_button = document.createElement("span");
	close_button.classList.add("close-button");
	li.append(close_button);

	list.append(li);

	updateCounter();
});

list.addEventListener("click", event => {
	let target = event.target;
	if (!target.classList.contains("close-button")) return;

	target.parentElement.remove();
	updateCounter();
});

function updateCounter() {
	footer_text.textContent = `items total: ${list.children.length}`;
}

function init() {
	updateCounter();
}

init();
