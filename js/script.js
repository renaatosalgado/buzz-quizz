const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const QUIZZES_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
const APP = document.querySelector(".app");
let serverQuizz = undefined;
let quizzes;
let database1;

getQuizzes();
//============== TELA 01 ==============//

let USER_QUIZZES_IDS = [];

function getQuizzes() {
  const promise = axios.get(`${URL_API}/quizzes`);
  promise.then(listQuizzes);
}

function listQuizzes(response) {
  const yourQuizzes = getQuizzesLocalStorage();

  USER_QUIZZES_IDS = yourQuizzes.map((quizz) => quizz.id);
  const filteresQuizzesIds = filterQuizzes(response.data);

  console.log(filteresQuizzesIds)

  APP.innerHTML = `
      <div class="your-quizzes not-created">
        <p class="quizz-not-created">Você não criou nenhum quizz ainda :(</p>
        <button class="create-quizz-btn" data-identifier="create-quizz" onclick="generateQuizz()">Criar Quizz</button>
      </div>
      <div class="general-quizzes" data-identifier="general-quizzes">
        <p class="all-quizzes-title">Todos os Quizzes</>
        <div class="general-quizzes-list"></div>
      </div>
    `;

  if (filteresQuizzesIds.user.length !== 0) {
    const yourQuizzesElement = document.querySelector(".your-quizzes");

    yourQuizzesElement.innerHTML = `
    <div class="your-quizzes">
      <div class="your-quizzes-header">
        <p class="">Seus Quizzes</p>
        <ion-icon name="add-circle" class="add-quizz-btn" onclick="generateQuizz();"></ion-icon>
      </div>
      <div class="your-quizzes-list"></div>
    </div>  
    `;

    yourQuizzesElement.classList.replace("not-created", "created");

    const yourQuizzesList = document.querySelector(".your-quizzes-list");

    for (let i = 0; i < filteresQuizzesIds.user.length; i++) {
      let yourQuizz = filteresQuizzesIds.user[i];

      if(yourQuizz.title === undefined) {
        yourQuizzesList.innerHTML += "";
      } else {

      yourQuizzesList.innerHTML += `
        <div class="your-quizz" onclick="loadQuiz(this)">
            <img src='${yourQuizz.image}'/>
            <div class="gradient"></div>
            <p class="quizz-title">${yourQuizz.title} </p>
            <span class="hidden">${yourQuizz.id}</span>
        </div>      
      `;
      }
    }
  }

  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );
  promise.then(loadQuizzes);
}

function filterQuizzes(quizzes) {
  let user = [];
  let others = [];

  user = quizzes.filter(function (quizz) {
    if (USER_QUIZZES_IDS.includes(quizz.id)) {
      return true;
    }
  });
  others = quizzes.filter(function (quizz) {
    if (!USER_QUIZZES_IDS.includes(quizz.id)) {
      return true;
    }
  });

  return {
    user,
    others,
  };
}

function loadQuizzes(answer) {

  quizzes = answer.data;

  const allQuizzes = document.querySelector(".general-quizzes-list");
  
  for (let i = 0; i < quizzes.length; i++) {
    serverQuizz = quizzes[i];

    if ("questions" in serverQuizz) {
      allQuizzes.innerHTML += `
        <div class="server-quizz" onclick="loadQuiz(this)">
          <img src='${serverQuizz.image}'/>
          <div class="gradient">
          </div>
          <p class="quizz-title">${serverQuizz.title}</p>
          <span class="hidden">${serverQuizz.id}</span>
        </div>
      `;
    }
  }
}

//============== TELA 02 ==============//

///variaveis globais da tela 2
let quiz_point = 0; //variável de pontuação
let prommisse_quiz_selected = axios.get(QUIZZES_API);
let quiz_data; //dados da requisição, todos os quizzes
let quiz_selecionado; //somnete o quiz selecioando no array acima
let result;
let counter = 0;
let levels;

function onSelectedAnswer(element) {
  //função da dinamica das repostas
  counter++;
  element.classList.add(".selecionado");
  let myElementParent = element.parentNode.querySelector("#true");

  element.parentNode.classList.remove("normal-style");

  element.classList.add("selected");

  if (element == myElementParent) {
    quiz_point++;
  } else {
  }
  element.parentNode.classList.add("transparent");
  let next_element =
    element.parentNode.parentNode.nextSibling.nextElementSibling;
  if (next_element != null) {
    scrollToCard2(next_element, 2000);
  }

  quizResult();
}
function loadQuiz(response) {
  //função que carrega um quiz
  result = 0;
  counter = 0;
  levels = 0;
  quiz_point = 0;
  database1 = response;

  quiz_data = response.querySelector("span").innerHTML;
  //quiz_selecionado=quiz_data[];// aqui vai o quiz selecionado - oelo indice array data
  quiz_selecionado = quizzes.filter((p) => p.id == quiz_data)[0]; //aqui podemos selecionar por id

  let questions = quiz_selecionado.questions; // aqui vai as questões

  levels = quiz_selecionado.levels;
  //let answers = (questions[0].answers).sort(randOrd) // aqui vai as respostas refererente a  questão 0

  APP.innerHTML = `   
    <div class="top-quiz-container">
    <img class ="icon-main-image"src="${quiz_selecionado.image}" alt="">
    <span  class="quiz-title">${quiz_selecionado.title}</span>
    </div>
    <div class="quiz-container">         
    </div>
  `;
  document.querySelector(".quiz-container").scrollIntoView();
  for (let i = 0; i < questions.length; i++) {
    let answers = questions[i].answers.sort(randOrd);

    APP.querySelector(".quiz-container").innerHTML += `
    <div class="question-container" data-identifier="question">
      <div style="background-color: ${questions[i].color}" class="question-title"><span>${questions[i].title}</span></div>
      <div class="quiz-answers normal-style">
      </div>
    </div>    
    `;

    for (let p = 0; p < answers.length; p++) {
      APP.querySelector(".quiz-container").lastElementChild.querySelector(
        ".quiz-answers"
      ).innerHTML += `        
      <div class="answer" onclick="onSelectedAnswer(this)" id="${answers[p].isCorrectAnswer}" data-identifier="answer">
        <img class = "answer-img"src="${answers[p].image}" alt="">
        <p class="normal-style">${answers[p].text}</p>
      </div>
      `;
    }
  }
}
function reload() {
  loadQuiz(database1);
}
function quizResult() {
  let total_points = quiz_selecionado.questions.length;
  result = Math.ceil((quiz_point / total_points) * 100);

  let levels = quiz_selecionado.levels;

  const min_value = levels.map((p) => p.minValue);

  let my_level = min_value.filter((value) => {
    return value <= result;
  });

  let level_selected = levels[my_level.length - 1];

  if (quiz_selecionado.questions.length == counter) {

    APP.querySelector(".quiz-container").innerHTML += `   
    <div class="question-container" id="result-box"  data-identifier="quizz-result">
      <div class="result-title-container">
      <p>${result} % de acerto: ${level_selected.title} </p>
      </div>
      <div class="box-result">
      <img class ="image-result"src="${level_selected.image}" alt="">
      <p class="text-result">${level_selected.text}</p>
      </div>    
    </div>
    <button class="reload-button" onclick="reload()"6>Reiniciar Quizz</button>
    <p class="go-back-button" onclick="getQuizzes()">Voltar pra home</p>

  `;
    scrollToCard2(document.querySelector("#result-box"), 2000);
  }
}

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
        <input type="text" class="title basic-info" placeholder="Título do seu quizz">
        <div class="wrong-input-message wrong-title hidden">O título deve possuir de 20 a 65 caracteres</div>

        <input type="text" class="url basic-info" placeholder="URL da imagem do seu quizz">
        <div class="wrong-input-message wrong-url hidden">O valor informado não é uma URL válida</div>

        <input type="number" class="quantity-questions basic-info" placeholder="Quantidade de perguntas do quizz">
        <div class="wrong-input-message wrong-questionNumber hidden">O quizz deve ter no mínimo 3 perguntas</div>

        <input type="number" class="quantity-levels basic-info" placeholder="Quantidade de níveis do quizz">
        <div class="wrong-input-message wrong-levelNumber hidden">O quizz deve ter no mínimo 2 níveis de classificação</div>

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

  let errorCounter = 0;

  if (CREATED_QUIZZ.title.length < 20 || CREATED_QUIZZ.title.length > 65) {
    errorCounter++;

    const wrongTitle = document.querySelector(".wrong-title");
    const wrongBackground = document.querySelector(".basic-info.title");

    if (wrongTitle.classList.contains("hidden"))
      wrongTitle.classList.remove("hidden");
    wrongBackground.classList.add("wrong-input-background");
  } else {
    document.querySelector(".wrong-title").classList.add("hidden");
    document
      .querySelector(".basic-info.title")
      .classList.remove("wrong-input-background");
  }

  if (!checkURL(CREATED_QUIZZ.image)) {
    errorCounter++;

    const wrongUrl = document.querySelector(".wrong-url");
    const wrongBackground = document.querySelector(".basic-info.url");

    if (wrongUrl.classList.contains("hidden"))
      wrongUrl.classList.remove("hidden");
    wrongBackground.classList.add("wrong-input-background");
  } else {
    document.querySelector(".wrong-url").classList.add("hidden");
    document
      .querySelector(".basic-info.url")
      .classList.remove("wrong-input-background");
  }

  if (CREATED_QUIZZ.qttQuestions < 3) {
    errorCounter++;

    const wrongQuestionQtt = document.querySelector(".wrong-questionNumber");
    const wrongBackground = document.querySelector(
      ".basic-info.quantity-questions"
    );

    if (wrongQuestionQtt.classList.contains("hidden"))
      wrongQuestionQtt.classList.remove("hidden");
    wrongBackground.classList.add("wrong-input-background");
  } else {
    document.querySelector(".wrong-questionNumber").classList.add("hidden");
    document
      .querySelector(".basic-info.quantity-questions")
      .classList.remove("wrong-input-background");
  }

  if (CREATED_QUIZZ.qttLevels < 2) {
    errorCounter++;

    const wrongLevelQtt = document.querySelector(".wrong-levelNumber");
    const wrongBackground = document.querySelector(
      ".basic-info.quantity-levels"
    );

    if (wrongLevelQtt.classList.contains("hidden"))
      wrongLevelQtt.classList.remove("hidden");
    wrongBackground.classList.add("wrong-input-background");
  } else {
    document.querySelector(".wrong-levelNumber").classList.add("hidden");
    document
      .querySelector(".basic-info.quantity-levels")
      .classList.remove("wrong-input-background");
  }

  return errorCounter++;
}

function generateQuestions() {
  const valid = checkQuizzBasicInfo();
  if (valid !== 0) {
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
        <div class="toggle" onclick="showItem(this), scrollToCard(this)" data-identifier="expand">
          <ion-icon name="create-outline"></ion-icon>
        </div>
      </div>

      <div class="body-card" data-identifier="question">
        <input type="text" class="question-${index}-text" placeholder="Texto da pergunta" />
        <input type="text" class="question-${index}-color" placeholder="Cor de fundo da pergunta" />

        <div class="label">Resposta correta</div>

        <div class="group">
          <input type="text" class="question-${index}-correct-answer" placeholder="Resposta correta" />
          <input type="text" class="question-${index}-correct-url" placeholder="URL da imagem" />
        </div>

        <div class="label">Respostas incorretas</div>

        <div class="group question-${index}-wrong-0">
          <input type"text" class="answer-form" placeholder="Resposta incorreta 1" />
          <input type="text" class="url" placeholder="URL da imagem 1" />
        </div>

        <div class="group question-${index}-wrong-1">
          <input type"text" class="answer-form" placeholder="Resposta incorreta 2" />
          <input type="text" class="url" placeholder="URL da imagem 2" />
        </div>

        <div class="group question-${index}-wrong-2">
          <input type"text" class="answer-form" placeholder="Resposta incorreta 3" />
          <input type="text" class="url" placeholder="URL da imagem 3" />
        </div>

        <div class="group question-${index}-wrong-3">
          <input type"text" class="answer-form" placeholder="Resposta incorreta 4" />
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
        text: document.querySelector(`.question-${i}-wrong-${j} .answer-form`)
          .value,
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
      return false;
    } else if (!checkColor(question.color)) {
      return false;
    }

    if (question.answers.length < 2) {
      return false;
    }

    for (let j = 0; j < question.answers.length; j++) {
      const answer = question.answers[j];

      if (answer.text.length === 0) {
        return false;
      } else if (!checkURL(answer.image)) {
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
        <div class="toggle" onclick="showItem(this), scrollToCard(this)" data-identifier="expand">
          <ion-icon name="create-outline"></ion-icon>
        </div>
      </div>

      <div class="body-card" data-identifier="level">
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

      <div class="quizz" onclick="loadQuiz(this)">
        <img src="${CREATED_QUIZZ.image}">
        <div class="overlay"></div>
        <div class="title">${CREATED_QUIZZ.title}</div>
        <span class="hidden">${id}</span>
      </div>

      <button class="access-quizz" onclick="loadQuiz("<span class="hidden">${id}</span>")">Acessar Quizz</button>
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
    image: quizz.image,
    title: quizz.title,
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
function randOrd() {
  //função para embaralhar as respostas
  return Math.round(Math.random()) - 0.5;
}
function checkURL(url) {
  const rule =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  return rule.test(url);
}

function checkColor(color) {
  const rule = /^\#([0-9]|[A-F]|[a-f]){6}$/;
  return rule.test(color);
}

function scrollToCard2(element, time) {
  function scroll() {
    element.scrollIntoView({ behavior: "smooth" });
  }

  setTimeout(scroll, time);
}

function scrollToCard(element) {
  function scroll() {
    element.scrollIntoView({ behavior: "smooth" });
  }

  setTimeout(scroll, 100);
}
