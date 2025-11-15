const API_URL = 'http://localhost:8080';

let currentUserId = null;

function displayStatusMessage(message, type = 'success') {
    const statusDiv = document.getElementById('status-message');
    statusDiv.textContent = message;
    
    statusDiv.className = 'container';
    statusDiv.classList.add(type, 'visible');
    
    setTimeout(() => {
        statusDiv.classList.remove('visible');
    }, 5000); 
}

function renderTable(tableId, data, isGame) {
    const tbody = document.getElementById(tableId).querySelector('tbody');
    tbody.innerHTML = ''; 

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Nenhum registro encontrado.</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = tbody.insertRow();
        const id = item.id;
        
        if (isGame) {
            // Colunas da tabela de Jogos
            row.insertCell().textContent = id;

            const userIdText = item.user ? item.user.id : (item.userId || 'N/A (Erro)');
            row.insertCell().textContent = item.user.id;

            row.insertCell().textContent = new Date(item.date).toLocaleString();
            row.insertCell().textContent = item.userChoice;
            row.insertCell().textContent = item.npcChoice;
            row.insertCell().textContent = item.result;
            
            // Botão de Excluir Jogo
            const actionCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteResource('game', id);
            actionCell.appendChild(deleteButton);
            
        } else {
            // Colunas da tabela de Usuários
            row.insertCell().textContent = id;
            row.insertCell().textContent = item.name || 'N/A';
            
            // Botão de Excluir Usuário
            const actionCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteResource('users', id);
            actionCell.appendChild(deleteButton);
        }
    });
}

function renderUserTable(data) {
    const tbody = document.getElementById('user-table').querySelector('tbody');
    tbody.innerHTML = ''; 

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum usuário encontrado.</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = tbody.insertRow();
        const id = item.id;
        
        row.insertCell().textContent = id;
        row.insertCell().textContent = item.name || 'N/A';
        
        row.onclick = () => filterGamesByUser(id, item.name);

        const actionCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = (e) => {
             e.stopPropagation();
             deleteResource('users', id);
        };
        actionCell.appendChild(deleteButton);
    });
}

function filterGamesByUser(userId, userName) {
    currentUserId = userId; // Define o novo filtro
    document.getElementById('current-filter').innerHTML = `Filtro Atual: **${userName} (ID: ${userId})**`;
    fetchGames(); // Recarrega os jogos com o filtro
}

async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Falha ao carregar usuários');
        const users = await response.json();
        renderUserTable(users);

        document.getElementById('status-message').classList.remove('visible');

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        displayStatusMessage('Erro ao carregar usuários. Verifique o console.', 'error');
    }
}

async function fetchGames() {
    const endpoint = currentUserId 
        ? `${API_URL}/game?users/${currentUserId}`
        : `${API_URL}/game`;
        
    if (!currentUserId) {
        document.getElementById('current-filter').innerHTML = 'Filtro Atual: **TODOS**';
    }

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Falha ao carregar jogos');
        const games = await response.json();
        renderTable('game-table', games, true);

        document.getElementById('status-message').classList.remove('visible');

    } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        displayStatusMessage('Erro ao carregar jogos. Verifique o console.', 'error');
    }
}

async function deleteResource(resource, id) {
    if (!confirm(`Tem certeza que deseja excluir o ID ${id} de ${resource}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${resource}/id/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 204) { // 204 No Content
            displayStatusMessage(`Recurso ID ${id} excluído com sucesso.`, 'success');
        } else if (response.status === 404) {
            displayStatusMessage(`Recurso ID ${id} não encontrado.`, 'error');
        } else {
            throw new Error(`Erro ${response.status} ao excluir.`);
        }
        
        // Atualiza a lista relevante após a exclusão
        if (resource === 'game') {
            fetchGames();
        } else if (resource === 'users') {
            fetchUsers();
        }

    } catch (error) {
        console.error(`Erro ao deletar ${resource}:`, error);
        displayStatusMessage(`Erro ao deletar: ${error.message}`, 'error');
    }
}

async function createUser() {
    const name = document.getElementById('new-username').value;
    if (!name) {
        displayStatusMessage('O nome do usuário é obrigatório.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        if (response.status === 201) {
            displayStatusMessage(`Usuário "${name}" adicionado com sucesso.`, 'success');
            document.getElementById('new-username').value = '';
            fetchUsers();
        } else {
            throw new Error(`Erro ${response.status} ao adicionar usuário.`);
        }
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        displayStatusMessage('Falha na criação do usuário. Verifique o console.', 'error');
    }
}

async function createGame() {
    const userId = document.getElementById('new-game-user-id').value;
    const userChoice = document.getElementById('new-game-choice').value;

    if (!userId || !userChoice) {
        displayStatusMessage('ID do jogador e escolha são obrigatórios.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: Number(userId), userChoice: userChoice })
        });

        if (response.status === 201) {
            displayStatusMessage(`Jogo para o User ID ${userId} adicionado com sucesso.`, 'success');
            document.getElementById('new-game-user-id').value = '';
            fetchGames();
        } else {
             // Tratamento para 404/500 caso o usuário não exista no backend
            const errorText = await response.text();
            displayStatusMessage(`Falha ao adicionar jogo. Status ${response.status}. Detalhes: ${errorText.substring(0, 100)}...`, 'error'); // ALTERADO
        }
    } catch (error) {
        console.error("Erro ao criar jogo:", error);
        displayStatusMessage('Falha na criação do jogo. Verifique o console.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    
    currentUserId = null; 
    fetchGames(); 
});