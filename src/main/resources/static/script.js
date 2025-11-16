const API_URL = "http://localhost:8080";

// Seleciona os elementos da tela
const mensagemFinal = document.getElementById("mensagem-final");
const imagemJogador = document.getElementById("imagem-jogador");
const imagemComputador = document.getElementById("imagem-computador");
const placarJogadorSpan = document.getElementById("placar-jogador");
const placarComputadorSpan = document.getElementById("placar-computador");
const placarStreak = document.getElementById("streak-jogador");
const bgBody = document.getElementById("body");
const areaJogador = document.querySelector(".jogador-area");
const areaComputador = document.querySelector(".computador-area");

// NOVOS ELEMENTOS para a frescurice
const floatingScoreElement = document.getElementById("floating-score");
const scoreAnimationContainer = document.getElementById("score-animation-container");


const botaoPedra = document.getElementById("pedra");
const botaoPapel = document.getElementById("papel");
const botaoTesoura = document.getElementById("tesoura");

const EXTENSAO_IMAGEM = ".png";
let usuario_id = null;

let placarJogador = 0;
let placarComputador = 0;

botaoPedra.addEventListener("click", () => jogar("ROCK"));
botaoPapel.addEventListener("click", () => jogar("PAPER"));
botaoTesoura.addEventListener("click", () => jogar("SCISSORS"));

// -----------------------------------------------------------
// FUNÇÃO 1: BUSCAR DADOS INICIAIS
// -----------------------------------------------------------

async function fetchUserData() {
    if (!usuario_id) return;
    
    try {
        // CORREÇÃO: Usando a rota padronizada
        const response = await fetch(`${API_URL}/users/id/${usuario_id}`); 
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar dados do usuário. Status: ${response.status}`);
        }
        
        const userData = await response.json();
        
        const userName = userData.name || 'Jogador';
        const userStreak = userData.currentStreak || 0;
        const userScore = userData.score || 0; 
        
        mensagemFinal.textContent = `Bem-vindo(a), ${userName}! Escolha sua jogada.`;
        placarStreak.textContent = userStreak;
        
        // Atualiza o floating score e o torna visível
        floatingScoreElement.textContent = userScore;
        floatingScoreElement.style.opacity = 1;

        if (userStreak >= 3) {
            placarStreak.style.color = "gold";
            bgBody.style.backgroundColor = "#f0b160";
        }

    } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        mensagemFinal.textContent = "Erro ao carregar dados iniciais do usuário.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    usuario_id = urlParams.get('userId');

    if (!usuario_id) {
        usuario_id = localStorage.getItem('rps_userId');
    }

    if (usuario_id) {
        localStorage.setItem('rps_userId', usuario_id);
        fetchUserData();
    } else {
        alert('Sessão expirada ou não iniciada. Por favor, faça login.');
        window.location.href = 'login.html';
    }
});

// -----------------------------------------------------------
// FUNÇÃO 2: JOGAR (POST)
// -----------------------------------------------------------

async function jogar(escolhaUsuario) {
    if (!usuario_id) {
        mensagemFinal.textContent = "Erro: Usuário não logado.";
        return;
    }

    areaJogador.classList.remove("vencedor");
    areaComputador.classList.remove("vencedor");
    mensagemFinal.textContent = "Aguardando API...";

    imagemJogador.style.opacity = 0.5;
    imagemComputador.style.opacity = 0.5;

    const gameRequest = {
        userId: Number(usuario_id),
        userChoice: escolhaUsuario,
    };

    try {
        const response = await fetch(`${API_URL}/game`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(gameRequest),
        });

        if (response.status !== 201) {
            throw new Error(`Erro API ${response.status}: ${await response.text()}`);
        }

        const gameSalvo = await response.json();

        // ----------------------------------------------------------------------
        // Faz a SEGUNDA CHAMADA para pegar o SCORE e STREAK atualizados
        // ----------------------------------------------------------------------
        // CORREÇÃO: Usando a rota padronizada
        const userResponse = await fetch(`${API_URL}/users/id/${usuario_id}`);
        const userDataAtualizado = await userResponse.json();
        
        const newScore = userDataAtualizado.score || 0;
        const streakAtual = userDataAtualizado.currentStreak || 0;

        // Calcula a mudança de score (para animação)
        const oldScore = Number(floatingScoreElement.textContent);
        const scoreChange = newScore - oldScore;


        const escolhaComputador = gameSalvo.npcChoice;
        const resultadoApi = gameSalvo.result;

        // ATUALIZAÇÃO DA TELA
        imagemJogador.src = `${escolhaUsuario.toLowerCase()}${EXTENSAO_IMAGEM}`;
        imagemComputador.src = `${escolhaComputador.toLowerCase()}${EXTENSAO_IMAGEM}`;
        imagemJogador.style.opacity = 1;
        imagemComputador.style.opacity = 1;

        // Animação de virada (se tiver)
        imagemComputador.classList.add("imagem-invertida");

        // Passando newScore e scoreChange para processarResultado
        processarResultado(resultadoApi, streakAtual, newScore, scoreChange); 
    } catch (error) {
        mensagemFinal.textContent = "Erro ao conectar à API.";
        console.error("Erro no processo de jogo:", error);
    }
}

// -----------------------------------------------------------
// FUNÇÕES DE PROCESSAMENTO
// -----------------------------------------------------------
/**
 * Cria e anima um número de score subindo.
 * @param {number} value - O valor do score a ser exibido.
 * @param {string} type - 'gain', 'loss', ou 'draw' para a cor e tamanho.
 */
function animateScoreChange(value, type) {
    const scoreAnim = document.createElement('div');
    scoreAnim.textContent = (value > 0 ? '+' : '') + value;
    scoreAnim.classList.add('animated-score', type);
    
    // Posição inicial (aleatória na tela, mas focada perto do centro)
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
    const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 100;

    scoreAnim.style.left = `${startX}px`;
    scoreAnim.style.top = `${startY}px`;

    scoreAnimationContainer.appendChild(scoreAnim);

    // Remove o elemento após a animação
    scoreAnim.addEventListener('animationend', () => {
        scoreAnim.remove();
    });
}

/**
 * Aplica uma pequena animação no floatingScoreElement.
 */
function animateFloatingScoreHit() {
    floatingScoreElement.classList.remove('placar-score-hit'); // Reinicia a animação
    void floatingScoreElement.offsetWidth; // Força o reflow para reiniciar
    floatingScoreElement.classList.add('placar-score-hit');
}


/**
 * Processa o resultado da API (VICTORY, DEFEAT, DRAW) e atualiza o placar e brilhos.
 * @param {string} resultadoApi - O resultado retornado pela API (VICTORY, DEFEAT, DRAW).
 * @param {number} streakAtual - O streak atualizado do usuário.
 * @param {number} newScore - O score total ATUALIZADO do usuário.
 * @param {number} scoreChange - A diferença de score (ganho/perda) para a animação.
 */
function processarResultado(resultadoApi, streakAtual, newScore, scoreChange) {
    let mensagem = "";
    let animationType = 'draw'; // Padrão para empate

    areaJogador.classList.remove("vencedor");
    areaComputador.classList.remove("vencedor");

    if (resultadoApi === "VICTORY") {
        mensagem = "Você Venceu! 🎉";
        areaJogador.classList.add("vencedor");
        placarJogador++;
        animationType = 'gain';
    } else if (resultadoApi === "DEFEAT") {
        mensagem = "Você Perdeu! 😢";
        areaComputador.classList.add("vencedor");
        placarComputador++;
        animationType = 'loss';
    } else { // DRAW
        mensagem = "Empate!";
        animationType = 'draw';
    }

    // ANIMAÇÃO DE PONTOS SUBINDO
    if (scoreChange !== 0) { // Só anima se houve mudança
        animateScoreChange(scoreChange, animationType);
    }
    
    // Atualiza o floating score e aciona a animação de "hit"
    floatingScoreElement.textContent = newScore;
    animateFloatingScoreHit();


    placarStreak.textContent = streakAtual;

    if (streakAtual >= 3) {
        mensagemFinal.style.color = "black";
        bgBody.style.backgroundColor = "#f0b160";

        placarStreak.style.color = "gold";
        mensagem = "🔥 EM CHAMAS 🔥"; 
    } else {
        placarStreak.style.color = "black";
        bgBody.style.backgroundColor = "#ffffffff";
        mensagemFinal.style.color = "#2c3e50";
    }

    mensagemFinal.textContent = mensagem; 
    placarJogadorSpan.textContent = placarJogador;
    placarComputadorSpan.textContent = placarComputador;
}