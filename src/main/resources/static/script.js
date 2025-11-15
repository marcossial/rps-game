const API_URL = 'http://localhost:8080';

// Seleciona os elementos da tela
const mensagemFinal = document.getElementById('mensagem-final');
const imagemJogador = document.getElementById('imagem-jogador');
const imagemComputador = document.getElementById('imagem-computador');
const placarJogadorSpan = document.getElementById('placar-jogador');
const placarComputadorSpan = document.getElementById('placar-computador');

const areaJogador = document.querySelector('.jogador-area');
const areaComputador = document.querySelector('.computador-area');

const botaoPedra = document.getElementById('pedra');
const botaoPapel = document.getElementById('papel');
const botaoTesoura = document.getElementById('tesoura');

// --- VARIÁVEIS DE CONFIGURAÇÃO ---
const EXTENSAO_IMAGEM = '.png'; 
const USUARIO_ID = 1; // ID do Usuário Logado (Simulado)

// Placar local (mantido para exibição, mas o placar real deve vir da API/DB em uma aplicação completa)
let placarJogador = 0;
let placarComputador = 0; 
// ---------------------------------

// Adiciona "escutadores" de evento para cada botão
botaoPedra.addEventListener('click', () => jogar('ROCK'));
botaoPapel.addEventListener('click', () => jogar('PAPER'));
botaoTesoura.addEventListener('click', () => jogar('SCISSORS'));


// -----------------------------------------------------------
// FUNÇÃO PRINCIPAL: DELEGA A LÓGICA DO JOGO PARA O BACKEND
// -----------------------------------------------------------

async function jogar(escolhaUsuario) {
    // 1. Remove qualquer brilho anterior e prepara a tela
    areaJogador.classList.remove('vencedor');
    areaComputador.classList.remove('vencedor');
    mensagemFinal.textContent = 'Aguardando API...'; 
    
    imagemJogador.style.opacity = 0.5; // Efeito de carregamento
    imagemComputador.style.opacity = 0.5;

    // 2. Monta o DTO (enviando apenas o que é obrigatório)
    const gameRequest = {
        userId: USUARIO_ID,
        userChoice: escolhaUsuario
    };
    
    try {
        // 3. Faz a chamada POST para o backend
        const response = await fetch(`${API_URL}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameRequest),
        });

        if (response.status !== 201) {
            // Lida com erros do servidor (ex: 404, 500, falha de validação)
            throw new Error(`Erro API ${response.status}: ${await response.text()}`);
        }

        // 4. Recebe o objeto Game completo da API
        const gameSalvo = await response.json();
        
        // As escolhas e o resultado já vêm calculados do servidor
        const escolhaComputador = gameSalvo.npcChoice.toLowerCase(); 
        const resultadoApi = gameSalvo.result; 

        // 5. ATUALIZA A TELA COM OS DADOS DA API
        
        // Mostra as imagens
        imagemJogador.src = `${escolhaUsuario}${EXTENSAO_IMAGEM}`; 
        imagemComputador.src = `${escolhaComputador}${EXTENSAO_IMAGEM}`;
        imagemJogador.style.opacity = 1;
        imagemComputador.style.opacity = 1;


        // adicionar o imagem invertida
        imagemComputador.classList.add('imagem-invertida');

        // Processa o resultado e atualiza o placar
        processarResultado(resultadoApi);

    } catch (error) {
        mensagemFinal.textContent = 'Erro ao conectar à API.';
        console.error("Erro no processo de jogo:", error);
    }
}


// -----------------------------------------------------------
// FUNÇÕES DE PROCESSAMENTO
// -----------------------------------------------------------

/**
 * Processa o resultado da API (WIN, LOSS, DRAW) e atualiza o placar e brilhos.
 */
function processarResultado(resultadoApi) {
    let mensagem = '';
    let vencedor = '';

    // Remove classes anteriores
    areaJogador.classList.remove('vencedor');
    areaComputador.classList.remove('vencedor');

    // Mapeamento dos ENUMs da API para a interface
    if (resultadoApi === 'VICTORY') {
        mensagem = 'Você Venceu! 🎉';
        vencedor = 'jogador';
        areaJogador.classList.add('vencedor'); 
        placarJogador++;
    } else if (resultadoApi === 'DEFEAT') {
        mensagem = 'Você Perdeu! 😢';
        vencedor = 'computador';
        areaComputador.classList.add('vencedor'); 
        placarComputador++;
    } else { // DRAW
        mensagem = 'Empate!';
        vencedor = 'empate';
    }

    mensagemFinal.textContent = mensagem;
    placarJogadorSpan.textContent = placarJogador;
    placarComputadorSpan.textContent = placarComputador;
}

// Removidas as funções getEscolhaComputador e determinarVencedor
// pois a lógica agora está no GameLogicService (Backend)