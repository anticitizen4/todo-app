// pure helper functions

function getChildIndex(child) {
	let index = [...child.parentElement.children].indexOf(child);
	return index;
}

function swapElements(el1, el2) {
	let prev1 = el1.previousSibling;
	let prev2 = el2.previousSibling;

	prev1.after(el2);
	prev2.after(el1);
}

function constructBlankImg() {
	let img = document.createElement("img");
	img.src =
		"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
	return img;
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

export default { getChildIndex, swapElements, constructBlankImg, constructLis };
