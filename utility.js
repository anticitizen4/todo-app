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

export default { getChildIndex, swapElements, constructBlankImg };
