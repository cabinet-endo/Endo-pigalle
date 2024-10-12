document.addEventListener('DOMContentLoaded', loadArchivedTasks);

function loadArchivedTasks() {
    const archivedTasks = JSON.parse(localStorage.getItem('archivedTasks') || '[]');
    
    const tasksByRecipient = {
        'Assistante': [],
        'Anne': [],
        'Arnaud': [],
        'Julien': []
    };

    archivedTasks.forEach(task => {
        if (tasksByRecipient[task.recipient]) {
            tasksByRecipient[task.recipient].push(task);
        }
    });

    for (const [recipient, tasks] of Object.entries(tasksByRecipient)) {
        const tasksContainer = document.getElementById(`archived-tasks-${recipient.toLowerCase()}`);
        if (tasksContainer) {
            tasksContainer.innerHTML = '';
            tasks.forEach(task => {
                const taskElement = createArchivedTaskElement(task);
                tasksContainer.appendChild(taskElement);
            });
        }
    }
}

function createArchivedTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.dataset.id = task.id;
    if (task.urgency === 'urgent') {
        taskElement.classList.add('urgent');
    }
    taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>De: ${task.sender}</p>
        <p>Pour: ${task.recipient}</p>
        <p>Urgence: ${task.urgency}</p>
        <p>Créée le: ${new Date(task.createdAt).toLocaleString()}</p>
        <p>Terminée le: ${new Date(task.completedAt).toLocaleString()}</p>
        <button class="delete-archived" data-id="${task.id}">Supprimer</button>
    `;
    taskElement.querySelector('.delete-archived').addEventListener('click', (e) => {
        const taskId = parseInt(e.target.dataset.id);
        deleteArchivedTask(taskId);
        taskElement.remove();
    });
    return taskElement;
}

function deleteArchivedTask(taskId) {
    const archivedTasks = JSON.parse(localStorage.getItem('archivedTasks') || '[]');
    const updatedTasks = archivedTasks.filter(task => task.id !== taskId);
    localStorage.setItem('archivedTasks', JSON.stringify(updatedTasks));
}