const $form = document.querySelector("form.toDoForm");
const $target = document.querySelector("#" + $form.dataset.target);
const key = "toDoItem";

const taskObj = new taskList($form, $target, key);

/*$form.addEventListener("submit", event => {
	event.preventDefault();
	taskObj.add();
	event.reset();
});*/

$target.addEventListener("click", event => {
	if (event.target.classList.contains("btn-del")) {
		taskObj.remove(event.target.closest("li"));
	} else if (event.target.classList.contains("btn-edit")) {
		taskObj.edit(event.target.closest("li"));
	} else if (event.target.type === "checkbox") {
		taskObj.complit(event.target.closest("li"));
	}
});