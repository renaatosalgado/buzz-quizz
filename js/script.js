const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const APP = document.querySelector(".app");

//============== TELA 01 ==============//

//============== TELA 02 ==============//

//============== TELA 03 ==============//

let CREATED_QUIZZ = {};

function quizzGenerator() {
  CREATED_QUIZZ = {
    title: "",
    image: "",
    qttQuestions: 0,
    qttLevels: 0,
    questions: [],
    levels: [],
  };

  APP.innerHTML = `
    <div class="page-create-quizz">
      <div class="title">Comece pelo começo</div>
      <div class="entries">
          <input type="text" class="title" placeholder="Título do seu quizz">
          <input type="text" class="url" placeholder="URL da imagem do seu quizz">
          <input type="number" class="quantity-questions" placeholder="Quantidade de perguntas do quizz">
          <input type="number" class="quantity-levels" placeholder="Quantidade de níveis do quizz">
      </div>
      <button class="proceed" onclick="quizzGeneratorQuestions()">Prosseguir pra criar perguntas</button>
    </div>
  `;
}

function saveQuizzMainValues() {
  const title = document.querySelector(".entries .title").value;
  const image = document.querySelector(".entries .url").value;
  const qttQuestions = document.querySelector(
    ".entries .quantity-questions"
  ).value;
  const qttLevels = document.querySelector(".entries .quantity-levels").value;

  CREATED_QUIZZ.title = title;
  CREATED_QUIZZ.image = image;
  CREATED_QUIZZ.qttQuestions = parseInt(qttQuestions);
  CREATED_QUIZZ.qttLevels = parseInt(qttLevels);
}

function checkQuizzMainPart() {
  saveQuizzMainValues();

  if (CREATED_QUIZZ.title.length < 20 || CREATED_QUIZZ.title.length > 65) {
    return false;
  } else if (!checkURL(CREATED_QUIZZ.image)) {
    return false;
  } else if (CREATED_QUIZZ.qttQuestions < 3) {
    return false;
  } else if (CREATED_QUIZZ.qttLevels < 2) {
    return false;
  }
  return true;
}

function quizzGeneratorQuestions() {
  console.log("entrei aqui");
  const valid = checkQuizzMainPart();
  if (!valid) {
    alert("Preencha os campos corretamente!");
    return;
  }
  alert("Deu certo, tudo correto!");
}

//============== AUX FUNCTIONS ==============//

function checkURL(url) {
  const rule =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  return rule.test(url);
}

quizzGenerator(); // coloquei essa função inicial somente para testar o layout, pode remover ela
