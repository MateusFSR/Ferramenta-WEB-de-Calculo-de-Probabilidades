const cores = [
    'verde', 'vermelho', 'preto', 'vermelho', 'preto', 'vermelho',
    'preto', 'vermelho', 'preto', 'vermelho', 'preto', 'preto',
    'vermelho', 'preto', 'vermelho', 'preto', 'vermelho', 'preto',
    'vermelho', 'vermelho', 'preto', 'vermelho', 'preto', 'vermelho',
    'preto', 'vermelho', 'preto', 'preto', 'vermelho', 'preto',
    'vermelho', 'preto', 'vermelho', 'preto', 'vermelho', 'preto', 'vermelho'
];

const Coluna_1C = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const Coluna_2C = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const Coluna_3C = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

const tamanhoMaximo = 50;
let ultimosNumeros = [];

function contarTotalOcorrencias(coluna, contador) {
    return coluna.reduce((acc, numero) => acc + (contador[numero] || 0), 0);
}

function calcularPercentuais() {
    const contador = ultimosNumeros.reduce((acc, numero) => {
        acc[numero] = (acc[numero] || 0) + 1;
        return acc;
    }, {});

    const totalOcorrenciasColuna_1C = contarTotalOcorrencias(Coluna_1C, contador);
    const totalOcorrenciasColuna_2C = contarTotalOcorrencias(Coluna_2C, contador);
    const totalOcorrenciasColuna_3C = contarTotalOcorrencias(Coluna_3C, contador);

    return {
        'Coluna_1C': (totalOcorrenciasColuna_1C / tamanhoMaximo) * 100,
        'Coluna_2C': (totalOcorrenciasColuna_2C / tamanhoMaximo) * 100,
        'Coluna_3C': (totalOcorrenciasColuna_3C / tamanhoMaximo) * 100
    };
}

function determinarColunaEClassificacao(numero) {
    const percentuais = calcularPercentuais();
    let coluna = 'Nenhuma coluna';
    let percentual = 0;

    if (Coluna_1C.includes(numero)) {
        coluna = 'Coluna_1C';
        percentual = percentuais['Coluna_1C'];
    } else if (Coluna_2C.includes(numero)) {
        coluna = 'Coluna_2C';
        percentual = percentuais['Coluna_2C'];
    } else if (Coluna_3C.includes(numero)) {
        coluna = 'Coluna_3C';
        percentual = percentuais['Coluna_3C'];
    }

    const classificacao = percentual < 20 ? 'fraca' : percentual < 50 ? 'média' : 'alta';
    return { coluna, percentual, classificacao };
}

function sugestaoAcao(colunaAtual, percentualAtual, percentuais) {
    if (percentualAtual <= 26) {
        const outrasColunas = Object.entries(percentuais)
            .filter(([col, perc]) => col !== colunaAtual && perc > percentualAtual)
            .sort((a, b) => b[1] - a[1]);

        if (outrasColunas.length >= 2) {
            return `Entrar na coluna ${outrasColunas[0][0]} e coluna ${outrasColunas[1][0]}`;
        } else if (outrasColunas.length === 1) {
            return `Entrar na coluna ${outrasColunas[0][0]}`;
        } else {
            return 'Nenhuma coluna com percentual maior disponível.';
        }
    } else {
        return 'Nenhuma ação necessária.';
    }
}

function adicionarNumero() {
    const numeroInput = document.getElementById('numeroInput');
    const numero = parseInt(numeroInput.value);

    if (!isNaN(numero) && numero >= 0 && numero <= 36) {
        if (ultimosNumeros.length === tamanhoMaximo) {
            ultimosNumeros.shift();
        }
        ultimosNumeros.push(numero);

        const listaNumeros = document.getElementById('listaNumeros');
        const divNumero = document.createElement('div');
        divNumero.className = `cor-${cores[numero]}`; // Define a classe com base na cor
        divNumero.textContent = numero;
        listaNumeros.insertBefore(divNumero, listaNumeros.firstChild); // Adiciona no topo

        atualizarTabela();

        const { coluna, percentual, classificacao } = determinarColunaEClassificacao(numero);
        const resultadoDiv = document.getElementById('resultado');
        resultadoDiv.innerHTML = `
            <h2>______________________ROLL CALCULATE______________________<h2>
            1C: ${calcularPercentuais().Coluna_1C.toFixed(0)}%<br>
            2C: ${calcularPercentuais().Coluna_2C.toFixed(0)}%<br>
            3C: ${calcularPercentuais().Coluna_3C.toFixed(0)}%<br>
            <hr>
            Números Contabilizados: ${ultimosNumeros.length}<br>
            <hr>
            Último Número Contabilizado: ${numero}<br>
            <hr>
            Ação a Ser Tomada: ${sugestaoAcao(coluna, percentual, calcularPercentuais())}<br>
            <hr>
        `;

        numeroInput.value = '';
    } else {
        alert('Por favor, insira um número válido entre 0 e 36.');
    }
}

function corrigirUltimaEntrada() {
    const listaNumeros = document.getElementById('listaNumeros');
    const ultimoNumero = listaNumeros.firstChild;

    if (ultimoNumero) {
        const novoNumero = parseInt(document.getElementById('numeroInput').value);

        if (!isNaN(novoNumero) && novoNumero >= 0 && novoNumero <= 36) {
            ultimosNumeros = ultimosNumeros.filter(num => num !== parseInt(ultimoNumero.textContent));
            ultimosNumeros.push(novoNumero);

            listaNumeros.removeChild(ultimoNumero);

            const divNumero = document.createElement('div');
            divNumero.className = `cor-${cores[novoNumero]}`;
            divNumero.textContent = novoNumero;
            listaNumeros.insertBefore(divNumero, listaNumeros.firstChild);

            atualizarTabela();

            const { coluna, percentual, classificacao } = determinarColunaEClassificacao(novoNumero);
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.innerHTML = `
                % 1C: ${calcularPercentuais().Coluna_1C.toFixed(2)}%<br>
                % 2C: ${calcularPercentuais().Coluna_2C.toFixed(2)}%<br>
                % 3C: ${calcularPercentuais().Coluna_3C.toFixed(2)}%<br>
                <hr>
                Quantidade de números contabilizados: ${ultimosNumeros.length}<br>
                <hr>
                Último número contabilizado: ${novoNumero}<br>
                <hr>
                Ação a ser tomada: ${sugestaoAcao(coluna, percentual, calcularPercentuais())}<br>
                <hr>
            `;

            numeroInput.value = '';
        } else {
            alert('Por favor, insira um número válido entre 0 e 36.');
        }
    } else {
        alert('Nenhuma entrada para corrigir.');
    }
}

function resetarContagem() {
    ultimosNumeros = [];
    const listaNumeros = document.getElementById('listaNumeros');
    listaNumeros.innerHTML = '';
    atualizarTabela();
    document.getElementById('resultado').innerHTML = '';
}

function atualizarTabela() {
    const tabela = document.getElementById('tabelaCores').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    const tabelaDados = [
        [0, 0, 0], // Atualize aqui para ter 0 ocupando três colunas
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [10, 11, 12],
        [13, 14, 15],
        [16, 17, 18],
        [19, 20, 21],
        [22, 23, 24],
        [25, 26, 27],
        [28, 29, 30],
        [31, 32, 33],
        [34, 35, 36]
    ];

    // Obtém o último número inserido
    const ultimoNumero = ultimosNumeros.length > 0 ? ultimosNumeros[ultimosNumeros.length - 1] : null;

    tabelaDados.forEach((linha) => {
        const row = tabela.insertRow();
        if (linha[0] === 0) { // Se for a linha com o 0
            const cell = row.insertCell();
            cell.colSpan = 3; // Mescla três colunas
            cell.className = 'topo-0';
            cell.textContent = '0';
        } else {
            linha.forEach((valor) => {
                const cell = row.insertCell();
                // Adiciona a classe de destaque se o valor for o último número inserido
                cell.className = valor === ultimoNumero ? `cor-${cores[valor]} cor-destaque` : `cor-${cores[valor]}`;
                cell.textContent = valor;
            });
        }
    });
}

document.getElementById('numeroInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        adicionarNumero();
    }
});
