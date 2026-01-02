window.onload = loadTasks;

function addTask(saved = null, done = false) {
    let text = saved?.text || taskInput.value.trim();
    if (!text) return alert("Enter task");

    let li = document.createElement("li");

    let check = document.createElement("input");
    check.type = "checkbox";
    check.checked = done;
    check.onchange = () => {
        moveTask(li, check.checked);
        if (check.checked) showToast("🎉 Task completed!");
    };

    let content = document.createElement("div");
    content.className = "task-content";

    let header = document.createElement("div");
    header.className = "task-header";

    let span = document.createElement("span");
    span.className = "task-text";
    span.innerText = text;

    let tag = document.createElement("span");
    tag.className = "tag " + (saved?.priority || priority.value);
    tag.innerText = saved?.priority || priority.value;

    header.append(span, tag);

    let deadlineSpan = document.createElement("span");
    deadlineSpan.className = "deadline";
    let deadlineValue = saved?.deadline || deadline.value;
    if (deadlineValue) {
        deadlineSpan.innerText = "Due: " + deadlineValue;
        checkOverdue(li, done, deadlineValue);
    }

    content.append(header, deadlineSpan);

    let actions = document.createElement("div");
    actions.className = "actions";

    let edit = document.createElement("button");
    edit.className = "edit-btn";
    edit.innerText = "Edit";
    edit.onclick = () => {
        let t = prompt("Edit task", span.innerText);
        if (t) span.innerText = t;
    };

    let del = document.createElement("button");
    del.className = "delete-btn";
    del.innerText = "Delete";
    del.onclick = () => {
        li.remove();
        updateUI();
    };

    actions.append(edit, del);
    li.append(check, content, actions);

    (done ? completedTasks : pendingTasks).appendChild(li);

    taskInput.value = "";
    deadline.value = "";
    updateUI();
}

function moveTask(li, done) {
    li.classList.toggle("completed", done);
    (done ? completedTasks : pendingTasks).appendChild(li);
    li.classList.remove("overdue");
    updateUI();
}

function updateUI() {
    pending.innerText = "Pending: " + pendingTasks.children.length;
    completed.innerText = "Completed: " + completedTasks.children.length;
    let total = pendingTasks.children.length + completedTasks.children.length || 1;
    progressBar.style.width = (completedTasks.children.length / total) * 100 + "%";
    saveTasks();
}

function showToast(msg) {
    toast.innerText = msg;
    toast.style.display = "block";
    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(() => toast.style.display = "none", 2000);
}

function checkOverdue(li, done, date) {
    let today = new Date().toISOString().split("T")[0];
    if (!done && date < today) li.classList.add("overdue");
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify({
        pending: [...pendingTasks.children].map(li => ({
            text: li.querySelector(".task-text").innerText,
            priority: li.querySelector(".tag").innerText,
            deadline: li.querySelector(".deadline")?.innerText.replace("Due: ", "")
        })),
        completed: [...completedTasks.children].map(li => ({
            text: li.querySelector(".task-text").innerText,
            priority: li.querySelector(".tag").innerText,
            deadline: li.querySelector(".deadline")?.innerText.replace("Due: ", "")
        }))
    }));
}

function loadTasks() {
    let data = JSON.parse(localStorage.getItem("tasks"));
    if (!data) return;
    data.pending.forEach(t => addTask(t, false));
    data.completed.forEach(t => addTask(t, true));
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
