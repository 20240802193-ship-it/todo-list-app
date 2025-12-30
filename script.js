function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    let li = document.createElement("li");

    // Checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.onchange = function () {
        li.classList.toggle("completed");
    };

    // Task text
    let span = document.createElement("span");
    span.innerText = taskText;

    // Edit button
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = function () {
        let newText = prompt("Edit task:", span.innerText);
        if (newText && newText.trim() !== "") {
            span.innerText = newText;
        }
    };

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function () {
        li.remove();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    document.getElementById("taskList").appendChild(li);
    taskInput.value = "";
}
