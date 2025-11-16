const API_URL = 'http://localhost:8080';
const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const statusMessage = document.getElementById('status-message');

function displayStatusMessage(message, type = 'error') {
    statusMessage.textContent = message;
    statusMessage.className = type;
    statusMessage.classList.remove('hidden');

    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 5000);
}

function handleSuccess(user) {
    const userId = user.id;
    const userName = user.name;

    localStorage.setItem('rps_userId', userId);
    localStorage.setItem('rps_userName', userName);
    
    window.location.href = `game.html?userId=${userId}`;
}

async function createUser(name) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ name: name })
        });

        if (response.status === 201) {
            const user = await response.json();
            displayStatusMessage(`Novo usuário "${name}" criado com sucesso.`, 'success');
            handleSuccess(user);
        } else {
            const errorText = await response.text();
            throw new Error(`Falha na criação. Status: ${response.status}. Detalhes: ${errorText.substring(0, 50)}...`);
        }
    } catch (error) {
        displayStatusMessage('Erro na criação do usuário. Verifique o console.', 'error');
        console.error("Erro no processo de criação:", error);
    }
}

async function loginUser(event) {
    event.preventDefault();

    const name = usernameInput.value.trim();
    if (!name) {
        displayStatusMessage('Por favor, digite um nome de usuário.');
        return;
    }
    
    try {
        displayStatusMessage('Buscando usuário...', 'success');
        const searchResponse = await fetch(`${API_URL}/users/name/${name}`);

        if (searchResponse.ok) { // Status 200 OK
            // 2. Usuário ENCONTRADO
            const user = await searchResponse.json();
            displayStatusMessage(`Bem-vindo de volta, ${user.name}!`, 'success');
            handleSuccess(user);
        } else if (searchResponse.status === 404) {
            // 3. Usuário NÃO ENCONTRADO (404), prossegue para a criação
            displayStatusMessage('Usuário não encontrado. Criando novo...', 'success');
            await createUser(name);
        } else {
            // 4. Outros erros na busca (ex: 500 Internal Server Error)
            const errorText = await searchResponse.text();
            throw new Error(`Erro na busca. Status: ${searchResponse.status}. Detalhes: ${errorText.substring(0, 50)}...`);
        }

    } catch (error) {
        console.error("Erro de conexão/API:", error);
        displayStatusMessage(`Erro ao tentar acessar a API: ${error.message || 'Verifique o console.'}`, 'error');
    }
}

form.addEventListener('submit', loginUser);