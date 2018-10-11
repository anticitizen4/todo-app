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

export default storage;
