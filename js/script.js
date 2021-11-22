const URL_API = "https://mock-api.bootcamp.respondeai.com.br/api/v4/buzzquizz";
const QUIZZES_API ="https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
const APP = document.querySelector(".app");



//============== TELA 01 ==============//
function listQuizzes(){
  APP.innerHTML = 
  `
    <div class="your-quizzes not-created">
      <p class="quizz-not-created">Você não criou nenhum quizz ainda :(</p>
      <button class="create-quizz-btn" data-identifier="create-quizz" onclick="generateQuizz()">Criar Quizz</button>
    </div>
    <div class="general-quizzes" data-identifier="general-quizzes">
    <p class="all-quizzes-title">Todos os Quizzes</>
    <div class="general-quizzes-list"></div>
    </div>
  ` 
// CÓDIGO A SER ADICIONADO QUANDO HOUVER QUIZZES CRIADOS
  // let yourQuizzes = 
  // `
  //   <div class="your-quizzes">
  //     <div class="your-quizzes-header">
  //       <p class="">Seus Quizzes</p>
  //       <ion-icon name="add-circle" class=""></ion-icon>
  //     </div>
  //     <div class="your-quizzes-list"></div>
  //   </div>
  // `
  // const createQuizzMenu = document.querySelector('.your-quizzes')
  // createQuizzMenu.innerHTML = yourQuizzes
  // createQuizzMenu.classList.replace('not-created','created')


  const promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes')
  promise.then(loadQuizzes)
}

function loadQuizzes(answer){
  console.log(answer)
  let quizzes = answer.data
  const allQuizzes = document.querySelector('.general-quizzes-list')
  const yourQuizzes = document.querySelector('.your-quizzes-list')
  for(let i=0; i<quizzes.length; i++){
    let serverQuizz = quizzes[i]

    if('questions' in serverQuizz){
      allQuizzes.innerHTML += 
      `
        <div class="server-quizz" onclick="selectQuizz(this)">
          <img src='${serverQuizz.image}'/>
          <div class="gradient">
          </div>
          <p class="quizz-title">${serverQuizz.title} </p>
        </div>
      `
      // Forçando quizzes criados pelo usuário. Feito para testes
      
      // yourQuizzes.innerHTML += 
      // `
      // <div class="your-quizz" onclick="screen2(this)">
      //     <img src='${serverQuizz.image}'/>
      //     <div class="gradient">
      //     </div>
      //     <p class="quizz-title">${serverQuizz.title} </p>
      //   </div>
      // `
    }
  }
}



//listQuizzes()

//============== TELA 02 ==============//


///variaveis globais da tela 2
let quiz_point=0;//variável de pontuação
let prommisse_quiz_selected=axios.get(QUIZZES_API);
let quiz_data; //dados da requisição, todos os quizzes
let quiz_selecionado; //somnete o quiz selecioando no array acima
let result;
let counter=0;
let levels;

function frame_2(){ // função que carrega a pagina 2
  prommisse_quiz_selected.then(loadQuiz)
  prommisse_quiz_selected.catch(console.log("Eita"))
}
function onSelectedAnswer(element){ //função da dinamica das repostas
  counter++;
  element.classList.add(".selecionado")
  let myElementParent = (element.parentNode).querySelector("#true");
 
  (element.parentNode).classList.remove("normal-style")
  console.log("clique")

  element.classList.add("selected")

  if(element==myElementParent){
    quiz_point++;
    alert("acertou "+ quiz_point)
  }
  else{alert("errou "+ quiz_point)}
  (element.parentNode).classList.add("transparent")
  let next_element = ((element.parentNode).parentNode.nextSibling.nextElementSibling)
  console.log(next_element)
  if(next_element!=null) 
  {
    scrollToCard2(next_element,2000)
  }
  
  quizResult()
}
function loadQuiz(response){//função que carrega um quiz
  
  quiz_data=response.data;
  //quiz_selecionado=quiz_data[];// aqui vai o quiz selecionado - oelo indice array data
  //console.log(quiz_selecionado);
  quiz_selecionado= quiz_data.filter(p => p.id=="635")[0]//aqui podemos selecionar por id
  console.log(quiz_data);
  let questions = quiz_selecionado.questions; // aqui vai as questões 
  levels = quiz_selecionado.levels;
  //let answers = (questions[0].answers).sort(randOrd) // aqui vai as respostas refererente a  questão 0
  console.log(quiz_selecionado);
  
  APP.innerHTML=`   
    <div class="top-quiz-container">
    <img class ="icon-main-image"src="${quiz_selecionado.image}" alt="">
    <span  class="quiz-title">${quiz_selecionado.title}</span>
    </div>
    <div class="quiz-container">         
    </div>
  `;
  for(let i=0;i<questions.length;i++){
    let answers = (questions[i].answers).sort(randOrd)

    APP.querySelector(".quiz-container").innerHTML +=
    `
    <div class="question-container">
      <div style="background-color: ${questions[i].color}" class="question-title"><span>${questions[i].title}</span></div>
      <div class="quiz-answers normal-style">
        <div class="answer" onclick="onSelectedAnswer(this)" id="${answers[0].isCorrectAnswer}">
          <img src="${answers[0].image}" alt="" >
          <p>${answers[0].text}</p>
        </div>
        <div class="answer" onclick="onSelectedAnswer(this)" id="${answers[1].isCorrectAnswer}">
          <img src="${answers[1].image}" alt="">
          <p class="normal-style">${answers[1].text}</p> 
        </div>
        <div class="answer" onclick="onSelectedAnswer(this)" id="${answers[2].isCorrectAnswer}">
          <img src="${answers[2].image}" alt="">
          <p class="normal-style">${answers[2].text}</p>
        </div>
        <div class="answer" onclick="onSelectedAnswer(this)" id="${answers[3].isCorrectAnswer}">
          <img src="${answers[3].image}" alt="">
          <p class="normal-style">${answers[3].text}</p>
        </div>
      </div>
    </div>    
    `
  
}}

function quizResult(){
  let total_points= quiz_selecionado.questions.length;
  result = Math.ceil((quiz_point/total_points)*100)
  
  let levels = quiz_selecionado.levels;
  const min_value = levels.map(p => p.minValue);
  let my_level = min_value.filter((value)=>{return value<=result})
  console.log(my_level)
  let level_selected = levels[my_level.length-1]

  if(quiz_selecionado.questions.length==counter){//quando finalizar
    
    console.log("result");
    APP.querySelector(".quiz-container").innerHTML+=`   
    <div class="question-container" id="result-box">
      <div class="result-title-container">
      <p>${result} % de acerto: ${level_selected.title} </p>
      </div>
      <div class="box-result">
      <img class ="image-result"src="${level_selected.image}" alt="">
      <p class="text-result">${level_selected.text}</p>
      </div>    
    </div>
    <button class="reload-button">Reiniciar Quiz</button>
    <p class="go-back-button" onclick="getQuizzes()">Voltar pra home</p>

  `;
  scrollToCard2(document.querySelector("#result-box"),2000)
  }


}



frame_2() // função de teste  para a tela 2




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
function randOrd(){ //função para embaralhar as respostas
  return (Math.round(Math.random())-0.5);
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

function scrollToCard2(element,time) {
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
