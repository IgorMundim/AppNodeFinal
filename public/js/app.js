
let tabelaDeExtrato = document.getElementById("tbExtrato");
let dataInicial = null;
let dataFinal = null;
let index;



function init() {
 getExtrato()
}

document.onload = init();

btnImg01.onclick = () => {
  document.querySelector('#principal-div').innerHTML = `<img id="principal" src="../img/imagem01.png">`;
}

btnImg02.onclick = () => {
  document.querySelector('#principal-div').innerHTML = `<img id="principal" src="../img/imagem02.png">`;
}
btnImg03.onclick = () => {
  document.querySelector('#principal-div').innerHTML = `<img id="principal" src="../img/imagem03.png">`;
}

function login(login, senha) {


  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Content-Type": "application/json"
  }

  fetch("/api/seguranca/login", {
    method: "POST",
    body: `{\n  \"login\": \"${login}\",\n  \"senha\": \"${senha}\"\n}`,
    headers: headersList
  }).then(res => res.json())
    .then((data) => {
      if (data.messageAlert) {
        document.getElementById('mensagemDeRetornoLogin').innerHTML = data.messageAlert
      } else {
        localStorage.setItem('Token', JSON.stringify({ token: data.token }));
        window.location.assign("/app/");

      }

    })
}
function loginAdmin(login, senha) {


  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Content-Type": "application/json"
  }

  fetch("/api/seguranca/login/admin", {
    method: "POST",
    body: `{\n  \"login\": \"${login}\",\n  \"senha\": \"${senha}\"\n}`,
    headers: headersList
  }).then(res => res.json())
    .then((data) => {
      if (data.messageAlert) {
        document.getElementById('mensagemDeRetornoLogin').innerHTML = data.messageAlert
      } else {
        localStorage.setItem('Token', JSON.stringify({ token: data.token }));
        window.location.assign("/app/painelAdmin.html");

      }
    })
}
function incluirUsuario(nome, login, email, senha) {

  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Content-Type": "application/json"
  }

  fetch("/api/seguranca/register", {
    method: "POST",
    body: `{\n  \"nome\": \"${nome}\",\n  \"login\": \"${login}\",\n  \"senha\": \"${senha}\",\n  \"email\": \"${email}\"\n}`,
    headers: headersList
  }).then(res => res.json())
    .then((data) => {
      getExtrato()
      document.getElementById('mensagemDeRetorno').innerHTML = data.messageAlert
    })
}

function preencheCamposForm() {
  for (var i = 2; i < tabelaDeExtrato.rows.length; i++) {
    tabelaDeExtrato.rows[i].onclick = function () {
      index = this.rowIndex;
      identificadorCodigo = tabelaDeExtrato.rows[index].cells[1].innerText;
      document.getElementById("txtData").value = tabelaDeExtrato.rows[index].cells[0].innerText;
      document.getElementById("txtCodigo").value = tabelaDeExtrato.rows[index].cells[1].innerText;
      document.getElementById("txtDescricao").value = tabelaDeExtrato.rows[index].cells[2].innerText;
      document.getElementById("txtValor").value = tabelaDeExtrato.rows[index].cells[3].innerText;
      document.getElementById("txtDetalhes").value = tabelaDeExtrato.rows[index].cells[5].innerText;
    }
  }
}
function excluirExtrato(id){
 
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`
   }
   
   fetch(`/api/extratos/${id}`, { 
     method: "DELETE",
     headers: headersList
   }).then(res => res.json())
   .then((extrato) => {
     alert(extrato.messageAlert)
     getExtrato()
   })

}
function alterarExtrato(dataCompra, codigo, descricao, valor, detalhes) {

    if (codigo != "" && descricao != "" && valor != "" && dataCompra != '') {
      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Igor Mundim",
        "Authorization": `Bearer ${gerenciarToken()}`,
        "Content-Type": "application/json"
      }

      fetch(`/api/extratos/${codigo}`, {
        method: "PUT",
        body: ` {\n\n    \"datacompra\": \"${dataCompra}\",\n    \"descricao\": \"${descricao}\",\n    \"valor\": \"${valor}\",\n    \"detalhes\": \"${detalhes}\"\n  }`,
        headers: headersList
      }).then(res => res.json())
        .then((extrato) => {
          alert(extrato.messageAlert)
          getExtrato()
        })
    } else
      alert("Possui compos vazios");

}
function incluirExtrato(dataCompra, codigo, descricao, valor, detalhes) {
  

    if (codigo != "" && descricao != "" && valor != "" && dataCompra != '') {


      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Igor Mundim",
        "Authorization": `Bearer ${gerenciarToken()}`,
        "Content-Type": "application/json"
      }

      fetch("/api/extratos/", {
        method: "POST",
        body: `  {\n    \"id\": ${codigo},\n  \n    \"datacompra\": \"${dataCompra}\",\n    \"descricao\": \"${descricao}\",\n    \"valor\": \"${valor}\",\n    \"detalhes\": \"${detalhes}\"\n  }`,
        headers: headersList
      }).then(res => res.json())
        .then((extrato) => {
          alert(extrato.messageAlert)
          getExtrato()
        })
    } else
      alert("Possui compos vazios");

}

function listarExtrato(extrato) {

  let valorTotal = 0;
  while (tabelaDeExtrato.rows.length > 2)
    tabelaDeExtrato.deleteRow(2);
  if (porDataInicialFinal()) {

    for (let i = 0; i < extrato.length; i++) {


      
      let linha = tabelaDeExtrato.insertRow(i + 2);
      if (!(i % 2 === 0))
        linha.style.background = "#E8E8E8";
      let cellData = linha.insertCell(0);
      let cellCodigo = linha.insertCell(1);
      let cellDescricao = linha.insertCell(2);
      let cellValor = linha.insertCell(3);
      let cellSaldo = linha.insertCell(4);
      let cellDetalhes = linha.insertCell(5);
      valorTotal += +extrato[i].valor;

      if (extrato[i].valor < 0)
        cellValor.style.color = "red";
      cellCodigo.innerHTML = extrato[i].id;
      cellData.innerHTML = extrato[i].datacompra.substring(0, 10);

      cellDescricao.innerHTML = extrato[i].descricao;
      cellValor.innerHTML = extrato[i].valor;
      cellDetalhes.innerHTML = extrato[i].detalhes;
      if (valorTotal < 0)
        cellSaldo.style.color = "red";
      cellSaldo.innerHTML = valorTotal;

    }
  } else {
    for (let i = 0; i < extrato.length; i++) {

      let linha = tabelaDeExtrato.insertRow(i + 2);
      if (!(i % 2 === 0))
        linha.style.background = "#E8E8E8";
      if (extrato[i].datacompra >= dataInicial && extrato[i].datacompra <= dataFinal) {
        let cellData = linha.insertCell(0);
        let cellCodigo = linha.insertCell(1);
        let cellDescricao = linha.insertCell(2);
        let cellValor = linha.insertCell(3);
        let cellSaldo = linha.insertCell(4);
        let cellDetalhes = linha.insertCell(5);
        valorTotal += +extrato[i].valor;

        if (extrato[i].valor < 0)
          cellValor.style.color = "red";
        cellCodigo.innerHTML = extrato[i].id;
        cellData.innerHTML = extrato[i].datacompra.substring(0, 10);
        cellDescricao.innerHTML = extrato[i].descricao;
        cellValor.innerHTML = extrato[i].valor;
        cellDetalhes.innerHTML = extrato[i].detalhes;
        if (valorTotal < 0)
          cellSaldo.style.color = "red";
        cellSaldo.innerHTML = valorTotal;
      }
    }
  }
  preencheCamposForm()
}
function getExtrato() {

  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`,
  }

  fetch("/api/extratos", {
    method: "GET",
    headers: headersList
  }).then(res => res.json())
    .then((extrato) => {
      listarExtrato(extrato)
    })
}



function listarPorCodigo() {
 
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`
  }

  fetch("/api/extratos", {
    method: "GET",
    headers: headersList
  }).then(res => res.json())
    .then((extrato) => {
      extrato.sort(function (a, b) {
        return +(a.id) < +(b.id) ? -1 : +(a.id) > +(b.id) ? 1 : 0;
    })
      listarExtrato(extrato)
    })
}

function listarPorData() {
 
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`
  }

  fetch("/api/extratos", {
    method: "GET",
    headers: headersList
  }).then(res => res.json())
    .then((extrato) => {
      extrato.sort(function (a, b) {
        return a.datacompra < b.datacompra ? -1 : a.datacompra > b.datacompra ? 1 : 0
    })
      listarExtrato(extrato)
    })
}

function listarPorEntrada() {
  let valorTotal = 0;
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`
   }
   
   fetch("/api/extrato/entrada", { 
     method: "GET",
     headers: headersList
   }).then(res => res.json())
   .then((extrato) => {
     extrato.sort(function (a, b) {
       return a.datacompra < b.datacompra ? -1 : a.datacompra > b.datacompra ? 1 : 0
   })
     listarExtrato(extrato)
   })
}

function listarPorSaida() {
  let valorTotal = 0;
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`
   }
   
   fetch("/api/extrato/saida", { 
     method: "GET",
     headers: headersList
   }).then(res => res.json())
   .then((extrato) => {
     extrato.sort(function (a, b) {
       return a.datacompra < b.datacompra ? -1 : a.datacompra > b.datacompra ? 1 : 0
   })
     listarExtrato(extrato)
   })
}

function incluirEscopo(dataIn, dataFn) {

  if (dataIn != "" && dataFn != "") {
    if (dataFn < dataIn)
      alert("Data Inicial é maior que data final!");
    else {
      dataInicial = dataIn;
      dataFinal = dataFn;
      getExtrato()
    }
  } else alert("Data Inicial/Final é obrigatório!");

}

function porDataInicialFinal() {

  if (dataInicial == null && dataFinal == null)
    return true;
  else
    return false;
}

function gerenciarToken() {
  if (localStorage.getItem('Token'))
    return JSON.parse(localStorage.getItem('Token')).token
}

function enviarMensagem(nome, sobrenome, email, mensagem) {

  if (nome != '' && sobrenome != '' && email != '' && mensagem != '') {
    let headersList = {
      "Accept": "*/*",
      "User-Agent": "Igor Mundim",
      "Authorization": `Bearer ${gerenciarToken()}`,
      "Content-Type": "application/json"
     }
   
     fetch("/api/contatos", { 
       method: "POST",
       body: `{\n  \"nome\": \"${nome}\",\n  \"sobrenome\": \"${sobrenome}\",\n  \"email\": \"${email}\",\n  \"mensagem\": \"${mensagem}\"\n}`,
       headers: headersList
     }).then(function(response) {
       return response.text();
     }).then(function(data) {
      alert("Mensagem enviada com sucesso");
    })
      
  }
  else
      alert("Possui campo vazio");

}