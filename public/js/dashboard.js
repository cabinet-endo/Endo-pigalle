let lastKnownModification = 0;
let currentTasks = [];

document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    
    // Démarrer le polling
    setInterval(checkForUpdates, 1000);  // Vérifie toutes les secondes
});

function checkForUpdates() {
    const currentModification = localStorage.getItem('lastModified') || 0;
    if (currentModification > lastKnownModification) {
        updateDashboard();
        lastKnownModification = currentModification;
    }
}

function updateDashboard() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    const tasksByRecipient = {
        'Assistante': [],
        'Anne': [],
        'Arnaud': [],
        'Julien': []
    };

    tasks.forEach(task => {
        if (tasksByRecipient.hasOwnProperty(task.recipient)) {
            tasksByRecipient[task.recipient].push(task);
        }
    });

    for (const [recipient, recipientTasks] of Object.entries(tasksByRecipient)) {
        const tasksContainer = document.getElementById(`tasks-${recipient.toLowerCase()}`);
        if (tasksContainer) {
            tasksContainer.innerHTML = '';
            recipientTasks.forEach(task => {
                const taskElement = createTaskElement(task);
                tasksContainer.appendChild(taskElement);
            });
        }
    }

    // Vérifier les nouvelles tâches et jouer le son
    const newTasks = tasks.filter(task => !currentTasks.some(currentTask => currentTask.id === task.id));
    newTasks.forEach(newTask => {
        playNotificationSound(newTask.soundFile);
    });

    // Mettre à jour la liste des tâches actuelles
    currentTasks = tasks;
}

function createTaskElement(task) {
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
        <button class="complete-task" data-id="${task.id}">Marquer comme fait</button>
    `;
    taskElement.querySelector('.complete-task').addEventListener('click', (e) => {
        const taskId = parseInt(e.target.dataset.id);
        completeTask(taskId);
    });
    return taskElement;
}

function playNotificationSound(soundFile) {
    const audio = new Audio(`sounds/${soundFile}`);
    audio.play().catch(error => console.error('Error playing sound:', error));
}