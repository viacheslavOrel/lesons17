function taskList($form, $target, key) {
	this.$form = $form;
	this.$target = $target;
	this.key = key;

	if (localStorage[key]) {
		this.list = JSON.parse(localStorage[key]);
		this.renderTask();
	} else {
		this.list = new Array();
	}
}

taskList.prototype.createNode = function(taskObj) {
	return `
				<li class="task ${taskObj.complited ? " complatedTask" : ""}" data-id="${taskObj.id}">
					<input type="checkbox" ${taskObj.complited ? "checked" : ""}>
					<div>
						<h1 class="task__header">${taskObj.header}</h1>
						<p class="task__content">${taskObj.content}</p>
					</div>
					<button class="btn-edit" ${taskObj.complited ? " disabled" : ""}>Редактировать</button>
					<button class="btn-del" ${taskObj.complited ? " disabled" : ""}>Удалить</button>
				</li>
		   `;
};

taskList.prototype.isUnique = function(taskObj) {
	for (var i = 0; i < this.list.length; i++) {
		if (this.list[i].header === taskObj.header && this.list[i].content === taskObj.content )
			return false;
	}
	return true;
};

taskList.prototype.renderTask = function(taskObj) {
	if (taskObj) {
		this.$target.insertAdjacentHTML("afterbegin", this.createNode(taskObj));
	} else {
		this.$target.innerHTML = this.list.reduce((acc, val) => this.createNode(val) + acc, "");
	}
};

taskList.prototype.save = function() {
	localStorage.setItem(this.key, JSON.stringify(this.list));
};

taskList.prototype.add = function() {
	const taskObj = {
		id : moment().format("X"),
		complited : false,
		header : this.$form.querySelector("input[name='header']").value,
		content : this.$form.querySelector("input[name='content']").value
	};

	if (this.isUnique(taskObj)) {
		this.list.push(taskObj);
		this.save();
		this.renderTask(taskObj);
	}
};

taskList.prototype.remove = function($li) {
	if (!confirm("Может передумаете?\nВсе равно удалить?")) return;
	this.list = this.list.filter(val => val.id !== $li.dataset.id);
	this.save();
	console.log($li);
	$li.remove();
};

taskList.prototype.complit = function($li) {
	for (var i = 0; i < this.list.length; i++) {
		if (this.list[i].id === $li.dataset.id) {
			this.list[i].complited = !this.list[i].complited;
			this.save();
			break;
		}
	}
	$li.classList.toggle("complatedTask");
	$li.querySelectorAll("button").forEach(btn => {
		btn.toggleAttribute("disabled");
	});
};

taskList.prototype.edit = function($li) {
	document.body.insertAdjacentHTML("afterbegin", `
		<div class="modal">
			<form id="modalTaskQuery" class="toDoForm" data-task_id="${$li.dataset.id}">
				<input type="text" name="header" value="${$li.querySelector(".task__header").innerText}" required>
				<input type="text" name="content" value="${$li.querySelector(".task__content").innerText}" required>
				<button type="button" data-method="cancel">Отменить</button>
				<button type="submit">Применить</button>
			</fotm>
		</div>
	`);

	$editDiv = document.querySelector("#modalTaskQuery");

	$editDiv.addEventListener("submit", event => {
		event.preventDefault();

		for (var i = 0; i < this.list.length; i++) {
			if (this.list[i].id === event.target.dataset.task_id) {
				const headerVal = event.target.querySelector("input[name='header']").value;
				const contentVal = event.target.querySelector("input[name='content']").value;

				this.list[i].header = headerVal;
				this.list[i].content = contentVal;
				this.save();

				$li.querySelector(".task__header").innerText = headerVal;
				$li.querySelector(".task__content").innerText = contentVal;
				break;
			}
		}

		document.querySelector(".modal").remove();
	});

	$editDiv.addEventListener("click", event => {
		if (event.target.dataset.method === "cancel") {
			document.querySelector(".modal").remove();
		}
	});
};