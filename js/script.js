const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz";
const APP = document.querySelector(".app");

//============== TELA 01 ==============//

//============== TELA 02 ==============//

//============== TELA 03 ==============//

let CREATED_QUIZZ = {};

function generateQuizz() {
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
      <button class="proceed" onclick="generateQuestions()">Prosseguir pra criar perguntas</button>
    </div>
  `;
}

function saveQuizzBasicInfo() {
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

function checkQuizzBasicInfo() {
  saveQuizzBasicInfo();

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

function generateQuestions() {
  const valid = checkQuizzBasicInfo();
  if (!valid) {
    alert("Preencha os campos corretamente!");
    return;
  }

  let questions = "";

  for (let i = 0; i < CREATED_QUIZZ.qttQuestions; i++) {
    questions += generateQuestionCard(i);
  }

  APP.innerHTML = `
    <div class="page-create-quizz">
      <div class="title">Crie suas perguntas</div>

      ${questions}

      <button class="proceed" onclick="generateLevels()">Prosseguir para criar níveis</button>
  `;
}

function showItem(element) {
  const item = document.querySelector(".expanded");
  item.classList.remove("expanded");

  element.parentNode.parentNode.classList.add("expanded");
}

function generateQuestionCard(index) {
  let questionClass = "";

  if (index === 0) {
    questionClass = "expanded";
  }

  return `
    <div class="question entries ${questionClass}">
      <div class="title-card">
        <div class="label">Pergunta ${index + 1}</div>
        <div class="toggle" onclick="showItem(this), scrollToCard(this)">
          <ion-icon name="create-outline"></ion-icon>
        </div>
      </div>

      <div class="body-card">
        <input type="text" class="question-${index}-text" placeholder="Texto da pergunta" />
        <input type="text" class="question-${index}-color" placeholder="Cor de fundo da pergunta" />

        <div class="label">Resposta correta</div>

        <div class="group">
          <input type="text" class="question-${index}-correct-answer" placeholder="Resposta correta" />
          <input type="text" class="question-${index}-correct-url" placeholder="URL da imagem" />
        </div>

        <div class="label">Respostas incorretas</div>

        <div class="group question-${index}-wrong-0">
          <input type"text" class="answer" placeholder="Resposta incorreta 1" />
          <input type="text" class="url" placeholder="URL da imagem 1" />
        </div>

        <div class="group question-${index}-wrong-1">
          <input type"text" class="answer" placeholder="Resposta incorreta 2" />
          <input type="text" class="url" placeholder="URL da imagem 2" />
        </div>

        <div class="group question-${index}-wrong-2">
          <input type"text" class="answer" placeholder="Resposta incorreta 3" />
          <input type="text" class="url" placeholder="URL da imagem 3" />
        </div>

        <div class="group question-${index}-wrong-3">
          <input type"text" class="answer" placeholder="Resposta incorreta 4" />
          <input type="text" class="url" placeholder="URL da imagem 4" />
        </div>
      </div>
    </div>
  `;
}

function saveQuizzQuestions() {
  CREATED_QUIZZ.questions = [];

  for (let i = 0; i < CREATED_QUIZZ.qttQuestions; i++) {
    const question = {};

    question.title = document.querySelector(`.question-${i}-text`).value;
    question.color = document.querySelector(`.question-${i}-color`).value;

    question.answers = [];

    const correctAnswer = {
      text: document.querySelector(`.question-${i}-correct-answer`).value,
      image: document.querySelector(`.question-${i}-correct-url`).value,
      isCorrectAnswer: true,
    };

    question.answers.push(correctAnswer);

    for (let j = 0; j < 3; j++) {
      const answer = {
        text: document.querySelector(`.question-${i}-wrong-${j} .answer`).value,
        image: document.querySelector(`.question-${i}-wrong-${j} .url`).value,
        isCorrectAnswer: false,
      };

      if (answer.text.length === 0) {
        continue;
      }

      question.answers.push(answer);
    }

    CREATED_QUIZZ.questions.push(question);
  }
}

function checkQuizzQuestions() {
  saveQuizzQuestions();

  for (let i = 0; i < CREATED_QUIZZ.questions.length; i++) {
    const question = CREATED_QUIZZ.questions[i];

    if (question.title.length < 20) {
      console.log("titulo errado");
      return false;
    } else if (!checkColor(question.color)) {
      console.log("cor errada pergunta");
      return false;
    }

    if (question.answers.length < 2) {
      console.log("qtd respostas errada");
      return false;
    }

    for (let j = 0; j < question.answers.length; j++) {
      const answer = question.answers[j];

      if (answer.text.length === 0) {
        console.log("resposta nula");
        return false;
      } else if (!checkURL(answer.image)) {
        console.log("url errada resposta");
        return false;
      }
    }
  }

  return true;
}

function generateLevelCard(index) {
  let levelClass = "";

  if (index === 0) {
    levelClass = "expanded";
  }

  return `
    <div class="level entries ${levelClass}">
      <div class="title-card">
        <div class="label">Nível ${index + 1}</div>
        <div class="toggle" onclick="showItem(this), scrollToCard(this)">
          <ion-icon name="create-outline"></ion-icon>
        </div>
      </div>

      <div class="body-card">
        <input type="text" class="level-${index}-title" placeholder="Título do nível" />
        <input type="text" class="level-${index}-success" placeholder="% de acerto mínima" />
        <input type="text" class="level-${index}-url" placeholder="URL da imagem do nível" />
        <input type="text" class="level-${index}-description" placeholder="Descrição do nível" />
      </div>
    </div>
  `;
}

function saveQuizzLevel() {
  CREATED_QUIZZ.levels = [];

  for (let i = 0; i < CREATED_QUIZZ.qttLevels; i++) {
    const level = {
      title: document.querySelector(`.level-${i}-title`).value,
      minValue: parseInt(document.querySelector(`.level-${i}-success`).value),
      image: document.querySelector(`.level-${i}-url`).value,
      text: document.querySelector(`.level-${i}-description`).value,
    };

    CREATED_QUIZZ.levels.push(level);
  }
}

function checkQuizzLevels() {
  saveQuizzLevel();
  let levelZero = false;

  for (let i = 0; i < CREATED_QUIZZ.levels.length; i++) {
    const level = CREATED_QUIZZ.levels[i];

    if (level.minValue === 0) {
      levelZero = true;
    }

    if (level.title.length < 10) {
      return false;
    } else if (level.minValue < 0 || level.minValue > 100) {
      return false;
    } else if (!checkURL(level.image)) {
      return false;
    } else if (level.text.length < 30) {
      return false;
    }
  }

  return levelZero;
}

function createQuizzSuccess(id) {
  APP.innerHTML = `
    <div class="page-create-quizz">
      <div class="title">Seu quizz está pronto!</div>

      <div class="quizz" onclick="showQuizz(${id})">
        <img src="${CREATED_QUIZZ.image}">
        <div class="overlay"></div>
        <div class="title">${CREATED_QUIZZ.title}</div>
      </div>

      <button class="access-quizz" onclick="showQuizz(${id})">Acessar Quizz</button>
      <button class="go-back" onclick="getQuizzes()">Voltar pra home</button>
    </div>  
  `;
}

function getQuizzesLocalStorage() {
  let data = localStorage.getItem("quizzes");

  if (data !== null) {
    const parsedData = JSON.parse(data);
    return parsedData;
  } else {
    return [];
  }
}

function saveQuizzLocalStorage(res) {
  const quizz = res.data;

  const localData = getQuizzesLocalStorage();

  localData.push({
    id: quizz.id,
    key: quizz.key,
  });

  localStorage.setItem("quizzes", JSON.stringify(localData));

  createQuizzSuccess(quizz.id);
}

function saveQuizz() {
  const data = {
    title: CREATED_QUIZZ.title,
    image: CREATED_QUIZZ.image,
    questions: CREATED_QUIZZ.questions,
    levels: CREATED_QUIZZ.levels,
  };

  const promise = axios.post(`${URL_API}/quizzes`, data);
  promise.then(saveQuizzLocalStorage);
}

function completeQuizz() {
  const valid = checkQuizzLevels();

  if (!valid) {
    alert("Preencha os dados corretamente!");
    return;
  }

  saveQuizz();
}

function generateLevels() {
  const valid = checkQuizzQuestions();

  if (!valid) {
    alert("Preencha os dados corretamente!");
    return;
  }

  let levels = "";

  for (let i = 0; i < CREATED_QUIZZ.qttLevels; i++) {
    levels += generateLevelCard(i);
  }

  APP.innerHTML = `
    <div class="page-create-quizz">
      <div class="title">Agora, decida os níveis</div>

      ${levels}

      <button class="proceed" onclick="completeQuizz()">Finalizar Quizz</button>
    </div>
  `;
}

//============== AUX FUNCTIONS ==============//

function checkURL(url) {
  const rule =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  return rule.test(url);
}

function checkColor(color) {
  const rule = /^\#([0-9]|[A-F]|[a-f]){6}$/;
  return rule.test(color);
}

function scrollToCard(element) {
  function scroll() {
    element.scrollIntoView({ behavior: "smooth" });
  }

  setTimeout(scroll, 100);
}

generateQuizz(); // coloquei essa função inicial somente para testar o layout, pode remover ela
