import promptSync from "prompt-sync";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const prompt = promptSync();

let violao = {
  marca: "",
  modelo: "",
  tipo: "",
  ano_fabricacao: "",
  cutaway: "",
  cor: "",
};

// let violao = {};

let violoes = [];

const menu = [
  "[0] Listar Violão",
  "[1] Adicionar Novo Violão",
  "[2] Remover Violão",
  "[3] Procurar Violão",
  "[4] Importar Dados",
  "[5] Exportar Dados",
  "[6] Atualizar Violão",
  "[L] Limpar a tela",
  "[X] Sair do Programa",
];

let opcao = "";

do {
  console.log("MENU DE OPÇÕES", "\n=================");
  console.log(menu);
  opcao = prompt("Opção: ").toLowerCase();

  switch (opcao) {
    case "0":
      listarVioloes();
      break;

    case "1":
      adicionarViolao();
      break;

    case "2":
      removerViolao();
      break;

    case "3":
      procurarViolao();
      break;

    case "4":
      violoes = await importarDados();
      console.log("\nDados importados!\n");
      break;

    case "5":
      await exportarDados();
      break;

    case "6":
      await atualizarDados();
      break;

    case "l":
      limparTela();
      break;

    case "x":
      console.log("Até mais!");
      break;

    default:
      console.log("\n Opção Incorreta! \n");
      break;
  }
} while (opcao !== "x");

async function listarVioloes() {
  if (violoes.length == 0) {
    console.log("\n-->Vetor vazio\n");
    return;
  }

  console.table(violoes);
}

async function adicionarViolao() {
  do {
    violao.marca = prompt("Digite a marca: ");
  } while (!violao.marca || violao.marca.length > 30);

  do {
    violao.modelo = prompt("Digite o modelo: ");
  } while (!violao.modelo || violao.modelo.length > 30);

  do {
    violao.tipo = prompt("Digite o tipo: ");
  } while (!violao.tipo || violao.tipo.length > 30);

  do {
    violao.ano_fabricacao = +prompt("Digite o ano de fabricação: ");
  } while (isNaN(violao.ano_fabricacao) || !violao.ano_fabricacao);

  do {
    violao.cutaway = prompt("Possui cutaway?: S/N ").toLowerCase();
  } while (violao.cutaway !== "s" && violao.cutaway !== "n");

  violao.cutaway === "s" ? (violao.cutaway = true) : (violao.cutaway = false);

  do {
    violao.cor = prompt("Digite a cor em hexadecimal: ");
  } while (!violao.cor.match("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"));

  violoes.push(violao);

  violao = {};

  return;
}

function removerViolao() {
  if (violoes.length == 0)
    return (
      console.log("\nVetor vazio! Nenhum violão para excluir\n"), showMenu()
    );

  console.table(violoes);

  let opcao = +prompt("Digite o índice do violão que deseja excluir: ");

  while (opcao < 0 || opcao > violoes.length - 1 || isNaN(opcao)) {
    console.log(
      `\nValor inválido! Digite um valor entre 0 e ${violoes.length - 1}\n`
    );
    opcao = +prompt("Digite o índice do violão que deseja excluir: ");
  }

  violoes.splice(opcao, 1);

  console.log("\nItem excluído\n");
}

function procurarViolao() {
  let filtro;

  do {
    console.log([
      "[0] Marca",
      "[1] Modelo",
      "[2] Tipo",
      "[3] Ano de Fabricação",
      "[4] Cutaway",
      "[5] Cor",
    ]);
    filtro = +prompt("Digite sua opção: ");
  } while (filtro < 0 || filtro > 5 || isNaN(filtro));

  switch (filtro) {
    case 0:
      filtro = "marca";
      break;

    case 1:
      filtro = "modelo";
      break;

    case 2:
      filtro = "tipo";
      break;

    case 3:
      filtro = "ano_fabricacao";
      break;

    case 4:
      filtro = "cutaway";
      break;

    case 5:
      filtro = "cor";
      break;
  }

  let value;

  switch (filtro) {
    case "ano_fabricacao":
      do {
        value = +prompt(
          `Digite valor de busca para o  ${filtro} `
        ).toLowerCase();
      } while (isNaN(value) || !value);
      break;

    case "cutaway":
      do {
        value = prompt(
          `Digite valor de busca para ${filtro}. S/N: `
        ).toLowerCase();
      } while (value !== "s" && value !== "n");
      value === "s" ? (value = true) : (value = false);
      break;

    case "cor":
      do {
        value = prompt(
          `Digite o valor para a ${filtro} em hexadecimal: `
        ).toLowerCase();
      } while (!value.match("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"));
      break;

    default:
      do {
        value = prompt(`Digite o valor de busca para ${filtro} `).toLowerCase();
      } while (!value || value > 30);

      break;
  }

  let resultado = violoes.filter((element) => {
    return element[filtro] === value;
  });

  if (resultado.length == 0) {
    return console.log("\nNenhum registro encontrado!\n");
  }
  console.table(resultado);
}

function limparTela() {
  console.clear();
}

async function importarDados() {
  const data = JSON.parse(await readFile("data.json"));

  return data.violao;
}

async function exportarDados() {
  const data = JSON.parse(await readFile("data.json"));

  if (violoes.length === 0)
    return console.log("Nenhum dado para ser exportado!");

  data.violao = [];

  violoes.forEach((element) => {
    data.violao.push(element);
  });

  violoes = [];

  await writeFile("data.json", JSON.stringify(data, null, 2));

  console.log("\nDados exportados!\n");

  return;
}

async function atualizarDados() {
  if (violoes.length === 0) {
    return console.log("\nVetor vazio! Nenhum dados para atualizar\n");
  }

  ListarVioloes();

  let idx = +prompt("Digite o índice do violão que deseja atualizar: ");

  while (idx < 0 || idx > violoes.length - 1 || isNaN(idx)) {
    console.log(
      `\nValor inválido! Digite um valor entre 0 e ${this.lista.size - 1}!\n`
    );
    idx = +this.prompt("Digite o índice do violão que deseja excluir: ");
  }

  let key;
  let value;

  do {
    console.log([
      "[0] Marca",
      "[1] Modelo",
      "[2] Tipo",
      "[3] Ano de Fabricação",
      "[4] Cutaway",
      "[5] Cor",
    ]);
    key = +prompt("Digite o que deseja atualizar:  ");
  } while (key < 0 || key > 5 || isNaN(key));

  switch (key) {
    case 0:
      key = "marca";
      break;

    case 1:
      key = "modelo";
      break;

    case 2:
      key = "tipo";
      break;

    case 3:
      key = "ano_fabricacao";
      break;

    case 4:
      key = "cutaway";
      break;

    case 5:
      key = "cor";
      break;
  }

  switch (key) {
    case "ano_fabricacao":
      do {
        value = +prompt(`Digite o novo valor para a ${key} `).toLowerCase();
      } while (isNaN(value) || !value);
      break;

    case "cutaway":
      do {
        value = prompt(`Digite o novo valor para a ${key}. S/N:`).toLowerCase();
      } while (value !== "s" && value !== "n");
      value === "s" ? (value = true) : (value = false);
      break;

    case "cor":
      do {
        value = prompt(
          `Digite o novo valor para a ${key} em hexadecimal: `
        ).toLowerCase();
      } while (!value.match("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"));
      break;

    default:
      do {
        value = prompt(`Digite o novo valor para a ${key} `).toLowerCase();
      } while (!value || value.length > 30);

      break;
  }

  console.log("\n");

  violoes[idx][key] = value;

  console.log("Dados atualizados!\n");
}
