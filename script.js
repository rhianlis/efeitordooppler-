
const formulario = document.getElementById("dopplerForm");

const campoObservador = document.getElementById("observador");
const campoFonte = document.getElementById("fonte");
const campoSom = document.getElementById("som");
const campoFrequencia = document.getElementById("frequencia");

const resultado = document.getElementById("frequenciaResultado");
const interpretacao = document.getElementById("interpretacao");
const variacao = document.getElementById("variacao");
const fator = document.getElementById("fator");
const erro = document.getElementById("erro");

function calcularDoppler(evento) {
    evento.preventDefault();

    // Ler os dados informados pelo usuário
    const vo = Number(campoObservador.value);
    const vs = Number(campoFonte.value);
    const v = Number(campoSom.value);
    const f = Number(campoFrequencia.value);

    // Validar os valores
    if (
        campoObservador.value.trim() === "" ||
        campoFonte.value.trim() === "" ||
        campoSom.value.trim() === "" ||
        campoFrequencia.value.trim() === "" ||
        ![vo, vs, v, f].every(Number.isFinite)
    ) {
        mostrarErro("Preencha todos os campos com números válidos.");
        return;
    }

    if (v <= 0 || f <= 0) {
        mostrarErro(
            "A velocidade do som e a frequência devem ser maiores que zero."
        );
        return;
    }

    // Este modelo considera a fonte em regime subsônico.
    if (Math.abs(vs) >= v) {
        mostrarErro(
            "Para este modelo, o módulo da velocidade da fonte " +
            "deve ser menor que a velocidade do som."
        );
        return;
    }

    // Fórmula do efeito Doppler para o som
    const frequenciaPercebida = f * (v + vo) / (v - vs);

    if (!Number.isFinite(frequenciaPercebida) ||
        frequenciaPercebida <= 0) {
        mostrarErro(
            "Os valores informados não produzem uma frequência " +
            "percebida positiva neste modelo."
        );
        return;
    }

    // Calcular a variação percentual em relação à fonte
    const variacaoPercentual =
        ((frequenciaPercebida - f) / f) * 100;

    const fatorDoppler = frequenciaPercebida / f;

    // Exibir os resultados
    resultado.textContent = frequenciaPercebida.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

    variacao.textContent =
        `${variacaoPercentual > 0 ? "+" : ""}` +
        `${variacaoPercentual.toLocaleString("pt-BR", {
            maximumFractionDigits: 2
        })}%`;

    fator.textContent = fatorDoppler.toLocaleString("pt-BR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    });

    // Interpretar a mudança na frequência
    const tolerancia = 1e-9;

    if (variacaoPercentual > tolerancia) {
        interpretacao.textContent =
            "A frequência aumentou: o som é percebido mais agudo.";
    } else if (variacaoPercentual < -tolerancia) {
        interpretacao.textContent =
            "A frequência diminuiu: o som é percebido mais grave.";
    } else {
        interpretacao.textContent =
            "A frequência percebida é igual à frequência emitida.";
    }

    erro.textContent = "";
}

function mostrarErro(mensagem) {
    erro.textContent = mensagem;

    resultado.textContent = "—";
    variacao.textContent = "—";
    fator.textContent = "—";

    interpretacao.textContent =
        "Corrija os dados para realizar o cálculo.";
}

formulario.addEventListener("submit", calcularDoppler);

// Restaurar os valores iniciais e limpar os resultados
document.getElementById("limpar").addEventListener("click", () => {
    formulario.reset();

    resultado.textContent = "—";
    variacao.textContent = "—";
    fator.textContent = "—";

    interpretacao.textContent =
        "Insira os dados e calcule a frequência.";

    erro.textContent = "";
});

