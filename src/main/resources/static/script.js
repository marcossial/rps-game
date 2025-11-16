const API_URL = "http://localhost:8080";

// Seleciona os elementos da tela
const mensagemFinal = document.getElementById("mensagem-final");
const imagemJogador = document.getElementById("imagem-jogador");
const imagemComputador = document.getElementById("imagem-computador");
const placarScoreSpan = document.getElementById("placar-score");
const placarJogadorSpan = document.getElementById("placar-jogador");
const placarComputadorSpan = document.getElementById("placar-computador");
const placarStreak = document.getElementById("streak-jogador");
const bgBody = document.getElementById("body");
const areaJogador = document.querySelector(".jogador-area");
const areaComputador = document.querySelector(".computador-area");

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

async function fetchUserData() {
    if (!usuario_id) return;
    
    try {
        const response = await fetch(`${API_URL}/users/id/${usuario_id}`);
        
        if (!response.ok) {
            throw new Error(`Falha ao carregar dados do usuário. Status: ${response.status}`);
        }
        
        const userData = await response.json();
        
        const userName = userData.name || 'Jogador';
        const userStreak = userData.currentStreak || 0;
        const userScore = userData.score;
        
        mensagemFinal.textContent = `Bem-vindo(a), ${userName}! Escolha sua jogada.`;
        placarStreak.textContent = userStreak;
        placarScoreSpan.textContent = userScore;

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
    console.log(`usuario_id:${usuario_id}`);
    const response = await fetch(`${API_URL}/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameRequest),
    });

    if (response.status !== 201) {
      // Lida com erros do servidor (ex: 404, 500, falha de validação)
      throw new Error(`Erro API ${response.status}: ${await response.text()}`);
    }

    const gameSalvo = await response.json();

    const userResponse = await fetch(`${API_URL}/users/id/${usuario_id}`);
    const userDataAtualizado = await userResponse.json();
    const scoreAtual = userDataAtualizado.score || 0;
    const streakAtual = userDataAtualizado.currentStreak || 0;

    const escolhaComputador = gameSalvo.npcChoice;
    const resultadoApi = gameSalvo.result;

    imagemJogador.src = `${escolhaUsuario}${EXTENSAO_IMAGEM}`;
    imagemComputador.src = `${escolhaComputador}${EXTENSAO_IMAGEM}`;
    imagemJogador.style.opacity = 1;
    imagemComputador.style.opacity = 1;

    imagemComputador.classList.add("imagem-invertida");

    processarResultado(resultadoApi, streakAtual, scoreAtual);
  } catch (error) {
    mensagemFinal.textContent = "Erro ao conectar à API.";
    console.error("Erro no processo de jogo:", error);
  }
}

// -----------------------------------------------------------
// FUNÇÕES DE PROCESSAMENTO
// -----------------------------------------------------------
/**
 * Processa o resultado da API (VICTORY, DEFEAT, DRAW) e atualiza o placar e brilhos.
 * @param {string} resultadoApi - O resultado retornado pela API (VICTORY, DEFEAT, DRAW).
 * @param {number} streakAtual - O streak atualizado do usuário.
 * @param {number} scoreAtual - O score total atualizado do usuário.
 */
function processarResultado(resultadoApi, streakAtual, scoreAtual) {
  let mensagem = "";

  // Remove classes anteriores
  areaJogador.classList.remove("vencedor");
  areaComputador.classList.remove("vencedor");

  // Mapeamento dos ENUMs da API para a interface
  if (resultadoApi === "VICTORY") {
    mensagem = "Você Venceu! 🎉";
    vencedor = "jogador";
    areaJogador.classList.add("vencedor");
    placarJogador++;
  } else if (resultadoApi === "DEFEAT") {
    mensagem = "Você Perdeu! 😢";
    vencedor = "computador";
    areaComputador.classList.add("vencedor");
    placarComputador++;
  } else { // DRAW
    mensagem = "Empate!";
    vencedor = "empate";
  }

  placarStreak.textContent = streakAtual;
  placarScoreSpan.textContent = scoreAtual;

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