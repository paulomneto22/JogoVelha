
const casas = document.querySelectorAll(".casa");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");
const reiniciar = document.getElementById("reiniciar");
const novoJogo = document.getElementById("novoJogo");

const jogadorX = document.getElementById("jogadorX");
const jogadorO = document.getElementById("jogadorO");
const pontosX = document.getElementById("pontosX");
const pontosO = document.getElementById("pontosO");
const nomeJogadorO = document.getElementById("nomeJogadorO");

const modo2 = document.getElementById("modo2");
const modoIA = document.getElementById("modoIA");

let tabuleiro = ["", "", "", "", "", "", "", "", ""];
let jogadorAtual = "X";
let jogoAtivo = true;
let contraIA = false;
let placarX = 0;
let placarO = 0;
let pensando = false;
let numeroPartida = 0;

const combinacoes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// ATUALIZAR TURNO

function atualizarTurno() {
    jogadorX.classList.toggle("ativo", jogadorAtual === "X");
    jogadorO.classList.toggle("ativo", jogadorAtual === "O");

    if (contraIA && jogadorAtual === "O") {
        mensagem.textContent = "🤖 A IA está pensando...";
    } else {
        mensagem.textContent = "Vez do Jogador " + jogadorAtual;
    }

    document.querySelector(".indicador").style.background =
        jogadorAtual === "X" ? "#38bdf8" : "#fb7185";
}

// VERIFICAR VITÓRIA

function verificarVitoria() {
    for (let combinacao of combinacoes) {
        const [a, b, c] = combinacao;

        if (
            tabuleiro[a] !== "" &&
            tabuleiro[a] === tabuleiro[b] &&
            tabuleiro[a] === tabuleiro[c]
        ) {
            return combinacao;
        }
    }

    return null;
}

// MARCAR CASA

function marcarCasa(indice) {
    tabuleiro[indice] = jogadorAtual;
    casas[indice].textContent = jogadorAtual;
    casas[indice].classList.add(jogadorAtual.toLowerCase());
    casas[indice].disabled = true;
}

// JOGAR

function jogar(indice) {
    if (
        tabuleiro[indice] !== "" ||
        !jogoAtivo ||
        pensando ||
        (contraIA && jogadorAtual === "O")
    ) {
        return;
    }

    marcarCasa(indice);

    if (verificarFim()) {
        return;
    }

    trocarJogador();

    if (contraIA && jogadorAtual === "O") {
        pensando = true;
        atualizarTurno();

        const partidaAtual = numeroPartida;

        setTimeout(function() {
            if (
                partidaAtual === numeroPartida &&
                jogoAtivo &&
                contraIA &&
                jogadorAtual === "O"
            ) {
                jogarIA();
            }

            pensando = false;
        }, 600);
    }
}

// VERIFICAR FIM DE JOGO

function verificarFim() {
    const combinacao = verificarVitoria();

    if (combinacao) {
        jogoAtivo = false;

        combinacao.forEach(indice => {
            casas[indice].classList.add("vencedora");
        });

        if (jogadorAtual === "X") {
            placarX++;
            pontosX.textContent = placarX;
        } else {
            placarO++;
            pontosO.textContent = placarO;
        }

        if (contraIA) {
            mensagem.textContent = jogadorAtual === "X"
                ? "🏆 Você venceu!"
                : "🤖 A IA venceu!";
        } else {
            mensagem.textContent = "Jogador " + jogadorAtual + " venceu!";
        }

        resultado.textContent = "Parabéns! Fim da rodada.";

        jogadorX.classList.remove("ativo");
        jogadorO.classList.remove("ativo");

        return true;
    }

    if (!tabuleiro.includes("")) {
        jogoAtivo = false;
        mensagem.textContent = "Deu velha!";
        resultado.textContent = "Empate! Ninguém pontuou.";

        jogadorX.classList.remove("ativo");
        jogadorO.classList.remove("ativo");

        return true;
    }

    return false;
}

// TROCAR JOGADOR

function trocarJogador() {
    jogadorAtual = jogadorAtual === "X" ? "O" : "X";
    atualizarTurno();
}

// INTELIGÊNCIA ARTIFICIAL

function jogarIA() {
    if (!jogoAtivo || jogadorAtual !== "O") {
        return;
    }

    let indice = encontrarJogada("O");

    // Tenta vencer
    if (indice === -1) {
        indice = encontrarJogada("X");
    }

    // Prioriza o centro
    if (indice === -1 && tabuleiro[4] === "") {
        indice = 4;
    }

    // Procura um canto
    if (indice === -1) {
        const cantos = [0, 2, 6, 8].filter(
            i => tabuleiro[i] === ""
        );

        if (cantos.length > 0) {
            indice = cantos[
                Math.floor(Math.random() * cantos.length)
            ];
        }
    }

    // Escolhe outra casa vazia
    if (indice === -1) {
        const vazias = tabuleiro
            .map((casa, i) => casa === "" ? i : -1)
            .filter(i => i !== -1);

        if (vazias.length > 0) {
            indice = vazias[
                Math.floor(Math.random() * vazias.length)
            ];
        }
    }

    if (indice !== -1) {
        marcarCasa(indice);

        if (!verificarFim()) {
            trocarJogador();
        }
    }
}

// ENCONTRAR VITÓRIA OU BLOQUEIO

function encontrarJogada(simbolo) {
    for (let combinacao of combinacoes) {
        const quantidade = combinacao.filter(
            i => tabuleiro[i] === simbolo
        ).length;

        const vazias = combinacao.filter(
            i => tabuleiro[i] === ""
        );

        if (quantidade === 2 && vazias.length === 1) {
            return vazias[0];
        }
    }

    return -1;
}

// LIMPAR TABULEIRO

function limparTabuleiro() {
    numeroPartida++;

    tabuleiro = ["", "", "", "", "", "", "", "", ""];
    jogadorAtual = "X";
    jogoAtivo = true;
    pensando = false;

    casas.forEach(casa => {
        casa.textContent = "";
        casa.disabled = false;
        casa.classList.remove("x", "o", "vencedora");
    });

    resultado.textContent = contraIA
        ? "Você é X. A IA joga com O."
        : "Jogue com um amigo!";

    atualizarTurno();
}

// SELECIONAR MODO

function selecionarModo(ia) {
    contraIA = ia;

    modoIA.classList.toggle("selecionado", ia);
    modo2.classList.toggle("selecionado", !ia);

    nomeJogadorO.textContent = ia ? "Inteligência Artificial" : "Jogador 2";

    limparTabuleiro();
}

modo2.addEventListener("click", function() {
    selecionarModo(false);
});

modoIA.addEventListener("click", function() {
    selecionarModo(true);
});

// EVENTOS DAS CASAS

casas.forEach((casa, indice) => {
    casa.addEventListener("click", function() {
        jogar(indice);
    });
});

// REINICIAR PARTIDA

reiniciar.addEventListener("click", function() {
    limparTabuleiro();
});

// NOVO JOGO: ZERAR PLACAR

novoJogo.addEventListener("click", function() {
    placarX = 0;
    placarO = 0;

    pontosX.textContent = "0";
    pontosO.textContent = "0";

    limparTabuleiro();
});
