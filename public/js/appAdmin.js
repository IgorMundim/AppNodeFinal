
let tabelaDeUsuarios = document.getElementById("tbUsuario");




function init() {

  getUsuario()
}
document.onload = init();
function getUsuario() {
  
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`,
  }

  fetch("/api/usuarios", {
    method: "GET",
    headers: headersList
  }).then(res => res.json())
    .then((usuario) => {
      listarUsuario(usuario)
      
    })
}


function listarUsuario(usuario) {

  while (tabelaDeUsuarios.rows.length > 1)
  tabelaDeUsuarios.deleteRow(1);

for (let i = 0; i < usuario.length; i++) {


      
      let linha = tabelaDeUsuarios.insertRow(i + 1);
      if (!(i % 2 === 0))
        linha.style.background = "#E8E8E8";
      let cellId = linha.insertCell(0);
      let cellNome = linha.insertCell(1);
      let cellLogin = linha.insertCell(2);
       let cellEmail  = linha.insertCell(3);
      let cellRoles = linha.insertCell(4);

      cellId.innerHTML = usuario[i].id;
      cellNome.innerHTML = usuario[i].nome;
      cellEmail.innerHTML = usuario[i].email;
      cellLogin.innerHTML = usuario[i].login;
      cellRoles.innerHTML = usuario[i].roles;

    }
  preencheCamposForm()
}

function preencheCamposForm() {
  for (var i = 1; i < tabelaDeUsuarios.rows.length; i++) {
    tabelaDeUsuarios.rows[i].onclick = function () {
      index = this.rowIndex;
      document.getElementById("txtId").value = tabelaDeUsuarios.rows[index].cells[0].innerText;
      document.getElementById("txtNome").value = tabelaDeUsuarios.rows[index].cells[1].innerText;
      document.getElementById("txtLogin").value = tabelaDeUsuarios.rows[index].cells[2].innerText;
      document.getElementById("txtEmail").value = tabelaDeUsuarios.rows[index].cells[3].innerText;
      document.getElementById("txtTipo").value = tabelaDeUsuarios.rows[index].cells[4].innerText;
     
    }
  }
}

function alterarUsuario(id, nome, email,login,  tipo) {

  if (id != "" && nome != "" && email != "" && tipo != '') {
  let headersList = {
      "Accept": "*/*",
      "User-Agent": "Igor Mundim",
      "Content-Type": "application/json"
     }
     
     let bodyContent = JSON.stringify( {
         
         "nome": nome,
         "email": email,
         "login": login,
         "roles": tipo
       });
     
     fetch(`/api/usuarios/${id}`, { 
       method: "PUT",
       body: bodyContent,
       headers: headersList
     }).then(res => res.json())
     .then((usuario) => {
       alert(usuario.messageAlert)
       getUsuario()
     })
} else
    alert("Possui compos vazios");

}
function excluirUsuario(id){
 
  let headersList = {
    "Accept": "*/*",
    "User-Agent": "Igor Mundim",
    "Authorization": `Bearer ${gerenciarToken()}`
   }
   
   fetch(`/api/usuarios/${id}`, { 
     method: "DELETE",
     headers: headersList
   }).then(res => res.json())
   .then((usuario) => {
     alert(usuario.messageAlert)
     getUsuario()
   })

}
function gerenciarToken() {
  if (localStorage.getItem('Token'))
    return JSON.parse(localStorage.getItem('Token')).token
}