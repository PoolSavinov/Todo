const tasks = [{
        _id: '5d2ca9e2e03d40b326596aa7',
        completed: true,
        body: 'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
        title: '1',
    },
    {
        _id: '5d2ca9e29c8a94095c1288e0',
        completed: false,
        body: 'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
        title: '2',
    },
    {
        _id: '5d2ca9e2e03d40b3232496aa7',
        completed: true,
        body: 'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
        title: '3',
    },
    {
        _id: '5d2ca9e29c8a94095564788e0',
        completed: false,
        body: 'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
        title: '4',
    },
];



(function(arrOfTasks) {
    // Преобразование к объекту
    const objOfTasks = arrOfTasks.reduce((acc, task) => {
        acc[task._id] = task;
        return acc
    }, {});

    // Elements UI
    const listContainer = document.querySelector(
        ".tasks-list-section .list-group"
    )
    const form = document.forms["addTask"];
    const inputTitle = form.elements["title"];
    const inputBody = form.elements["body"];
    createMessage();
    const btmVisibleAll = document.querySelector(".btm-visible-all");
    const btmVisibleUnfinished = document.querySelector(".btm-visible-unfinished");
    // События
    renderAllTasks(objOfTasks);
    form.addEventListener("submit", onFormSubmitHeandler);
    listContainer.addEventListener("click", onDeleteHandler);
    listContainer.addEventListener("click", checkTask);
    btmVisibleAll.addEventListener("click", btmVisibleAllHandler);
    btmVisibleUnfinished.addEventListener("click", btmVisibleUnfinishedHandler);


    function renderAllTasks(taskList) {
        if (!taskList) {
            console.error("Передайте список задач")
            return;
        }
        // Создание фрагмента
        const fragment = document.createDocumentFragment();
        const arrLi = []
            // Перебор задач (task) и создание элемента списка + добавление его во фрагмент
        Object.values(taskList).forEach(task => {
            const li = listItemTemlate(task)
            fragment.appendChild(li);
            verifyCheckTask(li);
            arrLi.push(li)

        });
        // Добавление фрагмента в DOM
        listContainer.appendChild(fragment);
        collectHtmlTaskFromObj(arrLi)
    };

    function collectHtmlTaskFromObj(arrLi) {
        arrLi.forEach(li => {

        })
    };

    function listItemTemlate({ _id, title, body } = {}) {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "flex-column", "flex-wrap", "mt-2", "visible");
        li.setAttribute("data-task-id", _id);
        const span = document.createElement("span");
        span.textContent = title;
        span.style.fontWeight = "bold";
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete Task";
        deleteBtn.classList.add("btn", "btn-danger", "delete-btn", "align-self-end", "mt-2");
        const checkbtm = document.createElement("button");
        checkbtm.textContent = "Check";
        checkbtm.classList.add("btn", "btn-success", "check-btn", "align-self-end");
        const artical = document.createElement("p");
        artical.textContent = body;
        artical.classList.add("mt-2", "w-100");
        li.appendChild(span);
        li.appendChild(artical);
        li.appendChild(checkbtm);
        li.appendChild(deleteBtn);
        return li;
    };

    function onFormSubmitHeandler(e) {
        e.preventDefault();
        const titleValue = inputTitle.value;
        const bodyValue = inputBody.value;

        if (!titleValue || !bodyValue) {
            alert("Введите title и body");
            return;
        };
        const task = createNewTask(titleValue, bodyValue);
        const listItem = listItemTemlate(task);
        listContainer.insertAdjacentElement("afterbegin", listItem);
        form.reset();
    };

    function createNewTask(title, body) {
        const newTask = {
            title,
            body,
            completed: false,
            _id: `task-${Math.random()}`,
        };
        objOfTasks[newTask._id] = newTask;
        deleteMessage(objOfTasks);
        return {...newTask };
    };

    function deleteTask(id) {
        const isConfirm = confirm(`Точно удалить задачу? ${objOfTasks[id].title}`);
        if (!isConfirm) {
            return isConfirm
        };
        delete objOfTasks[id];
        return isConfirm
    };

    function deleteTaskFromHtml(confirmed, el) {
        if (!confirmed) {
            return
        }
        el.remove()
    };

    function onDeleteHandler({ target }) {
        if (target.classList.contains("delete-btn")) {
            const parent = target.closest("[data-task-id]");
            const id = parent.dataset.taskId;
            const confirmed = deleteTask(id);
            deleteTaskFromHtml(confirmed, parent)
            addMessage(objOfTasks)
        }
    };

    function createMessage() {
        const p = document.createElement("p");
        p.textContent = "У вас пока нет задач!";
        p.style.fontWeight = "bold";
        p.classList.add("message", "d-none", "position-absolute", "top-50", "start-50", "translate-middle");
        const fragment = document.createDocumentFragment()
        fragment.appendChild(p)
        listContainer.appendChild(fragment)
    };

    function addMessage(objOfTasks) {
        const length = Object.keys(objOfTasks).length;
        const message = document.querySelector(".message");
        if (length === 0) {
            message.classList.remove("d-none");
        };

    };

    function deleteMessage(objOfTasks) {
        const length = Object.keys(objOfTasks).length;
        const message = document.querySelector(".message");
        if (length !== 0) {
            message.classList.add("d-none");
        };
    };

    function checkTask({ target }) {
        if (target.classList.contains("check-btn")) {
            const parent = target.closest("[data-task-id]");
            const id = parent.dataset.taskId;
            checkObj(id, parent);
        }
    };

    function checkObj(id, parent) {
        if (objOfTasks[id].completed === true) {
            objOfTasks[id].completed = false;
            const check = false;
            checkHtml(parent, check);
        } else {
            objOfTasks[id].completed = true;
            const check = true;
            checkHtml(parent, check);
        };
    };

    function checkHtml(parent, check) {
        if (check) {
            parent.classList.add("checked")
        } else {
            parent.classList.remove("checked")
        };
    };

    function verifyCheckTask(li) {
        const id = li.dataset.taskId
        if (objOfTasks[id].completed === true) {
            li.classList.add("checked")
        };
    };

    function collectAllLiHtml() {
        const nodeListLi = document.querySelectorAll(".list-group-item");
        return nodeListLi
    };

    function collectTaskIdUnfinished() {
        const id = [];
        Object.values(objOfTasks).forEach(values => {
            if (!values.completed) {
                id.push(values._id);
            }
        });
        return id
    };

    function collectTaskIdFinished() {
        const id = [];
        Object.values(objOfTasks).forEach(values => {
            if (values.completed) {
                id.push(values._id);
            }
        });
        return id
    }

    function btmVisibleAllHandler(e) {
        e.preventDefault();
        collectAllLiHtml().forEach(li => {
            li.classList.add("visible")
            li.classList.remove("unvisible");
        });
    };

    function btmVisibleUnfinishedHandler(e) {
        e.preventDefault();
        const arrLiFinished = [];
        const taskFinished = collectTaskIdFinished();
        const taskAll = collectAllLiHtml();
        taskAll.forEach(li => {
            taskFinished.forEach(id => {
                if (li.dataset.taskId === id) {
                    arrLiFinished.push(li)
                };
            });
        });
        arrLiFinished.forEach(li => {
            li.classList.remove("visible");
            li.classList.add("unvisible");
        });

    };
})(tasks);