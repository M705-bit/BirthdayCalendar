// Declarando variáveis globais
const form = document.getElementById("form");
const inputNome = document.getElementById("name");
const inputDate = document.getElementById("birthdate");
const tbody = document.querySelector("#tabela-pessoas tbody");
var botao = null;
var dados = [];

// Limpa o conteúdo inicial da tbody (mas não no onload!)
tbody.innerHTML = "";

// Função para adicionar uma pessoa na tabela
function adicionarNaTabela(pessoa) {
  const novaLinha = tbody.insertRow();
  const celulaNome = novaLinha.insertCell(0);
  const celulaData = novaLinha.insertCell(1);
  const celulaAcoes = novaLinha.insertCell(2);

  celulaNome.innerText = pessoa.nome;
  celulaData.innerText = pessoa.dataNascimento;
  celulaAcoes.innerHTML = '<button class="editar">Editar</button> <button class="deletar">Deletar</button>';
}

// Evento de envio do formulário
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const x = inputNome.value;
  const y = inputDate.value;
  const [dia, mes, ano] = y.split("/");

  if (
    x.length < 3 || x.length > 120 || x.match(/\d+/) ||
    y === "" || !(1 <= dia && dia <= 31) || !(1 <= mes && mes <= 12) || ano === ""
  ) {
    alert("Por favor, verifique os dados inseridos.");
    return;
  }

  const pessoa = { nome: x, dataNascimento: y };

  if (botao && botao.classList.contains("editar")) {
    const linha = botao.parentNode.parentNode;
    linha.cells[0].innerText = pessoa.nome;
    linha.cells[1].innerText = pessoa.dataNascimento;
    botao = null;
  } else {
    adicionarNaTabela(pessoa);
  }

  // Atualiza o localStorage com todos os dados da tabela
  dados = [];
  for (let i = 0; i < tbody.rows.length; i++) {
    const linha = tbody.rows[i];
    dados.push({
      nome: linha.cells[0].innerText,
      dataNascimento: linha.cells[1].innerText
    });
  }
  localStorage.setItem("tbody", JSON.stringify(dados));

  form.reset();
  console.log("Formulário enviado!");
});

// Evento de clique nos botões da tabela
tbody.addEventListener("click", function (event) {
  botao = event.target;

  if (botao.classList.contains("deletar")) {
    const linha = botao.parentNode.parentNode;
    linha.remove();

    // Atualiza o localStorage após deletar
    dados = [];
    for (let i = 0; i < tbody.rows.length; i++) {
      const linha = tbody.rows[i];
      dados.push({
        nome: linha.cells[0].innerText,
        dataNascimento: linha.cells[1].innerText
      });
    }
    localStorage.setItem("tbody", JSON.stringify(dados));

  } else if (botao.classList.contains("editar")) {
    alert("Você pode editar os campos no formulário acima. Após editar, clique em 'Enviar' para atualizar a tabela.");
    inputNome.value = botao.parentNode.parentNode.cells[0].innerText;
    inputDate.value = botao.parentNode.parentNode.cells[1].innerText;
  }
});

// Ao carregar a página, restaura os dados salvos
window.onload = () => {
  const dadosSalvos = JSON.parse(localStorage.getItem("tbody")) || [];
  dadosSalvos.forEach(item => {
    adicionarNaTabela(item);
  });
  proximoAniversario(dadosSalvos);
};
//função para calcular qual o próximo aniversário de uma pessoa,
// dado o dia e mês de nascimento dela


var proximoAniversario = function(dadosSalvos = JSON.parse(localStorage.getItem("tbody")) || []) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate(); // CORRETO: dia do mês
  let menorDiferenca = 12;
  let aniversariante = null;

  for (const item of dadosSalvos) {
    const [diaNasc, mesNasc, anoNasc] = item.dataNascimento.split("/").map(Number);
    let diferenca = (mesNasc - mesAtual + 12) % 12;

    // Se é o mesmo mês, mas o dia já passou, pula
    if (diferenca === 0 && diaAtual > diaNasc) {
      continue;
    }

    if (diferenca < menorDiferenca) {
      menorDiferenca = diferenca;
      aniversariante = item;
    }
  }

  if (aniversariante) {
    alert(`O aniversário de ${aniversariante.nome} está chegando!`);
  } else {
    alert("Nenhum aniversário próximo encontrado.");
  }
};

