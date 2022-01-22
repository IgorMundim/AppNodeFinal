let tabelaDeProdutos = document.getElementById("tbProdutos");
let index;

function init() {
listarProduto()
}
document.onload = init();

function preencheCamposForm() {

  for (var i = 1; i < tabelaDeProdutos.rows.length; i++) {
    
    tabelaDeProdutos.rows[i].onclick = function () {
         let index = this.rowIndex;
          identificadorCodigo = tabelaDeProdutos.rows[index].cells[1].innerText;
          
          document.getElementById("txtCodigo").value = tabelaDeProdutos.rows[index].cells[0].innerText;
          document.getElementById("txtDescricao").value = tabelaDeProdutos.rows[index].cells[1].innerText;
          document.getElementById("txtValor").value = tabelaDeProdutos.rows[index].cells[2].innerText;
          document.getElementById("txtMarca").value = tabelaDeProdutos.rows[index].cells[3].innerText;
      }
  }
}
function login(login, senha) {
  console.log("aqui")
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
  .then( (data) => {
    if (data.messageAlert) {
      document.getElementById('mensagemDeRetornoLogin').innerHTML = data.messageAlert
    } else {
      localStorage.setItem('Token', JSON.stringify({ token: data.token }));
      window.location.assign("/app/");
      
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
  .then( (data) => {
      document.getElementById('mensagemDeRetorno').innerHTML = data.messageAlert
  })
}
function incluirProduto(descricao,valor, marca) {
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim)",
    "Authorization": `Bearer ${gerenciarToken()}`,
    "Content-Type": "application/json"
   }
   
   fetch("/api/produtos", { 
     method: "POST",
     body: `{\n    \"descricao\": \"${descricao}\",\n    \"valor\": \"${valor}\",\n    \"marca\": \"${marca}\"\n}`,
     headers: headersList
    }).then(res => res.json())
    .then( (data) => {
      alert(data.messageAlert)
      listarProduto()
    })
}
function excluirProduto(id){
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`
   }
   
   fetch(`/api/produtos/${id}`, { 
     method: "DELETE",
     headers: headersList
   }).then(res => res.json())
   .then( (data) => {
     alert(data.messageAlert)
     listarProduto()
   })
}
function alterarProduto(id, descricao, valor, marca){
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`,
    "Content-Type": "application/json"
   }
   
   fetch(`/api/produtos/${id}`, { 
     method: "PUT",
     body: `{\n    \"descricao\" : \"${descricao}\",\n    \"valor\" : \"${valor}\",\n    \"marca\" : \"${marca}\"\n}`,
     headers: headersList
   }).then(res => res.json())
   .then( (data) => {
      listarProduto()
      alert(data.messageAlert) 
   })
}
function listarProduto() {
  while (tabelaDeProdutos.rows.length > 1)
  tabelaDeProdutos.deleteRow(1);
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim"
  }

  fetch("/api/produtos", {
    method: "GET",
    headers: headersList
  }).then(res => res.json())
  .then( (data) => {
    for (let i = 0; i < data.length; i++) {
      let linha = tabelaDeProdutos.insertRow(i+1)
      if (!(i % 2 === 0))
        linha.style.background = "#E8E8E8";
      let cellId = linha.insertCell(0);
      let cellDescricao = linha.insertCell(1);
      let cellValor = linha.insertCell(2);
      let cellMarca = linha.insertCell(3);
      cellId.innerHTML = data[i].id;
      cellDescricao.innerHTML = data[i].descricao;
      cellValor.innerHTML = data[i].valor;
      cellMarca.innerHTML = data[i].marca;
    }
    preencheCamposForm()

  })
  
}
function gerenciarToken(){
  if(localStorage.getItem('Token'))
  return JSON.parse(localStorage.getItem('Token')).token
}