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

// --- NOVO: Define a extensão das suas imagens ---
// Mude para '.jpg', '.jpeg', '.gif' ou qualquer outra que você esteja usando
const EXTENSAO_IMAGEM = '.png'; 

// Opções possíveis para o computador
const opcoes = ['pedra', 'papel', 'tesoura'];

// Placar do jogo
let placarJogador = 0;
let placarComputador = 0;

// Adiciona "escutadores" de evento para cada botão
botaoPedra.addEventListener('click', () => jogar('pedra'));
botaoPapel.addEventListener('click', () => jogar('papel'));
botaoTesoura.addEventListener('click', () => jogar('tesoura'));

// Função principal do jogo
function jogar(escolhaUsuario) {
    // 1. Remove qualquer brilho anterior e limpa mensagens
    areaJogador.classList.remove('vencedor');
    areaComputador.classList.remove('vencedor');
    mensagemFinal.textContent = ''; // Limpa a mensagem antes de jogar

    // 2. Gera a escolha do computador
    const escolhaComputador = getEscolhaComputador();

    // 3. Mostra as imagens das escolhas
    // --- MUDANÇA AQUI: Usa a constante EXTENSAO_IMAGEM ---
    imagemJogador.src = `${escolhaUsuario}${EXTENSAO_IMAGEM}`; 
    imagemComputador.src = `${escolhaComputador}${EXTENSAO_IMAGEM}`;
    
    imagemJogador.style.opacity = 1; // Torna as imagens visíveis
    imagemComputador.style.opacity = 1;

    // 4. Determina o vencedor
    const resultado = determinarVencedor(escolhaUsuario, escolhaComputador);

    // 5. Atualiza o placar e a mensagem final
    mensagemFinal.textContent = resultado.mensagem;
    atualizarPlacar(resultado.vencedor); // 'jogador', 'computador' ou 'empate'
}

// Função para gerar a escolha aleatória do computador
function getEscolhaComputador() {
    const indiceAleatorio = Math.floor(Math.random() * 3);
    return opcoes[indiceAleatorio];
}

// Função para determinar o vencedor e quem "brilha"
function determinarVencedor(usuario, computador) {
    let mensagem = '';
    let vencedor = '';

    // Caso de Empate
    if (usuario === computador) {
        mensagem = 'Empate!';
        vencedor = 'empate';
    }
    // Casos de Vitória do Usuário
    else if (
        (usuario === 'pedra' && computador === 'tesoura') ||
        (usuario === 'papel' && computador === 'pedra') ||
        (usuario === 'tesoura' && computador === 'papel')
    ) {
        mensagem = 'Você Venceu! 🎉';
        vencedor = 'jogador';
        areaJogador.classList.add('vencedor'); // Adiciona brilho ao jogador
    }
    // Caso de Vitória do Computador
    else {
        mensagem = 'Você Perdeu! 😢';
        vencedor = 'computador';
        areaComputador.classList.add('vencedor'); // Adiciona brilho ao computador
    }

    return { mensagem, vencedor }; // Retorna um objeto com a mensagem e o vencedor
}

// Função para atualizar o placar
function atualizarPlacar(vencedor) {
    if (vencedor === 'jogador') {
        placarJogador++;
    } else if (vencedor === 'computador') {
        placarComputador++;
    }
    placarJogadorSpan.textContent = placarJogador;
    placarComputadorSpan.textContent = placarComputador;
}