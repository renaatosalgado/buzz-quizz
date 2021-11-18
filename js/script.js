const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const APP = document.querySelector(".app");

//============== TELA 01 ==============//
function listQuizzes(){
  APP.innerHTML = 
  `
    <div class="your-quizzes not-created">
      <p class="quizz-not-created">Você não criou nenhum quizz ainda :(</p>
      <button class="create-quizz-btn" data-identifier="create-quizz">Criar Quizz</button>
    </div>
    <div class="general-quizzes" data-identifier="general-quizzes">
    <p class="all-quizzes-title">Todos os Quizzes</>
    </div>
  ` 

  let yourQuizzes = 
  `
    <div class="your-quizzes">
      <div class="your-quizzes-header">
        <p class="">Seus Quizzes</p>
        <ion-icon name="add-circle" class=""></ion-icon>
      </div>
      <div class="your-quizzes-list"></div>
    </div>
  `
  const createQuizzMenu = document.querySelector('.your-quizzes')
  createQuizzMenu.innerHTML = yourQuizzes
  createQuizzMenu.classList.replace('not-created','created')


  const promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
  promise.then(loadQuizzes)
}

function loadQuizzes(answer){
  console.log(answer)
  let quizzes = answer.data
  const allQuizzes = document.querySelector('.general-quizzes')
  const yourQuizzes = document.querySelector('.your-quizzes-list')
  for(let i=0; i<quizzes.length; i++){
    let serverQuizz = quizzes[i]

    if('questions' in serverQuizz){
      allQuizzes.innerHTML += 
      `
        <div class="server-quizz" onclick="screen2(this)">
          <img src='${serverQuizz.image}'/>
          <div class="gradient">
          </div>
          <p class="quizz-title">${serverQuizz.title} </p>
        </div>

        <div class="server-quizz">
          <img src='${serverQuizz.image}'/>
          <div class="gradient">
          </div>
          <p class="quizz-title">${serverQuizz.title} </p>
        </div>

        <div class="server-quizz">
          <img src='${serverQuizz.image}'/>
          <div class="gradient">
          </div>
          <p class="quizz-title">${serverQuizz.title} </p>
        </div>
      `
      yourQuizzes.innerHTML += 
      `
      <div class="your-quizz" onclick="screen2(this)">
          <img src='${serverQuizz.image}'/>
          <div class="gradient">
          </div>
          <p class="quizz-title">${serverQuizz.title} </p>
        </div>
      `
      // 

    }
  }
}

listQuizzes()

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
        <div class="toggle" onclick="showItem(this)">
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
      IsCorrectAnswer: true,
    };

    question.answers.push(correctAnswer);

    for (let j = 0; j < 3; j++) {
      const answer = {
        text: document.querySelector(`.question-${i}-wrong-${j} .answer`).value,
        image: document.querySelector(`.question-${i}-wrong-${j} .url`).value,
        IsCorrectAnswer: false,
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
      console.log("titulo errado")
      return false;
    } else if (!checkColor(question.color)) {
      console.log("cor errada pergunta")
      return false;
    }

    if (question.answers.length < 2) {
      console.log("qtd respostas errada")
      return false;
    }

    for (let j = 0; j < question.answers.length; j++) {
      const answer = question.answers[j];

      if (answer.text.length === 0) {
        console.log("resposta nula")
        return false;
      } else if (!checkURL(answer.image)) {
        console.log("url errada resposta")
        return false;
      }
    }
  }

  return true;
}

function generateLevels() {
  const valid = checkQuizzQuestions();

  if (!valid) {
    alert("Preencha os dados corretamente!");
    return;
  }
  alert("deu tudo certo nas perguntas");
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

// generateQuizz(); // coloquei essa função inicial somente para testar o layout, pode remover ela
