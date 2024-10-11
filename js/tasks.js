document.addEventListener('DOMContentLoaded', () => {
    const newTaskForm = document.getElementById('new-task-form');
    const predefinedTasksList = document.getElementById('predefined-tasks-list');
    const addPredefinedTaskButton = document.getElementById('add-predefined-task');
    const currentUser = document.getElementById('task-sender').value;

    if (newTaskForm) {
        newTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('task-title').value;
            const recipient = document.getElementById('task-recipient').value;
            const urgency = document.getElementById('task-urgency').value;
            const soundFile = document.getElementById('task-sound').value;
            const sender = document.getElementById('task-sender').value;
            createTask(title, recipient, urgency, soundFile, sender);
            newTaskForm.reset();
        });
    }

    if (addPredefinedTaskButton) {
        addPredefinedTaskButton.addEventListener('click', () => {
            const predefinedTaskForm = createPredefinedTaskForm();
            predefinedTasksList.appendChild(predefinedTaskForm);
        });
    }

    loadPredefinedTasks(currentUser);
});

function createPredefinedTaskForm(task = null) {
    const form = document.createElement('form');
    form.classList.add('predefined-task-form');
    form.innerHTML = `
        <input type="text" class="predefined-title" placeholder="Titre" required value="${task ? task.title : ''}">
        <select class="predefined-recipient" required>
            <option value="Arnaud" ${task && task.recipient === 'Arnaud' ? 'selected' : ''}>Arnaud</option>
            <option value="Julien" ${task && task.recipient === 'Julien' ? 'selected' : ''}>Julien</option>
            <option value="Assistante" ${task && task.recipient === 'Assistante' ? 'selected' : ''}>Assistante</option>
            <option value="Anne" ${task && task.recipient === 'Anne' ? 'selected' : ''}>Anne</option>
        </select>
        <select class="predefined-urgency" required>
            <option value="normal" ${task && task.urgency === 'normal' ? 'selected' : ''}>Normal</option>
            <option value="urgent" ${task && task.urgency === 'urgent' ? 'selected' : ''}>Urgent</option>
        </select>
        <select class="predefined-sound" required>
            <option value="notification1.mp3" ${task && task.soundFile === 'notification1.mp3' ? 'selected' : ''}>Son 1</option>
            <option value="notification2.mp3" ${task && task.soundFile === 'notification2.mp3' ? 'selected' : ''}>Son 2</option>
            <option value="notification3.mp3" ${task && task.soundFile === 'notification3.mp3' ? 'selected' : ''}>Son 3</option>
        </select>
        <button type="submit">Sauvegarder</button>
    `;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        savePredefinedTask(form);
    });

    return form;
}

function savePredefinedTask(form) {
    const currentUser = document.getElementById('task-sender').value;
    const title = form.querySelector('.predefined-title').value;
    const recipient = form.querySelector('.predefined-recipient').value;
    const urgency = form.querySelector('.predefined-urgency').value;
    const soundFile = form.querySelector('.predefined-sound').value;

    const taskContainer = document.createElement('div');
    taskContainer.classList.add('predefined-task-container');

    const taskButton = document.createElement('button');
    taskButton.textContent = title;
    taskButton.classList.add('predefined-task-button');
    taskButton.setAttribute('data-recipient', recipient);
    taskButton.setAttribute('data-urgency', urgency);
    taskButton.setAttribute('data-sound', soundFile);
    taskButton.addEventListener('click', () => {
        createTask(title, recipient, urgency, soundFile, currentUser);
    });

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('predefined-task-controls');

    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.classList.add('edit-predefined-task');
    editButton.addEventListener('click', () => {
        const editForm = createPredefinedTaskForm({title, recipient, urgency, soundFile});
        taskContainer.replaceWith(editForm);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.classList.add('delete-predefined-task');
    deleteButton.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche prédéfinie ?')) {
            taskContainer.remove();
            savePredefinedTasks(currentUser);
        }
    });

    controlsContainer.appendChild(editButton);
    controlsContainer.appendChild(deleteButton);

    taskContainer.appendChild(taskButton);
    taskContainer.appendChild(controlsContainer);

    const predefinedTasksList = document.getElementById('predefined-tasks-list');
    if (form.parentNode === predefinedTasksList) {
        predefinedTasksList.replaceChild(taskContainer, form);
    } else {
        predefinedTasksList.appendChild(taskContainer);
    }

    savePredefinedTasks(currentUser);
}

function savePredefinedTasks(user) {
    const predefinedTasksList = document.getElementById('predefined-tasks-list');
    const tasks = Array.from(predefinedTasksList.querySelectorAll('.predefined-task-container')).map(container => {
        const button = container.querySelector('.predefined-task-button');
        return {
            title: button.textContent,
            recipient: button.getAttribute('data-recipient'),
            urgency: button.getAttribute('data-urgency'),
            soundFile: button.getAttribute('data-sound')
        };
    });
    localStorage.setItem(`predefinedTasks_${user}`, JSON.stringify(tasks));
}

function loadPredefinedTasks(user) {
    const predefinedTasksList = document.getElementById('predefined-tasks-list');
    if (!predefinedTasksList) return;

    predefinedTasksList.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem(`predefinedTasks_${user}`) || '[]');

    tasks.forEach(task => {
        const taskContainer = document.createElement('div');
        taskContainer.classList.add('predefined-task-container');

        const taskButton = document.createElement('button');
        taskButton.textContent = task.title;
        taskButton.classList.add('predefined-task-button');
        taskButton.setAttribute('data-recipient', task.recipient);
        taskButton.setAttribute('data-urgency', task.urgency);
        taskButton.setAttribute('data-sound', task.soundFile);
        taskButton.addEventListener('click', () => {
            createTask(task.title, task.recipient, task.urgency, task.soundFile, user);
        });

        const controlsContainer = document.createElement('div');
        controlsContainer.classList.add('predefined-task-controls');

        const editButton = document.createElement('button');
        editButton.textContent = 'Modifier';
        editButton.classList.add('edit-predefined-task');
        editButton.addEventListener('click', () => {
            const editForm = createPredefinedTaskForm(task);
            taskContainer.replaceWith(editForm);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.classList.add('delete-predefined-task');
        deleteButton.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche prédéfinie ?')) {
                taskContainer.remove();
                savePredefinedTasks(user);
            }
        });

        controlsContainer.appendChild(editButton);
        controlsContainer.appendChild(deleteButton);

        taskContainer.appendChild(taskButton);
        taskContainer.appendChild(controlsContainer);
        predefinedTasksList.appendChild(taskContainer);
    });
}

function createTask(title, recipient, urgency, soundFile, sender) {
    const task = {
        id: Date.now(),
        title,
        recipient,
        urgency,
        soundFile,
        sender,
        createdAt: new Date().toISOString(),
        completed: false
    };

    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    localStorage.setItem('lastModified', Date.now());

    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}