let extrato = document.getElementById("tbExtrato");
let index, identificadorCodigo;
let extratoTotal = [];
let mensagemContato = [];
let primeiroItem = false;
let dataInicial = null;
let dataFinal = null;

btnImg01.onclick = () => {
    document.querySelector('#principal-div').innerHTML = `<img id="principal" src="assets/img/imagem01.png">`;
}

btnImg02.onclick = () => {
    document.querySelector('#principal-div').innerHTML = `<img id="principal" src="assets/img/imagem02.png">`;
}
btnImg03.onclick = () => {
    document.querySelector('#principal-div').innerHTML = `<img id="principal" src="assets/img/imagem03.png">`;
}

function incluirExtrato(data, codigo, descricao, valor, detalhes) {


    if (!codigoExiste(codigo)) {
        if (codigo != "" && descricao != "" && valor != "" && data != '') {
            armazenamentoLocalIncluir(data, codigo, descricao, valor, detalhes);
            preencheCamposForm();
            armazenamentoLocalListarPorData();
        } else
            alert("Possui compos vazios");
    } else alert("Código existente");

}
function codigoExiste(novoCodigo) {
    if (extratoTotal)
        for (let i = 0; i < extratoTotal.length; i++) {
            if (extratoTotal[i].codigo == novoCodigo)
                return true;
        }

    primeiroItem = true;
    return false;
}

function tabelaInicial() {
    let extrato = JSON.parse(localStorage.getItem('Extrato'));
    if (extrato == null) {

        localStorage.setItem('Extrato', JSON.stringify(extratoTotal));
    } else
        armazenamentoLocalListarPorData();
}

function altPessoa(data, codigo, descricao, valor, detalhes) {

    extrato.rows[index].cells[0].innerHTML = data;
    extrato.rows[index].cells[1].innerHTML = codigo;
    extrato.rows[index].cells[2].innerHTML = descricao;
    extrato.rows[index].cells[3].innerHTML = valor;
    extrato.rows[index].cells[4].innerHTML = detalhes;


    extratoTotal = JSON.parse(localStorage.getItem('Extrato'));

    for (i = 0; i < extratoTotal.length; i++) {
        if (extratoTotal[i].codigo == codigo) {
            extratoTotal[i].codigo = codigo;
            extratoTotal[i].data = data;
            extratoTotal[i].descricao = descricao;
            extratoTotal[i].valor = valor;
            extratoTotal[i].detalhes = detalhes;
        }
    }

    localStorage.setItem('Extrato', JSON.stringify(extratoTotal));
    armazenamentoLocalListarPorData();
}

function preencheCamposForm() {
    for (var i = 2; i < extrato.rows.length; i++) {
        extrato.rows[i].onclick = function () {
            index = this.rowIndex;
            identificadorCodigo = extrato.rows[index].cells[1].innerText;
            document.getElementById("txtData").value = extrato.rows[index].cells[0].innerText;
            document.getElementById("txtCodigo").value = extrato.rows[index].cells[1].innerText;
            document.getElementById("txtDescricao").value = extrato.rows[index].cells[2].innerText;
            document.getElementById("txtValor").value = extrato.rows[index].cells[3].innerText;
            document.getElementById("txtDetalhes").value = extrato.rows[index].cells[5].innerText;
        }
    }
}



function armazenamentoLocalExcluir() {
    extratoTotal = JSON.parse(localStorage.getItem('Extrato'));

    if (index > 1) {

        for (i = 0; i < extratoTotal.length; i++) {

            if (extratoTotal[i].codigo == identificadorCodigo) {
                extrato.deleteRow(index);
                extratoTotal.splice(i, 1);
                
            }
        }
    }
    localStorage.setItem('Extrato', JSON.stringify(extratoTotal));
    armazenamentoLocalListarPorData();
}

function armazenamentoLocalIncluir(data, codigo, descricao, valor, detalhes) {
    let extrato = {};
    extrato.codigo = codigo;
    extrato.data = data;
    extrato.descricao = descricao;
    extrato.valor = valor;
    extrato.detalhes = detalhes;

    extratoTotal.push(extrato);
    localStorage.setItem('Extrato', JSON.stringify(extratoTotal));
}


function armazenamentoLocalListarPorCodigo() {
    let valorTotal = 0;
    extratoTotal = JSON.parse(localStorage.getItem('Extrato'));
    while (extrato.rows.length > 2)
        extrato.deleteRow(2);

    extratoTotal.sort(function (a, b) {
        return +(a.codigo) < +(b.codigo) ? -1 : +(a.codigo) > +(b.codigo) ? 1 : 0;
    });
    listar(extratoTotal);
    preencheCamposForm();
}

function armazenamentoLocalListarPorData() {
    let valorTotal = 0;
    extratoTotal = JSON.parse(localStorage.getItem('Extrato'));

    while (extrato.rows.length > 2)
        extrato.deleteRow(2);

    extratoTotal.sort(function (a, b) {
        return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
    });
    listar(extratoTotal);
}

function armazenamentoLocalListarPorEntrada() {
    let valorTotal = 0;
    extratoTotal = JSON.parse(localStorage.getItem('Extrato'));

    while (extrato.rows.length > 2)
        extrato.deleteRow(2);

    extratoTotal.sort(function (a, b) {
        return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
    });
    if (porDataInicialFinal()) {
        for (let i = 0; i < extratoTotal.length; i++) {

            let linha = extrato.insertRow(i + 2);
            if (!(i % 2 === 0))
                linha.style.background = "#E8E8E8";
            if (extratoTotal[i].valor > 0) {
                let cellData = linha.insertCell(0);
                let cellCodigo = linha.insertCell(1);
                let cellDescricao = linha.insertCell(2);
                let cellValor = linha.insertCell(3);
                let cellSaldo = linha.insertCell(4);
                let cellDetalhes = linha.insertCell(5);
                valorTotal += +extratoTotal[i].valor;


                if (extratoTotal[i].valor < 0)
                    cellValor.style.color = "red";
                cellCodigo.innerHTML = extratoTotal[i].codigo;
                cellData.innerHTML = extratoTotal[i].data;
                cellDescricao.innerHTML = extratoTotal[i].descricao;
                cellValor.innerHTML = extratoTotal[i].valor;
                cellDetalhes.innerHTML = extratoTotal[i].detalhes;
                if (valorTotal < 0)
                    cellSaldo.style.color = "red";
                cellSaldo.innerHTML = valorTotal;
            }
        }
    } else {
        for (let i = 0; i < extratoTotal.length; i++) {

            let linha = extrato.insertRow(i + 2);
            if (!(i % 2 === 0))
                linha.style.background = "#E8E8E8";
            if (extratoTotal[i].valor > 0) {
                if (extratoTotal[i].data >= dataInicial && extratoTotal[i].data <= dataFinal) {
                    let cellData = linha.insertCell(0);
                    let cellCodigo = linha.insertCell(1);
                    let cellDescricao = linha.insertCell(2);
                    let cellValor = linha.insertCell(3);
                    let cellSaldo = linha.insertCell(4);
                    let cellDetalhes = linha.insertCell(5);
                    valorTotal += +extratoTotal[i].valor;


                    if (extratoTotal[i].valor < 0)
                        cellValor.style.color = "red";
                    cellCodigo.innerHTML = extratoTotal[i].codigo;
                    cellData.innerHTML = extratoTotal[i].data;
                    cellDescricao.innerHTML = extratoTotal[i].descricao;
                    cellValor.innerHTML = extratoTotal[i].valor;
                    cellDetalhes.innerHTML = extratoTotal[i].detalhes;
                    if (valorTotal < 0)
                        cellSaldo.style.color = "red";
                    cellSaldo.innerHTML = valorTotal;
                }
            }
        }
    }

    preencheCamposForm();
}

function armazenamentoLocalListarPorSaida() {
    let valorTotal = 0;
    extratoTotal = JSON.parse(localStorage.getItem('Extrato'));

    while (extrato.rows.length > 2)
        extrato.deleteRow(2);

    extratoTotal.sort(function (a, b) {
        return a.data < b.data ? -1 : a.data > b.data ? 1 : 0;
    });
    if (porDataInicialFinal()) {
        for (let i = 0; i < extratoTotal.length; i++) {

            let linha = extrato.insertRow(i + 2);
            if (!(i % 2 === 0))
                linha.style.background = "#E8E8E8";
            if (extratoTotal[i].valor < 0) {
                let cellData = linha.insertCell(0);
                let cellCodigo = linha.insertCell(1);
                let cellDescricao = linha.insertCell(2);
                let cellValor = linha.insertCell(3);
                let cellSaldo = linha.insertCell(4);
                let cellDetalhes = linha.insertCell(5);
                valorTotal += +extratoTotal[i].valor;


                if (extratoTotal[i].valor < 0)
                    cellValor.style.color = "red";
                cellCodigo.innerHTML = extratoTotal[i].codigo;
                cellData.innerHTML = extratoTotal[i].data;
                cellDescricao.innerHTML = extratoTotal[i].descricao;
                cellValor.innerHTML = extratoTotal[i].valor;
                cellDetalhes.innerHTML = extratoTotal[i].detalhes;
                if (valorTotal < 0)
                    cellSaldo.style.color = "red";
                cellSaldo.innerHTML = valorTotal;
            }
        }
    } else {
        for (let i = 0; i < extratoTotal.length; i++) {

            let linha = extrato.insertRow(i + 2);
            if (!(i % 2 === 0))
                linha.style.background = "#E8E8E8";
            if (extratoTotal[i].valor < 0) {
                if (extratoTotal[i].data >= dataInicial && extratoTotal[i].data <= dataFinal) {
                    let cellData = linha.insertCell(0);
                    let cellCodigo = linha.insertCell(1);
                    let cellDescricao = linha.insertCell(2);
                    let cellValor = linha.insertCell(3);
                    let cellSaldo = linha.insertCell(4);
                    let cellDetalhes = linha.insertCell(5);
                    valorTotal += +extratoTotal[i].valor;


                    if (extratoTotal[i].valor < 0)
                        cellValor.style.color = "red";
                    cellCodigo.innerHTML = extratoTotal[i].codigo;
                    cellData.innerHTML = extratoTotal[i].data;
                    cellDescricao.innerHTML = extratoTotal[i].descricao;
                    cellValor.innerHTML = extratoTotal[i].valor;
                    cellDetalhes.innerHTML = extratoTotal[i].detalhes;
                    if (valorTotal < 0)
                        cellSaldo.style.color = "red";
                    cellSaldo.innerHTML = valorTotal;
                }
            }
        }
    }
}


function porDataInicialFinal() {

    if (dataInicial == null && dataFinal == null)
        return true;
    else
        return false;
}

function listar(extratoTotal) {
    let valorTotal = 0;

    if (porDataInicialFinal()) {
        for (let i = 0; i < extratoTotal.length; i++) {

            let linha = extrato.insertRow(i + 2);
            if (!(i % 2 === 0))
                linha.style.background = "#E8E8E8";
            let cellData = linha.insertCell(0);
            let cellCodigo = linha.insertCell(1);
            let cellDescricao = linha.insertCell(2);
            let cellValor = linha.insertCell(3);
            let cellSaldo = linha.insertCell(4);
            let cellDetalhes = linha.insertCell(5);
            valorTotal += +extratoTotal[i].valor;

            if (extratoTotal[i].valor < 0)
                cellValor.style.color = "red";
            cellCodigo.innerHTML = extratoTotal[i].codigo;
            cellData.innerHTML = extratoTotal[i].data;
            cellDescricao.innerHTML = extratoTotal[i].descricao;
            cellValor.innerHTML = extratoTotal[i].valor;
            cellDetalhes.innerHTML = extratoTotal[i].detalhes;
            if (valorTotal < 0)
                cellSaldo.style.color = "red";
            cellSaldo.innerHTML = valorTotal;

        }
    } else {
        for (let i = 0; i < extratoTotal.length; i++) {

            let linha = extrato.insertRow(i + 2);
            if (!(i % 2 === 0))
                linha.style.background = "#E8E8E8";
            if (extratoTotal[i].data >= dataInicial && extratoTotal[i].data <= dataFinal) {
                let cellData = linha.insertCell(0);
                let cellCodigo = linha.insertCell(1);
                let cellDescricao = linha.insertCell(2);
                let cellValor = linha.insertCell(3);
                let cellSaldo = linha.insertCell(4);
                let cellDetalhes = linha.insertCell(5);
                valorTotal += +extratoTotal[i].valor;

                if (extratoTotal[i].valor < 0)
                    cellValor.style.color = "red";
                cellCodigo.innerHTML = extratoTotal[i].codigo;
                cellData.innerHTML = extratoTotal[i].data;
                cellDescricao.innerHTML = extratoTotal[i].descricao;
                cellValor.innerHTML = extratoTotal[i].valor;
                cellDetalhes.innerHTML = extratoTotal[i].detalhes;
                if (valorTotal < 0)
                    cellSaldo.style.color = "red";
                cellSaldo.innerHTML = valorTotal;
            }
        }
    }
    preencheCamposForm();
}

function incluirEscopo(dataIn, dataFn) {
    if (dataIn != "" && dataFn != "") {
        if (dataFn < dataIn)
            alert("Data Inicial é maior que data final!");
        else {
            dataInicial = dataIn;
            dataFinal = dataFn;
            armazenamentoLocalListarPorData();
        }
    } else alert("Data Inicial/Final é obrigatório!");

}

function enviarMensagem(nome, sobrenome, email, mensagem) {

    let contato = {};
    contato.nome = nome;
    contato.sobrenome = sobrenome;
    contato.email = email;
    contato.mensagem = mensagem;
    mensagemContato.push(contato);
    if (nome != '' && sobrenome != '' && email != '' && mensagem != '') {
        localStorage.setItem('Mensagem', JSON.stringify(contato));
        alert("Mensagem enviada com sucesso");
    }
    else
        alert("Possui campo vazio");

}