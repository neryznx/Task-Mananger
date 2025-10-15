document.addEventListener('DOMContentLoaded', function() {

    // --- DADOS DA API ATUALIZADOS COM ESTADO DO TIMER ---
    const mockApiData = [
        {
            id: 1,
            client: 'Cliente A',
            type: 'Desenvolvimento de programa novo',
            sequentialNumber: '#001',
            openingDate: '01/10/2025 10:00',
            deadline: '03/10/2025 10:00',
            description: 'Desenvolver novo programa para controle de produção com interface de entrada de dados e relatórios personalizados.',
            remainingTime: '30h 25min',
            isUrgent: false,
            status: 'normal',
            timerStatus: 'stopped', // Estados: 'stopped', 'running', 'paused'
            elapsedSeconds: 0,
            timerId: null
        },
        {
            id: 2,
            client: 'Cliente B',
            type: 'Ajuste de programa existente',
            sequentialNumber: '#002',
            openingDate: '02/10/2025 09:00',
            deadline: '02/10/2025 15:00',
            description: 'Corrigir bug no módulo de faturamento que impede a emissão de notas fiscais para clientes do exterior.',
            remainingTime: '4h 15min',
            isUrgent: true,
            status: 'urgent',
            timerStatus: 'stopped',
            elapsedSeconds: 0,
            timerId: null
        },
        {
            id: 3,
            client: 'Cliente E',
            type: 'Desenvolvimento de programa novo',
            sequentialNumber: '#003',
            openingDate: '02/10/2025 11:30',
            deadline: '04/10/2025 11:30',
            description: 'Criar um dashboard de KPIs para a diretoria com atualização em tempo real dos dados de vendas.',
            remainingTime: '42h 30min',
            isUrgent: false,
            status: 'normal',
            timerStatus: 'stopped',
            elapsedSeconds: 0,
            timerId: null
        },
        {
            id: 4,
            client: 'Cliente F',
            type: 'Assistência Técnica',
            sequentialNumber: '#004',
            openingDate: '29/09/2025 14:00',
            deadline: '30/09/2025 14:00',
            description: 'Visita técnica para manutenção preventiva em equipamento de corte.',
            remainingTime: '-8h 45min',
            isUrgent: false,
            status: 'overdue',
            timerStatus: 'stopped',
            elapsedSeconds: 0,
            timerId: null
        }
    ];

    // --- REFERÊNCIAS E VARIÁVEIS DE ESTADO ---
    const taskListContainer = document.getElementById('task-list');
    const taskDetailContainer = document.getElementById('task-detail');
    const taskCountElement = document.getElementById('task-count');
    let currentSelectedTaskId = null;
    
    // --- ÍCONES SVG ---
    const clockIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    const playIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    const pauseIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
    const stopIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`;

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    function getStatusClass(status) {
        switch (status) {
            case 'urgent': return 'status-urgent';
            case 'overdue': return 'status-overdue';
            case 'normal': default: return 'status-normal';
        }
    }

    // CÓDIGO RESTAURADO
    function renderTaskList(tasks) {
        taskListContainer.innerHTML = '';
        if (tasks.length === 0) {
            taskListContainer.innerHTML = '<p class="placeholder">Nenhum chamado atribuído.</p>';
            return;
        }
        tasks.forEach(task => {
            const urgentTag = task.isUrgent ? '<span class="urgent-tag">Urgente</span>' : '';
            const statusClass = getStatusClass(task.status);
            const cardHTML = `
                <div class="task-card" data-id="${task.id}">
                    <div class="card-header">
                        <h3>${task.client}</h3>
                        ${urgentTag}
                    </div>
                    <p class="task-type">${task.type}</p>
                    <div class="time-info ${statusClass}">
                        ${clockIconSVG}
                        <span>${task.remainingTime}</span>
                    </div>
                </div>
            `;
            taskListContainer.innerHTML += cardHTML;
        });
        taskCountElement.textContent = `${tasks.length} chamados atribuídos`;
    }

    function renderTaskDetail(taskId) {
        currentSelectedTaskId = taskId;
        const task = mockApiData.find(t => t.id == taskId);

        if (!task) {
            taskDetailContainer.innerHTML = '<div class="placeholder">Selecione um chamado para ver os detalhes.</div>';
            return;
        }

        let footerHTML = '';
        switch (task.timerStatus) {
            case 'running':
                footerHTML = `<button class="btn-secondary" id="pause-btn">${pauseIconSVG} Pausar</button><button class="btn-primary" id="stop-btn">${stopIconSVG} Encerrar Atendimento</button>`;
                break;
            case 'paused':
                footerHTML = `<button class="btn-secondary" id="pause-btn">${playIconSVG} Continuar</button><button class="btn-primary" id="stop-btn">${stopIconSVG} Encerrar Atendimento</button>`;
                break;
            case 'stopped':
            default:
                footerHTML = `<button class="btn-primary" id="start-btn">${playIconSVG} Iniciar Atendimento</button>`;
                break;
        }

        // CÓDIGO RESTAURADO
        const detailHTML = `
            <header class="detail-header">
                <div>
                    <h2>${task.client}</h2>
                    <p>${task.type}</p>
                </div>
                <div class="due-date">
                    <span>Prazo final</span>
                    <strong>${task.deadline}</strong>
                </div>
            </header>
            <section class="detail-content">
                <div class="info-item">
                    <label>Número Sequencial</label>
                    <span>${task.sequentialNumber}</span>
                </div>
                <div class="info-item">
                    <label>Abertura</label>
                    <span>${task.openingDate}</span>
                </div>
                <div class="info-item-full">
                    <label>Descrição Completa</label>
                    <p class="description-box">${task.description}</p>
                </div>
            </section>
            <footer class="detail-footer">
                ${footerHTML}
            </footer>
        `;
        taskDetailContainer.innerHTML = detailHTML;
    }

    // --- FUNÇÕES DE CONTROLE DO TIMER ---
    function startTimer(taskId) {
        const task = mockApiData.find(t => t.id == taskId);
        if (!task || task.timerStatus === 'running') return;
        
        task.timerStatus = 'running';
        task.timerId = setInterval(() => {
            task.elapsedSeconds++;
        }, 1000);
        
        console.log(`Timer iniciado para a tarefa ${taskId}`);
        renderTaskDetail(taskId);
    }

    function pauseTimer(taskId) {
        const task = mockApiData.find(t => t.id == taskId);
        if (!task || task.timerStatus !== 'running') return;

        clearInterval(task.timerId);
        task.timerId = null;
        task.timerStatus = 'paused';
        
        console.log(`Timer pausado para a tarefa ${taskId}. Tempo decorrido: ${task.elapsedSeconds}s`);
        renderTaskDetail(taskId);
    }

    function stopTimer(taskId) {
        const task = mockApiData.find(t => t.id == taskId);
        if (!task || task.timerStatus === 'stopped') return;

        clearInterval(task.timerId);
        task.timerId = null;
        task.timerStatus = 'stopped';

        console.log(`Timer encerrado para a tarefa ${taskId}. Tempo total gasto: ${task.elapsedSeconds}s`);
        task.elapsedSeconds = 0;
        renderTaskDetail(taskId);
    }

    // --- EVENT LISTENERS ---

    taskListContainer.addEventListener('click', function(event) {
        const clickedCard = event.target.closest('.task-card');
        if (!clickedCard) return;

        const currentActive = taskListContainer.querySelector('.task-card.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }

        clickedCard.classList.add('active');
        const taskId = clickedCard.dataset.id;
        renderTaskDetail(taskId);
    });

    taskDetailContainer.addEventListener('click', function(event) {
        if (!currentSelectedTaskId) return;

        const task = mockApiData.find(t => t.id == currentSelectedTaskId);
        const targetButton = event.target.closest('button');

        if (!targetButton) return;

        switch (targetButton.id) {
            case 'start-btn':
                startTimer(currentSelectedTaskId);
                break;
            case 'stop-btn':
                stopTimer(currentSelectedTaskId);
                break;
            case 'pause-btn':
                if (task.timerStatus === 'running') {
                    pauseTimer(currentSelectedTaskId);
                } else if (task.timerStatus === 'paused') {
                    startTimer(currentSelectedTaskId); // Lógica do "Continuar"
                }
                break;
        }
    });

    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    renderTaskList(mockApiData);
    const firstCard = taskListContainer.querySelector('.task-card');
    if (firstCard) {
        firstCard.click();
    } else {
        renderTaskDetail(null);
    }
});